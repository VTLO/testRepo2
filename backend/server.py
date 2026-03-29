from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel
from typing import List, Optional
import uuid

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

# Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Chat models
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    context: Optional[str] = None
    history: Optional[List[ChatMessage]] = []

class ChatResponse(BaseModel):
    reply: str
    session_id: str

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
- Privilegier la securite, la legalite et la simplicite

Tu peux utiliser le contexte du diagnostic de l'utilisateur pour personnaliser tes conseils.
Si l'utilisateur mentionne un incident, passe en mode urgence : instructions claires, chronologiques, calmes."""

@api_router.get("/")
async def root():
    return {"message": "CyberCopilote TPME API"}

@api_router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    from emergentintegrations.llm.chat import LlmChat, UserMessage

    session_id = req.session_id or str(uuid.uuid4())
    api_key = os.environ.get('EMERGENT_LLM_KEY')

    system_msg = SYSTEM_PROMPT
    if req.context:
        system_msg += f"\n\nContexte du diagnostic de l'utilisateur :\n{req.context}"

    chat = LlmChat(
        api_key=api_key,
        session_id=session_id,
        system_message=system_msg
    )
    chat.with_model("gemini", "gemini-3-flash-preview")

    # Add history - emergentintegrations handles history differently
    # The library manages conversation history internally via session_id

    user_message = UserMessage(text=req.message)
    response = await chat.send_message(user_message)

    return ChatResponse(reply=response, session_id=session_id)

@api_router.get("/health")
async def health():
    return {"status": "ok"}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
