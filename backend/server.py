from pathlib import Path
from dotenv import load_dotenv
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os, logging, uuid, hashlib, ssl, socket, secrets, re
import bcrypt, jwt, requests
from datetime import datetime, timezone, timedelta
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Any
import dns.resolver

# ─── Config ───
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]
JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALGORITHM = "HS256"

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ─── Password Hashing ───
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))

# ─── JWT Tokens ───
def create_access_token(user_id: str, email: str) -> str:
    return jwt.encode({"sub": user_id, "email": email, "exp": datetime.now(timezone.utc) + timedelta(minutes=60), "type": "access"}, JWT_SECRET, algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    return jwt.encode({"sub": user_id, "exp": datetime.now(timezone.utc) + timedelta(days=7), "type": "refresh"}, JWT_SECRET, algorithm=JWT_ALGORITHM)

# ─── Auth Helper ───
async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Non authentifie")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Token invalide")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="Utilisateur non trouve")
        user["_id"] = str(user["_id"])
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expire")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token invalide")

def set_auth_cookies(response: Response, access_token: str, refresh_token: str):
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="lax", max_age=3600, path="/")
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=False, samesite="lax", max_age=604800, path="/")

# ─── Brute Force Protection ───
async def check_brute_force(identifier: str):
    attempt = await db.login_attempts.find_one({"identifier": identifier})
    if attempt and attempt.get("locked_until"):
        if datetime.now(timezone.utc) < attempt["locked_until"]:
            raise HTTPException(status_code=429, detail="Trop de tentatives. Reessayez dans 15 minutes.")

async def record_failed_attempt(identifier: str):
    attempt = await db.login_attempts.find_one({"identifier": identifier})
    if attempt:
        new_count = attempt.get("attempts", 0) + 1
        update = {"$set": {"attempts": new_count, "last_attempt": datetime.now(timezone.utc)}}
        if new_count >= 5:
            update["$set"]["locked_until"] = datetime.now(timezone.utc) + timedelta(minutes=15)
        await db.login_attempts.update_one({"identifier": identifier}, update)
    else:
        await db.login_attempts.insert_one({"identifier": identifier, "attempts": 1, "last_attempt": datetime.now(timezone.utc)})

async def clear_failed_attempts(identifier: str):
    await db.login_attempts.delete_one({"identifier": identifier})

# ─── Models ───
class RegisterRequest(BaseModel):
    email: str
    password: str
    name: str = ""

class LoginRequest(BaseModel):
    email: str
    password: str

class UserDataSync(BaseModel):
    diagnostic_answers: Optional[dict] = None
    scores: Optional[dict] = None
    action_plan: Optional[list] = None
    reminders: Optional[dict] = None

class AddEmailRequest(BaseModel):
    email: str

class CheckDomainRequest(BaseModel):
    domain: str

class CheckPasswordRequest(BaseModel):
    password: str

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    context: Optional[str] = None
    history: Optional[List[ChatMessage]] = []

# ─── AUTH ENDPOINTS ───
@api_router.post("/auth/register")
async def register(req: RegisterRequest, response: Response):
    email = req.email.strip().lower()
    if not re.match(r'^[^@]+@[^@]+\.[^@]+$', email):
        raise HTTPException(status_code=400, detail="Email invalide")
    if len(req.password) < 6:
        raise HTTPException(status_code=400, detail="Le mot de passe doit contenir au moins 6 caracteres")
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="Cet email est deja utilise")
    user_doc = {
        "email": email,
        "password_hash": hash_password(req.password),
        "name": req.name or email.split("@")[0],
        "role": "user",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "diagnostic_answers": None,
        "scores": None,
        "action_plan": None,
        "reminders": None,
    }
    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)
    access = create_access_token(user_id, email)
    refresh = create_refresh_token(user_id)
    set_auth_cookies(response, access, refresh)
    return {"id": user_id, "email": email, "name": user_doc["name"], "role": "user"}

@api_router.post("/auth/login")
async def login(req: LoginRequest, request: Request, response: Response):
    email = req.email.strip().lower()
    ip = request.client.host if request.client else "unknown"
    identifier = f"{ip}:{email}"
    await check_brute_force(identifier)
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(req.password, user["password_hash"]):
        await record_failed_attempt(identifier)
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    await clear_failed_attempts(identifier)
    user_id = str(user["_id"])
    access = create_access_token(user_id, email)
    refresh = create_refresh_token(user_id)
    set_auth_cookies(response, access, refresh)
    return {"id": user_id, "email": email, "name": user.get("name", ""), "role": user.get("role", "user")}

@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"message": "Deconnecte"}

@api_router.get("/auth/me")
async def me(request: Request):
    user = await get_current_user(request)
    return {"id": user["_id"], "email": user["email"], "name": user.get("name", ""), "role": user.get("role", "user")}

@api_router.post("/auth/refresh")
async def refresh_token(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="Token de rafraichissement manquant")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Token invalide")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="Utilisateur non trouve")
        new_access = create_access_token(str(user["_id"]), user["email"])
        response.set_cookie(key="access_token", value=new_access, httponly=True, secure=False, samesite="lax", max_age=3600, path="/")
        return {"message": "Token rafraichi"}
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token invalide")

# ─── USER DATA SYNC ───
@api_router.post("/user/sync")
async def sync_user_data(data: UserDataSync, request: Request):
    user = await get_current_user(request)
    update = {}
    if data.diagnostic_answers is not None:
        update["diagnostic_answers"] = data.diagnostic_answers
    if data.scores is not None:
        update["scores"] = data.scores
    if data.action_plan is not None:
        update["action_plan"] = data.action_plan
    if data.reminders is not None:
        update["reminders"] = data.reminders
    if update:
        await db.users.update_one({"_id": ObjectId(user["_id"])}, {"$set": update})
    return {"message": "Donnees synchronisees"}

@api_router.get("/user/data")
async def get_user_data(request: Request):
    user = await get_current_user(request)
    full_user = await db.users.find_one({"_id": ObjectId(user["_id"])}, {"password_hash": 0})
    if full_user:
        full_user["_id"] = str(full_user["_id"])
    return {
        "diagnostic_answers": full_user.get("diagnostic_answers"),
        "scores": full_user.get("scores"),
        "action_plan": full_user.get("action_plan"),
        "reminders": full_user.get("reminders"),
    }

# ─── EMAIL MONITORING ───
@api_router.get("/emails")
async def list_emails(request: Request):
    user = await get_current_user(request)
    emails = await db.monitored_emails.find({"user_id": user["_id"]}, {"_id": 0}).to_list(50)
    return emails

@api_router.post("/emails")
async def add_email(req: AddEmailRequest, request: Request):
    user = await get_current_user(request)
    email = req.email.strip().lower()
    if not re.match(r'^[^@]+@[^@]+\.[^@]+$', email):
        raise HTTPException(status_code=400, detail="Email invalide")
    existing = await db.monitored_emails.find_one({"user_id": user["_id"], "email": email})
    if existing:
        raise HTTPException(status_code=400, detail="Cet email est deja surveille")
    count = await db.monitored_emails.count_documents({"user_id": user["_id"]})
    if count >= 10:
        raise HTTPException(status_code=400, detail="Maximum 10 emails surveilles")
    doc = {
        "id": str(uuid.uuid4()),
        "user_id": user["_id"],
        "email": email,
        "added_at": datetime.now(timezone.utc).isoformat(),
        "last_check": None,
        "breach_results": None,
        "domain_results": None,
    }
    await db.monitored_emails.insert_one(doc)
    doc.pop("_id", None)
    return doc

@api_router.delete("/emails/{email_id}")
async def remove_email(email_id: str, request: Request):
    user = await get_current_user(request)
    result = await db.monitored_emails.delete_one({"user_id": user["_id"], "id": email_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Email non trouve")
    return {"message": "Email supprime"}

# ─── BREACH CHECK ───
KNOWN_BREACHES_DB = {
    "linkedin.com": [{"name": "LinkedIn", "date": "2012-05", "records": 164000000, "data": ["emails", "mots de passe"]}],
    "adobe.com": [{"name": "Adobe", "date": "2013-10", "records": 153000000, "data": ["emails", "mots de passe", "indices"]}],
    "yahoo.com": [{"name": "Yahoo", "date": "2013-08", "records": 3000000000, "data": ["emails", "mots de passe", "noms", "dates de naissance"]},
                  {"name": "Yahoo (2014)", "date": "2014-01", "records": 500000000, "data": ["emails", "mots de passe", "questions de securite"]}],
    "dropbox.com": [{"name": "Dropbox", "date": "2012-07", "records": 68000000, "data": ["emails", "mots de passe"]}],
    "myspace.com": [{"name": "MySpace", "date": "2008-07", "records": 360000000, "data": ["emails", "mots de passe", "noms"]}],
    "canva.com": [{"name": "Canva", "date": "2019-05", "records": 137000000, "data": ["emails", "noms", "villes"]}],
    "tumblr.com": [{"name": "Tumblr", "date": "2013-02", "records": 65000000, "data": ["emails", "mots de passe"]}],
    "zynga.com": [{"name": "Zynga", "date": "2019-09", "records": 173000000, "data": ["emails", "mots de passe", "noms"]}],
    "dubsmash.com": [{"name": "Dubsmash", "date": "2018-12", "records": 162000000, "data": ["emails", "mots de passe", "noms"]}],
    "twitter.com": [{"name": "Twitter", "date": "2022-01", "records": 5400000, "data": ["emails", "numeros de telephone"]}],
    "facebook.com": [{"name": "Facebook", "date": "2019-04", "records": 533000000, "data": ["emails", "numeros de telephone", "noms"]}],
    "wattpad.com": [{"name": "Wattpad", "date": "2020-06", "records": 270000000, "data": ["emails", "mots de passe", "noms"]}],
    "deezer.com": [{"name": "Deezer", "date": "2019-09", "records": 229000000, "data": ["emails", "noms", "dates de naissance"]}],
    "dailymotion.com": [{"name": "Dailymotion", "date": "2016-10", "records": 85000000, "data": ["emails", "mots de passe"]}],
}

# Common email providers and their known security incidents
EMAIL_PROVIDER_RISKS = {
    "gmail.com": {"provider": "Google Gmail", "risk": "faible", "mfa_support": True, "notes": "Bonne securite, support 2FA avance"},
    "outlook.com": {"provider": "Microsoft Outlook", "risk": "faible", "mfa_support": True, "notes": "Bonne securite, support 2FA"},
    "hotmail.com": {"provider": "Microsoft Hotmail", "risk": "faible", "mfa_support": True, "notes": "Bonne securite via Microsoft"},
    "yahoo.com": {"provider": "Yahoo", "risk": "eleve", "mfa_support": True, "notes": "Historique de fuites massives (3 milliards de comptes en 2013)"},
    "yahoo.fr": {"provider": "Yahoo France", "risk": "eleve", "mfa_support": True, "notes": "Meme infrastructure que Yahoo.com"},
    "aol.com": {"provider": "AOL", "risk": "modere", "mfa_support": True, "notes": "Service vieillissant, securite basique"},
    "orange.fr": {"provider": "Orange", "risk": "modere", "mfa_support": False, "notes": "Fournisseur telecom, securite standard"},
    "free.fr": {"provider": "Free", "risk": "modere", "mfa_support": False, "notes": "Fournisseur telecom, securite basique"},
    "sfr.fr": {"provider": "SFR", "risk": "modere", "mfa_support": False, "notes": "Fournisseur telecom"},
    "laposte.net": {"provider": "La Poste", "risk": "modere", "mfa_support": False, "notes": "Service email basique"},
    "wanadoo.fr": {"provider": "Wanadoo/Orange", "risk": "modere", "mfa_support": False, "notes": "Service ancien, migre vers Orange"},
    "icloud.com": {"provider": "Apple iCloud", "risk": "faible", "mfa_support": True, "notes": "Bonne securite, 2FA integre"},
    "protonmail.com": {"provider": "ProtonMail", "risk": "tres_faible", "mfa_support": True, "notes": "Chiffrement de bout en bout, tres securise"},
    "proton.me": {"provider": "Proton", "risk": "tres_faible", "mfa_support": True, "notes": "Chiffrement de bout en bout"},
}

@api_router.post("/security/check-email")
async def check_email_breach(req: AddEmailRequest, request: Request):
    user = await get_current_user(request)
    email = req.email.strip().lower()
    domain = email.split("@")[1] if "@" in email else ""

    breaches_found = []
    risk_score = 0

    # Check against known breach database
    for breach_domain, breaches in KNOWN_BREACHES_DB.items():
        if domain == breach_domain or domain.endswith("." + breach_domain):
            for b in breaches:
                breaches_found.append(b)
                risk_score += min(b["records"] / 10000000, 30)

    # Check email provider risk
    provider_info = EMAIL_PROVIDER_RISKS.get(domain, {"provider": domain, "risk": "inconnu", "mfa_support": False, "notes": "Fournisseur non reference"})
    risk_map = {"tres_faible": 0, "faible": 5, "modere": 15, "eleve": 30, "inconnu": 20}
    risk_score += risk_map.get(provider_info["risk"], 10)

    # HIBP Pwned Passwords API (k-anonymity) - check email prefix as pseudo-password
    hibp_count = 0
    try:
        email_hash = hashlib.sha1(email.encode("utf-8")).hexdigest().upper()
        prefix = email_hash[:5]
        suffix = email_hash[5:]
        resp = requests.get(f"https://api.pwnedpasswords.com/range/{prefix}", timeout=5)
        if resp.status_code == 200:
            for line in resp.text.splitlines():
                h, count = line.split(":")
                if h == suffix:
                    hibp_count = int(count)
                    risk_score += min(hibp_count / 100, 20)
                    break
    except Exception:
        pass

    # Normalize risk score
    risk_score = min(100, int(risk_score))
    if risk_score >= 70:
        risk_level = "critique"
    elif risk_score >= 40:
        risk_level = "eleve"
    elif risk_score >= 20:
        risk_level = "modere"
    else:
        risk_level = "faible"

    result = {
        "email": email,
        "domain": domain,
        "risk_score": risk_score,
        "risk_level": risk_level,
        "breaches_found": breaches_found,
        "breach_count": len(breaches_found),
        "hibp_appearances": hibp_count,
        "provider_info": provider_info,
        "checked_at": datetime.now(timezone.utc).isoformat(),
        "recommendations": generate_email_recommendations(breaches_found, provider_info, hibp_count),
    }

    # Update monitored email if exists
    await db.monitored_emails.update_one(
        {"user_id": user["_id"], "email": email},
        {"$set": {"breach_results": result, "last_check": datetime.now(timezone.utc).isoformat()}},
    )
    return result

def generate_email_recommendations(breaches, provider_info, hibp_count):
    recs = []
    if breaches:
        recs.append({"priority": "critique", "text": f"Cet email est associe a {len(breaches)} fuite(s) de donnees connue(s). Changez immediatement votre mot de passe."})
        recs.append({"priority": "critique", "text": "Si vous utilisiez le meme mot de passe sur d'autres services, changez-les aussi."})
    if hibp_count > 0:
        recs.append({"priority": "eleve", "text": f"Cette adresse apparait {hibp_count} fois dans des bases de donnees compromises."})
    if not provider_info.get("mfa_support"):
        recs.append({"priority": "eleve", "text": "Votre fournisseur email ne supporte pas nativement la double authentification. Envisagez de migrer vers un fournisseur plus securise."})
    elif provider_info.get("risk") in ["eleve", "modere"]:
        recs.append({"priority": "moyen", "text": "Activez la double authentification (2FA) sur ce compte si ce n'est pas deja fait."})
    recs.append({"priority": "moyen", "text": "Utilisez un mot de passe unique et complexe pour ce compte."})
    if not breaches and hibp_count == 0:
        recs.append({"priority": "info", "text": "Aucune fuite connue detectee pour cet email. Restez vigilant et maintenez de bonnes pratiques."})
    return recs

# ─── DOMAIN CHECK ───
def check_dns_record(domain, record_type):
    try:
        answers = dns.resolver.resolve(domain, record_type)
        return [str(r) for r in answers]
    except Exception:
        return []

def check_spf(domain):
    txt_records = check_dns_record(domain, "TXT")
    for r in txt_records:
        if "v=spf1" in r:
            return {"found": True, "record": r, "status": "ok"}
    return {"found": False, "record": None, "status": "missing"}

def check_dmarc(domain):
    records = check_dns_record(f"_dmarc.{domain}", "TXT")
    for r in records:
        if "v=DMARC1" in r:
            policy = "none"
            if "p=reject" in r:
                policy = "reject"
            elif "p=quarantine" in r:
                policy = "quarantine"
            return {"found": True, "record": r, "policy": policy, "status": "ok" if policy != "none" else "weak"}
    return {"found": False, "record": None, "policy": None, "status": "missing"}

def check_dkim(domain):
    selectors = ["google", "default", "selector1", "selector2", "mail", "dkim", "s1", "s2", "k1"]
    for sel in selectors:
        records = check_dns_record(f"{sel}._domainkey.{domain}", "TXT")
        if records:
            return {"found": True, "selector": sel, "status": "ok"}
    return {"found": False, "selector": None, "status": "not_detected"}

def check_ssl_certificate(domain):
    try:
        context = ssl.create_default_context()
        with socket.create_connection((domain, 443), timeout=5) as sock:
            with context.wrap_socket(sock, server_hostname=domain) as ssock:
                cert = ssock.getpeercert()
                not_after = datetime.strptime(cert["notAfter"], "%b %d %H:%M:%S %Y %Z")
                days_remaining = (not_after - datetime.now()).days
                issuer = dict(x[0] for x in cert.get("issuer", []))
                return {
                    "valid": True,
                    "issuer": issuer.get("organizationName", "Inconnu"),
                    "expires": not_after.isoformat(),
                    "days_remaining": days_remaining,
                    "status": "ok" if days_remaining > 30 else "expiring" if days_remaining > 0 else "expired",
                }
    except Exception as e:
        return {"valid": False, "error": str(e), "status": "error"}

@api_router.post("/security/check-domain")
async def check_domain(req: CheckDomainRequest, request: Request):
    user = await get_current_user(request)
    domain = req.domain.strip().lower()
    domain = domain.replace("https://", "").replace("http://", "").split("/")[0]

    mx_records = check_dns_record(domain, "MX")
    spf = check_spf(domain)
    dmarc = check_dmarc(domain)
    dkim = check_dkim(domain)
    ssl_info = check_ssl_certificate(domain)

    # Score
    score = 0
    max_score = 100
    checks = []

    # MX
    if mx_records:
        score += 15
        checks.append({"name": "MX Records", "status": "ok", "detail": f"{len(mx_records)} serveur(s) de messagerie detecte(s)", "score": 15})
    else:
        checks.append({"name": "MX Records", "status": "missing", "detail": "Aucun serveur de messagerie configure", "score": 0})

    # SPF
    if spf["found"]:
        score += 20
        checks.append({"name": "SPF (Sender Policy Framework)", "status": spf["status"], "detail": "Protection contre l'usurpation d'email active", "score": 20})
    else:
        checks.append({"name": "SPF (Sender Policy Framework)", "status": "missing", "detail": "Pas de protection SPF - risque d'usurpation d'email", "score": 0})

    # DMARC
    if dmarc["found"]:
        dmarc_score = 25 if dmarc["policy"] in ["reject", "quarantine"] else 10
        score += dmarc_score
        checks.append({"name": "DMARC", "status": dmarc["status"], "detail": f"Politique: {dmarc['policy'] or 'none'}", "score": dmarc_score})
    else:
        checks.append({"name": "DMARC", "status": "missing", "detail": "Pas de politique DMARC - emails frauduleux possibles", "score": 0})

    # DKIM
    if dkim["found"]:
        score += 20
        checks.append({"name": "DKIM", "status": dkim["status"], "detail": f"Signature email verifiee (selecteur: {dkim['selector']})", "score": 20})
    else:
        checks.append({"name": "DKIM", "status": "not_detected", "detail": "Signature DKIM non detectee (peut etre configure avec un selecteur personnalise)", "score": 5})
        score += 5

    # SSL
    if ssl_info.get("valid"):
        ssl_score = 20 if ssl_info["status"] == "ok" else 10
        score += ssl_score
        checks.append({"name": "Certificat SSL/TLS", "status": ssl_info["status"], "detail": f"Emetteur: {ssl_info['issuer']}, expire dans {ssl_info['days_remaining']} jours", "score": ssl_score})
    else:
        checks.append({"name": "Certificat SSL/TLS", "status": "error", "detail": "Certificat SSL non valide ou non accessible", "score": 0})

    # Risk level
    if score >= 80:
        risk_level = "faible"
    elif score >= 50:
        risk_level = "modere"
    elif score >= 25:
        risk_level = "eleve"
    else:
        risk_level = "critique"

    result = {
        "domain": domain,
        "score": score,
        "max_score": max_score,
        "risk_level": risk_level,
        "checks": checks,
        "mx_records": mx_records[:5],
        "spf": spf,
        "dmarc": dmarc,
        "dkim": dkim,
        "ssl": ssl_info,
        "checked_at": datetime.now(timezone.utc).isoformat(),
    }

    # Update monitored emails for this domain
    await db.monitored_emails.update_many(
        {"user_id": user["_id"], "email": {"$regex": f"@{re.escape(domain)}$"}},
        {"$set": {"domain_results": result, "last_check": datetime.now(timezone.utc).isoformat()}},
    )
    return result

# ─── PASSWORD BREACH CHECK ───
@api_router.post("/security/check-password")
async def check_password_breach(req: CheckPasswordRequest, request: Request):
    await get_current_user(request)
    password = req.password
    sha1 = hashlib.sha1(password.encode("utf-8")).hexdigest().upper()
    prefix = sha1[:5]
    suffix = sha1[5:]
    count = 0
    try:
        resp = requests.get(f"https://api.pwnedpasswords.com/range/{prefix}", timeout=5)
        if resp.status_code == 200:
            for line in resp.text.splitlines():
                h, c = line.split(":")
                if h == suffix:
                    count = int(c)
                    break
    except Exception:
        pass

    # Password strength assessment
    strength = 0
    if len(password) >= 8: strength += 1
    if len(password) >= 12: strength += 1
    if re.search(r'[A-Z]', password): strength += 1
    if re.search(r'[a-z]', password): strength += 1
    if re.search(r'[0-9]', password): strength += 1
    if re.search(r'[^A-Za-z0-9]', password): strength += 1

    strength_labels = {0: "tres_faible", 1: "tres_faible", 2: "faible", 3: "moyen", 4: "bon", 5: "fort", 6: "excellent"}

    return {
        "compromised": count > 0,
        "appearances": count,
        "strength": strength,
        "strength_label": strength_labels.get(strength, "inconnu"),
        "length": len(password),
        "recommendations": [
            "Utilisez au moins 12 caracteres" if len(password) < 12 else None,
            "Ajoutez des majuscules" if not re.search(r'[A-Z]', password) else None,
            "Ajoutez des chiffres" if not re.search(r'[0-9]', password) else None,
            "Ajoutez des caracteres speciaux (!@#$...)" if not re.search(r'[^A-Za-z0-9]', password) else None,
            f"Ce mot de passe a ete trouve {count} fois dans des fuites de donnees. Changez-le immediatement !" if count > 0 else None,
        ],
    }

# ─── AI CHAT ───
SYSTEM_PROMPT = """Tu es CyberCopilote, un assistant en cybersecurite bienveillant et patient, specialise dans l'accompagnement des freelances, auto-entrepreneurs, et tres petites entreprises (TPE/TPME) en France.

Ton role :
- Expliquer les risques cyber en langage simple, sans jargon technique
- Donner des conseils pratiques, etape par etape
- Recommander uniquement des solutions gratuites ou peu couteuses
- Rassurer les utilisateurs stresses sans minimiser les risques
- Aider a prioriser les actions de securite
- Guider en cas d'incident (phishing, piratage, perte de materiel)

Regles strictes :
- Ne JAMAIS demander des mots de passe, cles secretes ou informations sensibles
- Ne JAMAIS donner d'instructions de piratage ou d'actions illegales
- Toujours repondre en francais
- Etre patient et encourageant
- Poser une question clarifiante a la fois si besoin
- Privilegier la securite, la legalite et la simplicite"""

@api_router.post("/chat")
async def chat_endpoint(req: ChatRequest):
    from emergentintegrations.llm.chat import LlmChat, UserMessage
    session_id = req.session_id or str(uuid.uuid4())
    api_key = os.environ.get('EMERGENT_LLM_KEY')
    system_msg = SYSTEM_PROMPT
    if req.context:
        system_msg += f"\n\nContexte du diagnostic :\n{req.context}"
    chat = LlmChat(api_key=api_key, session_id=session_id, system_message=system_msg)
    chat.with_model("gemini", "gemini-3-flash-preview")
    for msg in (req.history or []):
        if msg.role == "user":
            chat.history.append({"role": "user", "content": msg.content})
        elif msg.role == "assistant":
            chat.history.append({"role": "assistant", "content": msg.content})
    user_message = UserMessage(text=req.message)
    response = await chat.send_message(user_message)
    return {"reply": response, "session_id": session_id}

# ─── HEALTH ───
@api_router.get("/")
async def root():
    return {"message": "CyberCopilote TPME API"}

@api_router.get("/health")
async def health():
    return {"status": "ok"}

# ─── App Setup ───
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.environ.get("FRONTEND_URL", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    await db.monitored_emails.create_index([("user_id", 1), ("email", 1)])
    # Seed admin
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@cybercopilote.fr")
    admin_password = os.environ.get("ADMIN_PASSWORD", "CyberAdmin2026!")
    existing = await db.users.find_one({"email": admin_email})
    if not existing:
        await db.users.insert_one({
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info(f"Admin seeded: {admin_email}")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})
    # Write test credentials
    try:
        Path("/app/memory").mkdir(exist_ok=True)
        with open("/app/memory/test_credentials.md", "w") as f:
            f.write(f"# Test Credentials\n\n## Admin\n- Email: {admin_email}\n- Password: {admin_password}\n- Role: admin\n\n## Auth Endpoints\n- POST /api/auth/register\n- POST /api/auth/login\n- POST /api/auth/logout\n- GET /api/auth/me\n- POST /api/auth/refresh\n")
    except Exception:
        pass

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
