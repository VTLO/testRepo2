import { useState } from "react";
import { BookOpen, ChevronRight, ChevronLeft, Fish, ShieldCheck, HardDrive, AlertTriangle, Wifi, LifeBuoy, Star, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LEARNING_CARDS } from "@/lib/learningContent";
import Navigation from "@/components/Navigation";

const ICON_MAP = { Fish, ShieldCheck, HardDrive, AlertTriangle, Wifi, LifeBuoy, Star };

export default function LearningCenter() {
  const [selectedCard, setSelectedCard] = useState(null);

  const card = LEARNING_CARDS.find(c => c.id === selectedCard);

  if (card) {
    const IconComp = ICON_MAP[card.icon] || BookOpen;
    return (
      <div className="min-h-screen bg-[#F8FAFC] pb-24" data-testid="learning-detail-page">
        <div className="bg-white border-b border-slate-200/50">
          <div className="max-w-3xl mx-auto px-6 py-5 sm:px-8">
            <button
              onClick={() => setSelectedCard(null)}
              className="text-sm text-[#0F766E] hover:text-[#115E59] font-medium mb-3 flex items-center gap-1"
              data-testid="learning-back-button"
            >
              <ChevronLeft className="w-4 h-4" /> Retour
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#CCFBF1] flex items-center justify-center">
                <IconComp className="w-5 h-5 text-[#0F766E]" strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="font-['Outfit'] text-lg font-semibold text-[#0F172A]">{card.title}</h1>
                <p className="text-xs text-[#64748B] flex items-center gap-1"><Clock className="w-3 h-3" /> Lecture {card.readTime}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 py-6 sm:px-8 space-y-5">
          {card.content.map((section, i) => (
            <Card key={i} className="rounded-2xl border-slate-200/80 shadow-[0_2px_10px_rgba(15,23,42,0.04)] animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <CardContent className="p-6">
                <h3 className="font-['Outfit'] text-base font-semibold text-[#0F172A] mb-2">{section.subtitle}</h3>
                <p className="text-sm text-[#475569] leading-relaxed">{section.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Navigation active="apprendre" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24" data-testid="learning-page">
      <div className="bg-white border-b border-slate-200/50">
        <div className="max-w-3xl mx-auto px-6 py-6 sm:px-8">
          <div className="flex items-center gap-3 mb-1">
            <BookOpen className="w-5 h-5 text-[#0F766E]" strokeWidth={1.5} />
            <span className="font-['Outfit'] text-lg font-semibold text-[#0F172A]">Centre d'apprentissage</span>
          </div>
          <p className="text-sm text-[#64748B]">Des fiches pratiques pour comprendre et se proteger.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6 sm:px-8 space-y-3">
        {LEARNING_CARDS.map((card) => {
          const IconComp = ICON_MAP[card.icon] || BookOpen;
          return (
            <Card
              key={card.id}
              className="rounded-2xl border-slate-200/80 shadow-[0_2px_10px_rgba(15,23,42,0.04)] cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(15,23,42,0.08)] hover:border-slate-300 transition-all duration-300"
              onClick={() => setSelectedCard(card.id)}
              data-testid={`learning-card-${card.id}`}
            >
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                  <IconComp className="w-5 h-5 text-[#3B82F6]" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-[#0F172A] mb-0.5">{card.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#64748B] flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {card.readTime}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#64748B] flex-shrink-0" />
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Navigation active="apprendre" />
    </div>
  );
}
