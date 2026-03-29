import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Shield, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { QUESTIONS, getVisibleQuestions } from "@/lib/diagnosticQuestions";
import { calculateScores } from "@/lib/scoring";
import { generateActionPlan } from "@/lib/actionPlanGenerator";
import { saveDiagnosticAnswers, saveScores, saveActionPlan, setOnboardingDone } from "@/lib/storage";

export default function DiagnosticWizard() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [currentQuestionId, setCurrentQuestionId] = useState(QUESTIONS[0]?.id);
  const pendingAdvanceRef = useRef(false);

  const visibleQuestions = useMemo(() => getVisibleQuestions(answers), [answers]);
  const currentIndex = visibleQuestions.findIndex(q => q.id === currentQuestionId);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const question = visibleQuestions[safeIndex];
  const totalSteps = visibleQuestions.length;
  const progress = totalSteps > 0 ? Math.round((safeIndex / totalSteps) * 100) : 0;

  // Sync currentQuestionId if it becomes invisible
  useEffect(() => {
    if (currentIndex < 0 && visibleQuestions.length > 0) {
      setCurrentQuestionId(visibleQuestions[Math.min(safeIndex, visibleQuestions.length - 1)]?.id);
    }
  }, [currentIndex, safeIndex, visibleQuestions]);

  // Auto-advance for single choice
  useEffect(() => {
    if (pendingAdvanceRef.current && question) {
      pendingAdvanceRef.current = false;
      const timer = setTimeout(() => {
        const idx = visibleQuestions.findIndex(q => q.id === question.id);
        if (idx < visibleQuestions.length - 1) {
          setCurrentQuestionId(visibleQuestions[idx + 1].id);
        }
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [answers, question, visibleQuestions]);

  const handleAnswer = useCallback((value) => {
    if (!question) return;
    if (question.type === 'multi') {
      const current = answers[question.id] || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      setAnswers(prev => ({ ...prev, [question.id]: updated }));
    } else {
      setAnswers(prev => ({ ...prev, [question.id]: value }));
      pendingAdvanceRef.current = true;
    }
  }, [question, answers]);

  const canProceed = () => {
    if (!question) return false;
    const answer = answers[question.id];
    if (!answer) return false;
    if (question.type === 'multi') return Array.isArray(answer) && answer.length > 0;
    return true;
  };

  const handleNext = useCallback(() => {
    if (safeIndex < totalSteps - 1) {
      setCurrentQuestionId(visibleQuestions[safeIndex + 1].id);
    } else {
      handleFinish();
    }
  }, [safeIndex, totalSteps, visibleQuestions]);

  const handleBack = useCallback(() => {
    if (safeIndex > 0) {
      setCurrentQuestionId(visibleQuestions[safeIndex - 1].id);
    } else {
      navigate("/");
    }
  }, [safeIndex, visibleQuestions, navigate]);

  const handleFinish = useCallback(() => {
    saveDiagnosticAnswers(answers);
    const scores = calculateScores(answers);
    saveScores(scores);
    const plan = generateActionPlan(answers, scores);
    saveActionPlan(plan);
    setOnboardingDone();
    navigate("/dashboard");
  }, [answers, navigate]);

  if (!question) return null;

  const isMulti = question.type === 'multi';
  const currentAnswer = answers[question.id];
  const isLast = safeIndex === totalSteps - 1;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col" data-testid="diagnostic-wizard">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={handleBack}
              className="flex items-center gap-1 text-sm text-[#475569] hover:text-[#0F172A] transition-colors"
              data-testid="diagnostic-back-button"
            >
              <ChevronLeft className="w-4 h-4" />
              Retour
            </button>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#0F766E]" strokeWidth={1.5} />
              <span className="font-['Outfit'] text-sm font-semibold text-[#0F172A]">Diagnostic</span>
            </div>
            <span className="text-xs text-[#64748B] font-medium">{safeIndex + 1}/{totalSteps}</span>
          </div>
          <Progress value={progress} className="h-2 bg-slate-100" data-testid="diagnostic-progress" />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto px-6 py-10 w-full">
        <div className="animate-fade-in-up" key={question.id}>
          <h2
            className="font-['Outfit'] text-xl sm:text-2xl font-semibold text-[#0F172A] tracking-tight mb-3"
            data-testid="diagnostic-question-title"
          >
            {question.question}
          </h2>
          {question.helpText && (
            <p className="text-sm text-[#64748B] leading-relaxed mb-8" data-testid="diagnostic-question-help">
              {question.helpText}
            </p>
          )}

          <div className="space-y-3">
            {question.options.map((option) => {
              const isSelected = isMulti
                ? (currentAnswer || []).includes(option.value)
                : currentAnswer === option.value;

              return (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  data-testid={`diagnostic-option-${option.value}`}
                  className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ${
                    isSelected
                      ? 'border-[#0F766E] bg-[#CCFBF1]/50 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-6 h-6 ${isMulti ? 'rounded-md' : 'rounded-full'} border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    isSelected
                      ? 'border-[#0F766E] bg-[#0F766E]'
                      : 'border-slate-300'
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />}
                  </div>
                  <span className={`text-sm font-medium ${isSelected ? 'text-[#0F172A]' : 'text-[#475569]'}`}>
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-white/80 backdrop-blur-xl border-t border-slate-200/50">
        <div className="max-w-2xl mx-auto px-6 py-4 flex justify-between">
          <Button
            onClick={handleBack}
            variant="outline"
            className="rounded-xl px-6 py-3 h-auto border-slate-200"
            data-testid="diagnostic-prev-button"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Precedent
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-[#0F766E] hover:bg-[#115E59] text-white rounded-xl px-6 py-3 h-auto disabled:opacity-40 shadow-sm"
            data-testid="diagnostic-next-button"
          >
            {isLast ? "Voir mes resultats" : "Suivant"}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
