import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shield, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth, formatApiErrorDetail } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isRegister) {
        await register(email, password, name);
      } else {
        await login(email, password);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(formatApiErrorDetail(err.response?.data?.detail) || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col" data-testid="login-page">
      <div className="max-w-md mx-auto w-full px-6 pt-12 pb-20">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1 text-sm text-[#64748B] hover:text-[#0F172A] mb-8 transition-colors"
          data-testid="login-back-button"
        >
          <ArrowLeft className="w-4 h-4" /> Retour
        </button>

        <div className="flex items-center gap-3 mb-8 animate-fade-in">
          <div className="w-12 h-12 rounded-2xl bg-[#0F766E] flex items-center justify-center shadow-lg shadow-teal-900/20">
            <Shield className="w-6 h-6 text-white" strokeWidth={1.5} />
          </div>
          <span className="font-['Outfit'] text-xl font-semibold text-[#0F172A]">CyberCopilote</span>
        </div>

        <h1 className="font-['Outfit'] text-2xl font-bold text-[#0F172A] mb-2 animate-fade-in-up" data-testid="login-title">
          {isRegister ? "Creer un compte" : "Se connecter"}
        </h1>
        <p className="text-sm text-[#64748B] mb-8 animate-fade-in-up stagger-1">
          {isRegister
            ? "Creez votre compte pour sauvegarder vos donnees et acceder au suivi personnalise."
            : "Connectez-vous pour retrouver vos donnees et votre suivi."}
        </p>

        <Card className="rounded-2xl border-slate-200/80 shadow-[0_2px_10px_rgba(15,23,42,0.04)] animate-fade-in-up stagger-2">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Nom</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Votre nom ou pseudo"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:bg-white focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 focus:outline-none transition-all"
                    data-testid="register-name-input"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="votre@email.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:bg-white focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 focus:outline-none transition-all"
                  data-testid="login-email-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Mot de passe</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="6 caracteres minimum"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-12 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:bg-white focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 focus:outline-none transition-all"
                    data-testid="login-password-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B]"
                    data-testid="toggle-password-visibility"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3" data-testid="login-error">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0F766E] hover:bg-[#115E59] text-white rounded-xl py-3 h-auto text-sm font-semibold shadow-sm disabled:opacity-50"
                data-testid="login-submit-button"
              >
                {loading ? "Chargement..." : isRegister ? "Creer mon compte" : "Se connecter"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <button
            onClick={() => { setIsRegister(!isRegister); setError(""); }}
            className="text-sm text-[#0F766E] hover:text-[#115E59] font-medium transition-colors"
            data-testid="toggle-auth-mode"
          >
            {isRegister ? "Deja un compte ? Se connecter" : "Pas encore de compte ? S'inscrire"}
          </button>
        </div>

        <div className="text-center mt-4">
          <Link to="/dashboard" className="text-xs text-[#94A3B8] hover:text-[#64748B] transition-colors" data-testid="continue-guest-link">
            Continuer sans compte (mode invite)
          </Link>
        </div>
      </div>
    </div>
  );
}
