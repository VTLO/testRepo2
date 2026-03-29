import { useState, useRef, useEffect, useCallback } from "react";
import { Shield, Send, Loader2, Trash2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getChatHistory, saveChatHistory, getChatSession, saveChatSession, getScores, getDiagnosticAnswers } from "@/lib/storage";
import Navigation from "@/components/Navigation";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const SUGGESTIONS = [
  "Quels sont mes plus gros risques ?",
  "Comment activer la double authentification ?",
  "J'ai clique sur un lien suspect, que faire ?",
  "Comment choisir un bon mot de passe ?",
];

export default function ChatAssistant() {
  const [messages, setMessages] = useState(getChatHistory());
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(getChatSession());
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  const buildContext = () => {
    const scores = getScores();
    const answers = getDiagnosticAnswers();
    if (!scores) return null;
    let ctx = `Score global: ${scores.overall}/100 (Risque ${scores.severity}).\n`;
    ctx += `Categories faibles: ${scores.weakCategories?.join(', ') || 'Aucune'}.\n`;
    if (answers.mfa_enabled) ctx += `MFA: ${answers.mfa_enabled}. `;
    if (answers.password_habits) ctx += `Mots de passe: ${answers.password_habits}. `;
    if (answers.backup) ctx += `Sauvegardes: ${answers.backup}. `;
    if (answers.updates) ctx += `Mises a jour: ${answers.updates}. `;
    return ctx;
  };

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;

    const userMsg = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    saveChatHistory(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${BACKEND_URL}/api/chat`, {
        message: text.trim(),
        session_id: sessionId,
        context: buildContext(),
        history: messages.slice(-10),
      });

      const assistantMsg = { role: "assistant", content: res.data.reply };
      const updated = [...newMessages, assistantMsg];
      setMessages(updated);
      saveChatHistory(updated);

      if (res.data.session_id && !sessionId) {
        setSessionId(res.data.session_id);
        saveChatSession(res.data.session_id);
      }
    } catch (err) {
      const errorMsg = {
        role: "assistant",
        content: "Desole, je rencontre un probleme technique. Veuillez reessayer dans quelques instants.",
      };
      const updated = [...newMessages, errorMsg];
      setMessages(updated);
      saveChatHistory(updated);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    saveChatHistory([]);
    setSessionId(null);
    saveChatSession(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col pb-20" data-testid="chat-page">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0F766E] flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <span className="font-['Outfit'] text-sm font-semibold text-[#0F172A]">CyberCopilote</span>
              <p className="text-xs text-[#64748B]">Assistant cybersecurite</p>
            </div>
          </div>
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="text-[#64748B] hover:text-red-500"
              data-testid="chat-clear-button"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-6 sm:px-8 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-[#CCFBF1] flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-[#0F766E]" strokeWidth={1.5} />
              </div>
              <h2 className="font-['Outfit'] text-xl font-semibold text-[#0F172A] mb-2">Comment puis-je vous aider ?</h2>
              <p className="text-sm text-[#64748B] mb-8 max-w-sm mx-auto">
                Posez-moi vos questions sur la cybersecurite. Je vous guide pas-a-pas avec des explications simples.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(s)}
                    className="text-left px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-[#475569] hover:border-[#0F766E] hover:bg-[#CCFBF1]/20 transition-all"
                    data-testid={`chat-suggestion-${i}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
              data-testid={`chat-message-${i}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-slate-100 border border-slate-200 rounded-2xl rounded-tr-none text-[#0F172A]"
                    : "bg-teal-50 border border-teal-100 rounded-2xl rounded-tl-none text-[#0F172A]"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-teal-50 border border-teal-100 rounded-2xl rounded-tl-none px-4 py-3">
                <Loader2 className="w-4 h-4 text-[#0F766E] animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="sticky bottom-20 bg-white/80 backdrop-blur-xl border-t border-slate-200/50">
        <div className="max-w-3xl mx-auto px-6 py-3 sm:px-8">
          <div className="flex items-end gap-3">
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:border-[#0F766E] focus-within:ring-2 focus-within:ring-[#0F766E]/20 transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Posez votre question..."
                rows={1}
                className="w-full px-4 py-3 bg-transparent text-sm text-[#0F172A] placeholder:text-[#94A3B8] resize-none focus:outline-none"
                data-testid="chat-input"
              />
            </div>
            <Button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="bg-[#0F766E] hover:bg-[#115E59] text-white rounded-xl h-[46px] w-[46px] p-0 flex-shrink-0 disabled:opacity-40"
              data-testid="chat-send-button"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-[10px] text-[#94A3B8] mt-2 text-center">
            CyberCopilote fournit des conseils educatifs, pas des avis juridiques ou de conformite.
          </p>
        </div>
      </div>

      <Navigation active="chat" />
    </div>
  );
}
