import { useState } from "react";
import { AlertTriangle, ChevronRight, MousePointerClick, KeyRound, Mail, UserX, Smartphone, Lock, FileWarning, Phone, ShieldAlert, Clock, Ban, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EMERGENCY_FLOWS } from "@/lib/emergencyFlows";
import Navigation from "@/components/Navigation";

const ICON_MAP = {
  MousePointerClick, KeyRound, Mail, UserX, Smartphone, Lock, FileWarning,
};

const SECTION_CONFIG = {
  immediate: { title: "A faire immediatement", icon: ShieldAlert, color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
  doNot: { title: "A ne PAS faire", icon: Ban, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
  passwords: { title: "Mots de passe a changer", icon: KeyRound, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
  notify: { title: "Qui prevenir", icon: Phone, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
  proof: { title: "Preuves a conserver", icon: Eye, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" },
  timeline: { title: "Chronologie", icon: Clock, color: "text-teal-600", bg: "bg-teal-50", border: "border-teal-200" },
};

export default function EmergencyMode() {
  const [selectedFlow, setSelectedFlow] = useState(null);

  const flow = EMERGENCY_FLOWS.find(f => f.id === selectedFlow);

  if (flow) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pb-24" data-testid="emergency-detail-page">
        <div className="bg-red-50 border-b border-red-200">
          <div className="max-w-3xl mx-auto px-6 py-5 sm:px-8">
            <button
              onClick={() => setSelectedFlow(null)}
              className="text-sm text-red-600 hover:text-red-800 font-medium mb-3 flex items-center gap-1"
              data-testid="emergency-back-button"
            >
              ← Retour aux situations
            </button>
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600" strokeWidth={1.5} />
              <h1 className="font-['Outfit'] text-xl font-bold text-red-900">{flow.title}</h1>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 py-6 sm:px-8 space-y-5">
          {Object.entries(flow.steps).map(([key, content]) => {
            if (key === 'timeline') {
              const cfg = SECTION_CONFIG[key];
              return (
                <Card key={key} className={`rounded-2xl ${cfg.border} border shadow-sm`} data-testid={`emergency-section-${key}`}>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <cfg.icon className={`w-4 h-4 ${cfg.color}`} strokeWidth={1.5} />
                      <h3 className={`font-['Outfit'] text-sm font-semibold ${cfg.color}`}>{cfg.title}</h3>
                    </div>
                    <div className="space-y-3">
                      <div className={`${cfg.bg} rounded-xl p-3`}>
                        <p className="text-xs font-bold text-[#0F172A] mb-1">Premiere heure</p>
                        <p className="text-sm text-[#475569]">{content.firstHour}</p>
                      </div>
                      <div className={`${cfg.bg} rounded-xl p-3`}>
                        <p className="text-xs font-bold text-[#0F172A] mb-1">Premieres 24 heures</p>
                        <p className="text-sm text-[#475569]">{content.first24h}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            }

            const cfg = SECTION_CONFIG[key];
            if (!cfg || !Array.isArray(content)) return null;

            return (
              <Card key={key} className={`rounded-2xl ${cfg.border} border shadow-sm animate-fade-in-up`} data-testid={`emergency-section-${key}`}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <cfg.icon className={`w-4 h-4 ${cfg.color}`} strokeWidth={1.5} />
                    <h3 className={`font-['Outfit'] text-sm font-semibold ${cfg.color}`}>{cfg.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {content.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-[#475569]">
                        <span className={`w-5 h-5 rounded-full ${cfg.bg} flex items-center justify-center flex-shrink-0 text-xs font-bold ${cfg.color}`}>
                          {i + 1}
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <Navigation active="urgence" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24" data-testid="emergency-page">
      <div className="bg-red-50 border-b border-red-200">
        <div className="max-w-3xl mx-auto px-6 py-6 sm:px-8">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-6 h-6 text-red-600" strokeWidth={1.5} />
            <h1 className="font-['Outfit'] text-xl font-bold text-red-900">Que faire maintenant ?</h1>
          </div>
          <p className="text-sm text-red-700/80">Selectionnez votre situation pour obtenir les etapes a suivre immediatement.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6 sm:px-8 space-y-3">
        {EMERGENCY_FLOWS.map((flow) => {
          const IconComp = ICON_MAP[flow.icon] || AlertTriangle;
          const isCritical = flow.severity === 'critical';
          return (
            <Card
              key={flow.id}
              className={`rounded-2xl border cursor-pointer hover:-translate-y-0.5 transition-all duration-200 ${
                isCritical ? 'border-red-200 hover:border-red-300 hover:shadow-red-100/50' : 'border-slate-200/80 hover:border-slate-300'
              } shadow-[0_2px_10px_rgba(15,23,42,0.04)] hover:shadow-[0_8px_30px_rgba(15,23,42,0.08)]`}
              onClick={() => setSelectedFlow(flow.id)}
              data-testid={`emergency-flow-${flow.id}`}
            >
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isCritical ? 'bg-red-100' : 'bg-amber-100'
                }`}>
                  <IconComp className={`w-5 h-5 ${isCritical ? 'text-red-600' : 'text-amber-600'}`} strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-[#0F172A]">{flow.title}</h3>
                  {isCritical && (
                    <Badge className="bg-red-100 text-red-700 border border-red-200 text-[10px] mt-1">Critique</Badge>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-[#64748B] flex-shrink-0" />
              </CardContent>
            </Card>
          );
        })}

        <Card className="rounded-2xl border-slate-200/80 shadow-[0_2px_10px_rgba(15,23,42,0.04)] mt-6" data-testid="emergency-disclaimer">
          <CardContent className="p-5">
            <p className="text-xs text-[#64748B] leading-relaxed">
              <strong>Important :</strong> Ces guides fournissent des recommandations generales. En cas d'incident grave, contactez un professionnel de la cybersecurite ou les autorites competentes. Rendez-vous sur <span className="text-[#0F766E] font-medium">cybermalveillance.gouv.fr</span> pour une aide officielle et gratuite.
            </p>
          </CardContent>
        </Card>
      </div>
      <Navigation active="urgence" />
    </div>
  );
}
