import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Check, ChevronDown, ChevronUp, Clock, Zap, SkipForward, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getActionPlan, saveActionPlan, getScores, getDiagnosticAnswers, saveScores } from "@/lib/storage";
import { calculateScores } from "@/lib/scoring";
import { getPeriodLabel, getImpactColor, getEffortLabel } from "@/lib/actionPlanGenerator";
import Navigation from "@/components/Navigation";

const PERIODS = ['today', 'week', 'month', 'recurring'];

export default function ActionPlan() {
  const navigate = useNavigate();
  const [plan, setPlan] = useState(getActionPlan());
  const [expandedTask, setExpandedTask] = useState(null);

  const updateTaskStatus = useCallback((taskId, newStatus) => {
    const updated = plan.map(t => t.id === taskId ? { ...t, status: newStatus } : t);
    setPlan(updated);
    saveActionPlan(updated);
    // Recalculate score
    const answers = getDiagnosticAnswers();
    const newScores = calculateScores(answers);
    const done = updated.filter(t => t.status === 'done').length;
    const bonus = Math.round((done / updated.length) * 20);
    newScores.overall = Math.min(100, newScores.overall + bonus);
    saveScores(newScores);
  }, [plan]);

  const groupedTasks = PERIODS.map(period => ({
    period,
    label: getPeriodLabel(period),
    tasks: plan.filter(t => t.period === period),
  })).filter(g => g.tasks.length > 0);

  const doneCount = plan.filter(t => t.status === 'done').length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24" data-testid="action-plan-page">
      {/* Header */}
      <div className="bg-white border-b border-slate-200/50">
        <div className="max-w-3xl mx-auto px-6 py-6 sm:px-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Shield className="w-5 h-5 text-[#0F766E]" strokeWidth={1.5} />
                <span className="font-['Outfit'] text-lg font-semibold text-[#0F172A]">Plan d'action</span>
              </div>
              <p className="text-sm text-[#64748B]">{doneCount}/{plan.length} actions terminees</p>
            </div>
            <Badge className="bg-[#CCFBF1] text-[#0F766E] border border-teal-200">
              {Math.round((doneCount / Math.max(plan.length, 1)) * 100)}% complete
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6 sm:px-8 space-y-8">
        {plan.length === 0 ? (
          <div className="text-center py-16">
            <Shield className="w-12 h-12 text-[#0F766E] mx-auto mb-4" />
            <h2 className="font-['Outfit'] text-xl font-semibold text-[#0F172A] mb-2">Aucune action disponible</h2>
            <p className="text-sm text-[#64748B] mb-6">Completez le diagnostic pour obtenir votre plan personnalise.</p>
            <Button onClick={() => navigate("/diagnostic")} className="bg-[#0F766E] hover:bg-[#115E59] text-white rounded-xl" data-testid="plan-start-diagnostic">
              Lancer le diagnostic
            </Button>
          </div>
        ) : (
          groupedTasks.map((group) => (
            <div key={group.period} className="animate-fade-in-up" data-testid={`task-group-${group.period}`}>
              <h3 className="font-['Outfit'] text-base font-semibold text-[#0F172A] mb-4 flex items-center gap-2">
                {group.period === 'today' && <Zap className="w-4 h-4 text-[#F59E0B]" />}
                {group.period === 'recurring' && <RotateCcw className="w-4 h-4 text-[#3B82F6]" />}
                {group.label}
                <span className="text-xs font-normal text-[#64748B]">({group.tasks.length})</span>
              </h3>

              <div className="space-y-3">
                {group.tasks.map((task) => {
                  const isExpanded = expandedTask === task.id;
                  const isDone = task.status === 'done';
                  const isSkipped = task.status === 'skipped';
                  const isPostponed = task.status === 'postponed';

                  return (
                    <Card
                      key={task.id}
                      className={`rounded-2xl border-slate-200/80 shadow-[0_2px_10px_rgba(15,23,42,0.04)] transition-all duration-200 ${isDone ? 'opacity-70' : ''}`}
                      data-testid={`task-card-${task.id}`}
                    >
                      <CardContent className="p-0">
                        <div
                          className="flex items-start gap-3 p-5 cursor-pointer"
                          onClick={() => setExpandedTask(isExpanded ? null : task.id)}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateTaskStatus(task.id, isDone ? 'todo' : 'done');
                            }}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                              isDone
                                ? 'border-[#10B981] bg-[#10B981]'
                                : 'border-slate-300 hover:border-[#0F766E]'
                            }`}
                            data-testid={`task-toggle-${task.id}`}
                          >
                            {isDone && <Check className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />}
                          </button>
                          <div className="flex-1 min-w-0">
                            <h4 className={`text-sm font-semibold text-[#0F172A] mb-1 ${isDone ? 'line-through text-[#64748B]' : ''}`}>
                              {task.title}
                            </h4>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs text-[#64748B] flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {task.time}
                              </span>
                              <Badge variant="outline" className={`text-[10px] py-0 ${getImpactColor(task.impact)}`}>
                                Impact {task.impact}
                              </Badge>
                              <Badge variant="outline" className="text-[10px] py-0 border-slate-200 text-slate-600">
                                {getEffortLabel(task.effort)}
                              </Badge>
                              {isSkipped && <Badge className="bg-slate-100 text-slate-500 text-[10px] py-0">Ignore</Badge>}
                              {isPostponed && <Badge className="bg-amber-100 text-amber-700 text-[10px] py-0">Reporte</Badge>}
                            </div>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-[#64748B] flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[#64748B] flex-shrink-0" />
                          )}
                        </div>

                        {isExpanded && (
                          <div className="px-5 pb-5 border-t border-slate-100 pt-4 animate-fade-in">
                            <p className="text-sm text-[#475569] mb-3">{task.explanation}</p>
                            <div className="bg-[#EFF6FF] border border-[#93C5FD] rounded-xl p-4 mb-4">
                              <p className="text-xs font-semibold text-[#3B82F6] mb-1">Pourquoi c'est important</p>
                              <p className="text-sm text-[#475569]">{task.why}</p>
                            </div>
                            <div className="mb-4">
                              <p className="text-xs font-semibold text-[#0F172A] mb-2">Etapes :</p>
                              <ol className="space-y-2">
                                {task.steps.map((step, i) => (
                                  <li key={i} className="flex items-start gap-3 text-sm text-[#475569]">
                                    <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 text-xs font-semibold text-[#64748B]">{i + 1}</span>
                                    {step}
                                  </li>
                                ))}
                              </ol>
                            </div>
                            <div className="flex gap-2">
                              {!isDone && (
                                <Button
                                  size="sm"
                                  onClick={() => updateTaskStatus(task.id, 'done')}
                                  className="bg-[#10B981] hover:bg-[#059669] text-white rounded-lg text-xs"
                                  data-testid={`task-complete-${task.id}`}
                                >
                                  <Check className="w-3 h-3 mr-1" /> Marquer comme fait
                                </Button>
                              )}
                              {task.status === 'todo' && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateTaskStatus(task.id, 'postponed')}
                                    className="rounded-lg text-xs border-amber-200 text-amber-700 hover:bg-amber-50"
                                    data-testid={`task-postpone-${task.id}`}
                                  >
                                    Reporter
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateTaskStatus(task.id, 'skipped')}
                                    className="rounded-lg text-xs"
                                    data-testid={`task-skip-${task.id}`}
                                  >
                                    <SkipForward className="w-3 h-3 mr-1" /> Ignorer
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      <Navigation active="plan" />
    </div>
  );
}
