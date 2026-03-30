import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, ChevronRight, AlertTriangle, CheckCircle2, Clock, TrendingUp, KeyRound, Laptop, HardDrive, Mail, Wifi, ShieldCheck, LifeBuoy, LogIn, LogOut, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getScores, getActionPlan } from "@/lib/storage";
import { getSeverityLabel, getSeverityColor } from "@/lib/scoring";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";

const ICON_MAP = {
  KeyRound, Laptop, HardDrive, Mail, Wifi, ShieldCheck, LifeBuoy,
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const scores = getScores();
  const actionPlan = getActionPlan();

  const stats = useMemo(() => {
    if (!actionPlan || actionPlan.length === 0) return { done: 0, total: 0, overdue: 0 };
    const done = actionPlan.filter(t => t.status === 'done').length;
    const total = actionPlan.length;
    const todayTasks = actionPlan.filter(t => t.period === 'today' && t.status === 'todo');
    return { done, total, overdue: todayTasks.length };
  }, [actionPlan]);

  const nextAction = useMemo(() => {
    if (!actionPlan) return null;
    return actionPlan.find(t => t.status === 'todo');
  }, [actionPlan]);

  if (!scores) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pb-24" data-testid="dashboard-page">
        {/* Header */}
        <div className="bg-white border-b border-slate-200/50">
          <div className="max-w-3xl mx-auto px-6 py-6 sm:px-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <Shield className="w-5 h-5 text-[#0F766E]" strokeWidth={1.5} />
                  <span className="font-['Outfit'] text-lg font-semibold text-[#0F172A]">Tableau de bord</span>
                </div>
                <p className="text-sm text-[#64748B]">Vue d'ensemble de votre securite</p>
              </div>
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#64748B] hidden sm:block">{user.email}</span>
                  <Button variant="ghost" size="sm" onClick={logout} className="text-[#64748B] hover:text-red-500" data-testid="dashboard-logout">
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={() => navigate("/login")} className="rounded-lg text-xs" data-testid="dashboard-login">
                  <LogIn className="w-3 h-3 mr-1" /> Se connecter
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center px-6 py-16">
          <Shield className="w-16 h-16 text-[#0F766E] mb-6" strokeWidth={1.5} />
          <h1 className="font-['Outfit'] text-2xl font-semibold text-[#0F172A] mb-3 text-center">Bienvenue sur CyberCopilote</h1>
          <p className="text-sm text-[#475569] text-center mb-8 max-w-sm">Commencez par le diagnostic pour decouvrir votre score et votre plan d'action personnalise.</p>
          <Button
            onClick={() => navigate("/diagnostic")}
            className="bg-[#0F766E] hover:bg-[#115E59] text-white rounded-xl px-8 py-4 h-auto text-base font-semibold shadow-lg"
            data-testid="dashboard-start-diagnostic"
          >
            Lancer le diagnostic
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
        <Navigation active="dashboard" />
      </div>
    );
  }

  const severityColors = getSeverityColor(scores.severity);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24" data-testid="dashboard-page">
      {/* Header */}
      <div className="bg-white border-b border-slate-200/50">
        <div className="max-w-3xl mx-auto px-6 py-6 sm:px-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Shield className="w-5 h-5 text-[#0F766E]" strokeWidth={1.5} />
                <span className="font-['Outfit'] text-lg font-semibold text-[#0F172A]">Tableau de bord</span>
              </div>
              <p className="text-sm text-[#64748B]">Vue d'ensemble de votre securite</p>
            </div>
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#64748B] hidden sm:block">{user.email}</span>
                <Button variant="ghost" size="sm" onClick={logout} className="text-[#64748B] hover:text-red-500" data-testid="dashboard-logout">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => navigate("/login")} className="rounded-lg text-xs" data-testid="dashboard-login">
                <LogIn className="w-3 h-3 mr-1" /> Se connecter
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 sm:px-8 space-y-6">
        {/* Score Card */}
        <Card className="rounded-2xl border-slate-200/80 shadow-[0_2px_10px_rgba(15,23,42,0.04)] overflow-hidden animate-fade-in-up" data-testid="score-card">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative w-32 h-32 flex-shrink-0">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#E2E8F0" strokeWidth="8" />
                  <circle
                    cx="60" cy="60" r="52" fill="none"
                    stroke={severityColors.fill}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(scores.overall / 100) * 327} 327`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-['Outfit'] text-3xl font-bold text-[#0F172A]">{scores.overall}</span>
                  <span className="text-xs text-[#64748B]">/ 100</span>
                </div>
              </div>
              <div className="text-center sm:text-left flex-1">
                <h2 className="font-['Outfit'] text-xl font-semibold text-[#0F172A] mb-2">Votre score cyber</h2>
                <Badge className={`${severityColors.bg} ${severityColors.text} border ${severityColors.border} mb-3`} data-testid="severity-badge">
                  Risque {getSeverityLabel(scores.severity)}
                </Badge>
                <p className="text-sm text-[#64748B] leading-relaxed">
                  Ce score est indicatif et educatif. Il reflete vos pratiques actuelles de cyberhygiene.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 animate-fade-in-up stagger-1">
          <Card className="rounded-2xl border-slate-200/80 shadow-[0_2px_10px_rgba(15,23,42,0.04)]" data-testid="stat-done">
            <CardContent className="p-4 text-center">
              <CheckCircle2 className="w-5 h-5 text-[#10B981] mx-auto mb-2" strokeWidth={1.5} />
              <div className="font-['Outfit'] text-2xl font-bold text-[#0F172A]">{stats.done}</div>
              <div className="text-xs text-[#64748B]">Terminees</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-slate-200/80 shadow-[0_2px_10px_rgba(15,23,42,0.04)]" data-testid="stat-todo">
            <CardContent className="p-4 text-center">
              <Clock className="w-5 h-5 text-[#F59E0B] mx-auto mb-2" strokeWidth={1.5} />
              <div className="font-['Outfit'] text-2xl font-bold text-[#0F172A]">{stats.total - stats.done}</div>
              <div className="text-xs text-[#64748B]">A faire</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-slate-200/80 shadow-[0_2px_10px_rgba(15,23,42,0.04)]" data-testid="stat-urgent">
            <CardContent className="p-4 text-center">
              <AlertTriangle className="w-5 h-5 text-[#EF4444] mx-auto mb-2" strokeWidth={1.5} />
              <div className="font-['Outfit'] text-2xl font-bold text-[#0F172A]">{stats.overdue}</div>
              <div className="text-xs text-[#64748B]">Urgentes</div>
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown */}
        <Card className="rounded-2xl border-slate-200/80 shadow-[0_2px_10px_rgba(15,23,42,0.04)] animate-fade-in-up stagger-2" data-testid="categories-card">
          <CardContent className="p-6">
            <h3 className="font-['Outfit'] text-base font-semibold text-[#0F172A] mb-5">Detail par categorie</h3>
            <div className="space-y-4">
              {scores.categories.map((cat) => {
                const IconComp = ICON_MAP[
                  cat.key === 'account_security' ? 'KeyRound' :
                  cat.key === 'device_security' ? 'Laptop' :
                  cat.key === 'backup' ? 'HardDrive' :
                  cat.key === 'email_phishing' ? 'Mail' :
                  cat.key === 'network' ? 'Wifi' :
                  cat.key === 'data_protection' ? 'ShieldCheck' : 'LifeBuoy'
                ];
                const color = cat.score >= 70 ? '#10B981' : cat.score >= 40 ? '#F59E0B' : '#EF4444';
                return (
                  <div key={cat.key} data-testid={`category-${cat.key}`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <IconComp className="w-4 h-4 text-[#64748B]" strokeWidth={1.5} />
                        <span className="text-sm font-medium text-[#0F172A]">{cat.name}</span>
                      </div>
                      <span className="text-sm font-semibold" style={{ color }}>{cat.score}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${cat.score}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Next Action */}
        {nextAction && (
          <Card
            className="rounded-2xl border-[#0F766E]/20 bg-[#CCFBF1]/30 shadow-[0_2px_10px_rgba(15,23,42,0.04)] cursor-pointer hover:-translate-y-0.5 transition-all duration-300 animate-fade-in-up stagger-3"
            onClick={() => navigate("/plan")}
            data-testid="next-action-card"
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#0F766E] flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-white" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#0F766E] uppercase tracking-wider mb-1">Prochaine action recommandee</p>
                  <h4 className="font-['Outfit'] text-base font-semibold text-[#0F172A] mb-1">{nextAction.title}</h4>
                  <p className="text-xs text-[#64748B]">{nextAction.time} - {nextAction.effort}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-[#0F766E] flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-3 animate-fade-in-up stagger-4">
          <Button
            onClick={() => navigate("/urgence")}
            variant="outline"
            className="h-auto py-4 rounded-xl border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 font-medium text-sm flex items-center gap-2"
            data-testid="dashboard-emergency-link"
          >
            <AlertTriangle className="w-4 h-4" />
            Mode urgence
          </Button>
          <Button
            onClick={() => navigate("/securite")}
            variant="outline"
            className="h-auto py-4 rounded-xl border-[#0F766E]/30 text-[#0F766E] hover:bg-[#CCFBF1]/30 hover:border-[#0F766E]/50 font-medium text-sm flex items-center gap-2"
            data-testid="dashboard-security-link"
          >
            <ShieldCheck className="w-4 h-4" />
            Suivi securite
          </Button>
        </div>
      </div>

      <Navigation active="dashboard" />
    </div>
  );
}
