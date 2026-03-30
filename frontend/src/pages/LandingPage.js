import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, ChevronRight, CheckCircle2, Zap, ClipboardList, HeartHandshake, LogIn, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isOnboardingDone } from "@/lib/storage";
import { useAuth } from "@/contexts/AuthContext";

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const hasCompleted = isOnboardingDone();

  const handleStart = () => {
    if (hasCompleted) {
      navigate("/dashboard");
    } else {
      navigate("/diagnostic");
    }
  };

  const steps = [
    { icon: ClipboardList, title: "Repondez a quelques questions simples", desc: "Un diagnostic rapide adapte a votre activite, sans jargon." },
    { icon: Zap, title: "Decouvrez votre score cyber", desc: "Comprenez vos forces et les points a ameliorer en un coup d'oeil." },
    { icon: CheckCircle2, title: "Suivez votre plan d'action personnalise", desc: "Des actions concretes, classees par priorite, avec des instructions pas-a-pas." },
  ];

  const trustItems = [
    "Sans jargon technique",
    "Sans installation complexe",
    "Pense pour les petites structures",
    "100% gratuit",
    "Donnees stockees localement",
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]" data-testid="landing-page">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `url(https://images.pexels.com/photos/7135020/pexels-photo-7135020.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative max-w-5xl mx-auto px-6 pt-16 pb-20 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between mb-8 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0F766E] flex items-center justify-center shadow-lg shadow-teal-900/20">
                <Shield className="w-6 h-6 text-white" strokeWidth={1.5} />
              </div>
              <span className="font-['Outfit'] text-xl font-semibold text-[#0F172A] tracking-tight">CyberCopilote</span>
            </div>
            {user ? (
              <Button
                onClick={() => navigate("/dashboard")}
                variant="outline"
                className="rounded-xl border-slate-200 text-sm"
                data-testid="landing-account-button"
              >
                <User className="w-4 h-4 mr-1.5" /> {user.name || user.email}
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                variant="outline"
                className="rounded-xl border-slate-200 text-sm"
                data-testid="landing-login-button"
              >
                <LogIn className="w-4 h-4 mr-1.5" /> Se connecter
              </Button>
            )}
          </div>

          <h1
            className="font-['Outfit'] text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0F172A] tracking-tight leading-[1.1] mb-6 animate-fade-in-up"
            data-testid="hero-heading"
          >
            Protegez votre activite<br />
            <span className="text-[#0F766E]">en toute serenite</span>
          </h1>

          <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-xl mb-10 animate-fade-in-up stagger-1" data-testid="hero-subheading">
            Repondez a quelques questions simples et obtenez votre plan d'action cybersecurite personnalise. Concu pour les freelances, independants et TPE.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up stagger-2">
            <Button
              onClick={handleStart}
              data-testid="start-diagnostic-button"
              className="bg-[#0F766E] hover:bg-[#115E59] text-white rounded-xl px-8 py-4 text-base font-semibold shadow-lg shadow-teal-900/20 transition-all hover:-translate-y-0.5 h-auto"
            >
              {hasCompleted ? "Voir mon tableau de bord" : "Lancer mon diagnostic gratuit"}
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            {hasCompleted && (
              <Button
                onClick={() => navigate("/diagnostic")}
                variant="outline"
                data-testid="redo-diagnostic-button"
                className="rounded-xl px-8 py-4 text-base font-medium border-slate-200 hover:border-slate-300 hover:bg-slate-50 h-auto"
              >
                Refaire le diagnostic
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-5xl mx-auto px-6 py-16 sm:px-8 lg:px-12">
        <p className="uppercase text-xs tracking-[0.15em] font-bold text-[#64748B] mb-4">Comment ca marche</p>
        <h2 className="font-['Outfit'] text-2xl sm:text-3xl font-semibold text-[#0F172A] tracking-tight mb-10">
          3 etapes simples pour securiser votre activite
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(15,23,42,0.04)] p-8 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(15,23,42,0.08)] hover:border-slate-300 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${(i + 1) * 0.15}s` }}
              data-testid={`step-card-${i}`}
            >
              <div className="w-12 h-12 rounded-xl bg-[#CCFBF1] flex items-center justify-center mb-5">
                <step.icon className="w-6 h-6 text-[#0F766E]" strokeWidth={1.5} />
              </div>
              <div className="text-sm font-bold text-[#0F766E] mb-2">Etape {i + 1}</div>
              <h3 className="font-['Outfit'] text-lg font-semibold text-[#0F172A] mb-2">{step.title}</h3>
              <p className="text-sm text-[#475569] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trust signals */}
      <div className="max-w-5xl mx-auto px-6 pb-16 sm:px-8 lg:px-12">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(15,23,42,0.04)] p-8 sm:p-10">
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <HeartHandshake className="w-6 h-6 text-[#0F766E]" strokeWidth={1.5} />
                <h3 className="font-['Outfit'] text-lg font-semibold text-[#0F172A]">Concu pour vous rassurer</h3>
              </div>
              <p className="text-sm text-[#475569] leading-relaxed">
                CyberCopilote est un guide bienveillant, pas un outil technique. Il vous accompagne a votre rythme, avec des explications claires et des actions simples.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {trustItems.map((item, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#CCFBF1] text-[#0F766E] text-xs font-semibold"
                  data-testid={`trust-badge-${i}`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Who is it for */}
      <div className="max-w-5xl mx-auto px-6 pb-20 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="uppercase text-xs tracking-[0.15em] font-bold text-[#64748B] mb-4">Pour qui ?</p>
            <h2 className="font-['Outfit'] text-2xl sm:text-3xl font-semibold text-[#0F172A] tracking-tight mb-4">
              Pense pour les independants et les TPE
            </h2>
            <p className="text-sm text-[#475569] leading-relaxed mb-6">
              Que vous soyez freelance, auto-entrepreneur, consultant, commercant, therapeute ou gerant d'une petite structure, CyberCopilote est fait pour vous.
            </p>
            <ul className="space-y-3">
              {["Pas besoin de competences techniques", "Consacrez moins de 7 minutes au diagnostic", "Des actions realisables tout de suite", "Suivi et rappels integres"].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#475569]">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(15,23,42,0.08)]">
            <img
              src="https://images.pexels.com/photos/4473398/pexels-photo-4473398.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
              alt="Proprietaire de petite entreprise"
              className="w-full h-64 sm:h-80 object-cover"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white" data-testid="landing-footer">
        <div className="max-w-5xl mx-auto px-6 py-8 sm:px-8 lg:px-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#0F766E]" strokeWidth={1.5} />
              <span className="font-['Outfit'] text-sm font-semibold text-[#0F172A]">CyberCopilote TPME</span>
            </div>
            <div className="flex gap-6 text-xs text-[#64748B]">
              <button onClick={() => navigate("/confidentialite")} className="hover:text-[#0F766E] transition-colors" data-testid="footer-privacy-link">
                Confidentialite
              </button>
              <span>Guide educatif - non contractuel</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
