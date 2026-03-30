import { useState, useCallback } from "react";
import { Shield, Plus, Trash2, RefreshCw, Globe, Lock, Mail, AlertTriangle, CheckCircle2, Loader2, Search, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth, useApi } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";

function RiskBadge({ level }) {
  const config = {
    faible: "bg-emerald-100 text-emerald-800 border-emerald-200",
    modere: "bg-amber-100 text-amber-800 border-amber-200",
    eleve: "bg-orange-100 text-orange-800 border-orange-200",
    critique: "bg-red-100 text-red-800 border-red-200",
    tres_faible: "bg-emerald-100 text-emerald-800 border-emerald-200",
    inconnu: "bg-slate-100 text-slate-600 border-slate-200",
  };
  return <Badge className={`${config[level] || config.inconnu} border text-xs`}>Risque {level}</Badge>;
}

function StrengthBar({ strength }) {
  const colors = ["bg-red-500", "bg-red-500", "bg-orange-500", "bg-amber-500", "bg-emerald-400", "bg-emerald-500", "bg-emerald-600"];
  return (
    <div className="flex gap-1">
      {[0, 1, 2, 3, 4, 5].map(i => (
        <div key={i} className={`h-2 flex-1 rounded-full ${i < strength ? colors[strength] : 'bg-slate-200'}`} />
      ))}
    </div>
  );
}

export default function SecurityMonitor() {
  const { user } = useAuth();
  const api = useApi();
  const [emails, setEmails] = useState([]);
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState({});
  const [emailResults, setEmailResults] = useState({});
  const [domainInput, setDomainInput] = useState("");
  const [domainResult, setDomainResult] = useState(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordResult, setPasswordResult] = useState(null);
  const [emailsLoaded, setEmailsLoaded] = useState(false);

  const loadEmails = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await api.get("/emails");
      setEmails(data);
      setEmailsLoaded(true);
      // Load cached results
      const results = {};
      data.forEach(e => { if (e.breach_results) results[e.email] = e.breach_results; });
      setEmailResults(prev => ({ ...prev, ...results }));
    } catch {}
  }, [api, user]);

  useState(() => { if (user) loadEmails(); });

  const addEmail = async () => {
    if (!newEmail.trim()) return;
    setLoading(prev => ({ ...prev, add: true }));
    try {
      const { data } = await api.post("/emails", { email: newEmail.trim() });
      setEmails(prev => [...prev, data]);
      setNewEmail("");
    } catch (err) {
      alert(err.response?.data?.detail || "Erreur");
    } finally {
      setLoading(prev => ({ ...prev, add: false }));
    }
  };

  const removeEmail = async (id) => {
    try {
      await api.delete(`/emails/${id}`);
      setEmails(prev => prev.filter(e => e.id !== id));
    } catch {}
  };

  const checkEmail = async (email) => {
    setLoading(prev => ({ ...prev, [email]: true }));
    try {
      const { data } = await api.post("/security/check-email", { email });
      setEmailResults(prev => ({ ...prev, [email]: data }));
    } catch (err) {
      alert(err.response?.data?.detail || "Erreur lors de la verification");
    } finally {
      setLoading(prev => ({ ...prev, [email]: false }));
    }
  };

  const checkDomain = async () => {
    if (!domainInput.trim()) return;
    setLoading(prev => ({ ...prev, domain: true }));
    try {
      const { data } = await api.post("/security/check-domain", { domain: domainInput.trim() });
      setDomainResult(data);
    } catch (err) {
      alert(err.response?.data?.detail || "Erreur lors de la verification");
    } finally {
      setLoading(prev => ({ ...prev, domain: false }));
    }
  };

  const checkPassword = async () => {
    if (!passwordInput) return;
    setLoading(prev => ({ ...prev, password: true }));
    try {
      const { data } = await api.post("/security/check-password", { password: passwordInput });
      setPasswordResult(data);
    } catch (err) {
      alert(err.response?.data?.detail || "Erreur");
    } finally {
      setLoading(prev => ({ ...prev, password: false }));
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pb-24 flex flex-col items-center justify-center px-6">
        <Lock className="w-16 h-16 text-[#0F766E] mb-6" strokeWidth={1.5} />
        <h1 className="font-['Outfit'] text-2xl font-semibold text-[#0F172A] mb-3 text-center">Suivi personnalise</h1>
        <p className="text-sm text-[#475569] text-center mb-8 max-w-sm">Connectez-vous pour acceder au suivi de vos emails, verifier vos domaines et surveiller les fuites de donnees.</p>
        <Button onClick={() => window.location.href = "/login"} className="bg-[#0F766E] hover:bg-[#115E59] text-white rounded-xl px-8 py-4 h-auto" data-testid="security-login-button">
          Se connecter
        </Button>
        <Navigation active="securite" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24" data-testid="security-monitor-page">
      <div className="bg-white border-b border-slate-200/50">
        <div className="max-w-3xl mx-auto px-6 py-6 sm:px-8">
          <div className="flex items-center gap-3 mb-1">
            <Shield className="w-5 h-5 text-[#0F766E]" strokeWidth={1.5} />
            <span className="font-['Outfit'] text-lg font-semibold text-[#0F172A]">Suivi de securite</span>
          </div>
          <p className="text-sm text-[#64748B]">Surveillez vos emails, domaines et mots de passe</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6 sm:px-8">
        <Tabs defaultValue="emails" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-6 bg-slate-100 rounded-xl p-1 h-auto" data-testid="security-tabs">
            <TabsTrigger value="emails" className="rounded-lg py-2.5 text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm" data-testid="tab-emails">
              <Mail className="w-4 h-4 mr-1.5" /> Emails
            </TabsTrigger>
            <TabsTrigger value="domain" className="rounded-lg py-2.5 text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm" data-testid="tab-domain">
              <Globe className="w-4 h-4 mr-1.5" /> Domaine
            </TabsTrigger>
            <TabsTrigger value="password" className="rounded-lg py-2.5 text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm" data-testid="tab-password">
              <Lock className="w-4 h-4 mr-1.5" /> Mot de passe
            </TabsTrigger>
          </TabsList>

          {/* ─── EMAIL TAB ─── */}
          <TabsContent value="emails" className="space-y-4">
            <Card className="rounded-2xl border-slate-200/80 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
              <CardContent className="p-5">
                <h3 className="font-['Outfit'] text-sm font-semibold text-[#0F172A] mb-3">Ajouter un email a surveiller</h3>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="votre@email.com"
                    onKeyDown={(e) => e.key === "Enter" && addEmail()}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:bg-white focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 focus:outline-none"
                    data-testid="add-email-input"
                  />
                  <Button onClick={addEmail} disabled={loading.add} className="bg-[#0F766E] hover:bg-[#115E59] text-white rounded-xl px-4" data-testid="add-email-button">
                    {loading.add ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {emails.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="w-10 h-10 text-[#94A3B8] mx-auto mb-3" strokeWidth={1.5} />
                <p className="text-sm text-[#64748B]">Ajoutez des emails pour les surveiller</p>
              </div>
            ) : (
              emails.map((em) => {
                const result = emailResults[em.email];
                return (
                  <Card key={em.id} className="rounded-2xl border-slate-200/80 shadow-[0_2px_10px_rgba(15,23,42,0.04)]" data-testid={`email-card-${em.email}`}>
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <Mail className="w-4 h-4 text-[#64748B] flex-shrink-0" strokeWidth={1.5} />
                          <span className="text-sm font-medium text-[#0F172A] truncate">{em.email}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button size="sm" variant="outline" onClick={() => checkEmail(em.email)} disabled={loading[em.email]} className="rounded-lg text-xs border-slate-200" data-testid={`check-email-${em.email}`}>
                            {loading[em.email] ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                            <span className="ml-1">Verifier</span>
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => removeEmail(em.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg" data-testid={`remove-email-${em.email}`}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      {result && (
                        <div className="space-y-3 animate-fade-in">
                          <div className="flex items-center gap-3">
                            <RiskBadge level={result.risk_level} />
                            <span className="text-xs text-[#64748B]">Score: {result.risk_score}/100</span>
                          </div>
                          {result.breach_count > 0 && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="w-4 h-4 text-red-600" />
                                <span className="text-xs font-semibold text-red-800">{result.breach_count} fuite(s) detectee(s)</span>
                              </div>
                              <div className="space-y-1">
                                {result.breaches_found.map((b, i) => (
                                  <div key={i} className="text-xs text-red-700">
                                    {b.name} ({b.date}) - {(b.records / 1000000).toFixed(0)}M comptes - {b.data.join(", ")}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {result.hibp_appearances > 0 && (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                              <span className="text-xs text-amber-800">Trouve {result.hibp_appearances} fois dans des bases compromises</span>
                            </div>
                          )}
                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                            <span className="text-xs font-medium text-[#0F172A]">Fournisseur: {result.provider_info?.provider}</span>
                            <span className="text-xs text-[#64748B] ml-2">- {result.provider_info?.notes}</span>
                          </div>
                          {result.recommendations?.length > 0 && (
                            <div className="space-y-1.5">
                              {result.recommendations.filter(r => r.text).map((rec, i) => (
                                <div key={i} className="flex items-start gap-2 text-xs text-[#475569]">
                                  {rec.priority === "critique" ? <AlertTriangle className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" /> :
                                   rec.priority === "info" ? <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" /> :
                                   <AlertTriangle className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />}
                                  {rec.text}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          {/* ─── DOMAIN TAB ─── */}
          <TabsContent value="domain" className="space-y-4">
            <Card className="rounded-2xl border-slate-200/80 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
              <CardContent className="p-5">
                <h3 className="font-['Outfit'] text-sm font-semibold text-[#0F172A] mb-2">Verifier un domaine</h3>
                <p className="text-xs text-[#64748B] mb-3">Analysez la configuration de securite email d'un domaine (SPF, DKIM, DMARC, SSL).</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={domainInput}
                    onChange={(e) => setDomainInput(e.target.value)}
                    placeholder="exemple.fr"
                    onKeyDown={(e) => e.key === "Enter" && checkDomain()}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:bg-white focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 focus:outline-none"
                    data-testid="domain-input"
                  />
                  <Button onClick={checkDomain} disabled={loading.domain} className="bg-[#0F766E] hover:bg-[#115E59] text-white rounded-xl px-4" data-testid="check-domain-button">
                    {loading.domain ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {domainResult && (
              <Card className="rounded-2xl border-slate-200/80 shadow-[0_2px_10px_rgba(15,23,42,0.04)] animate-fade-in-up" data-testid="domain-result-card">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-['Outfit'] text-base font-semibold text-[#0F172A]">{domainResult.domain}</h3>
                      <p className="text-xs text-[#64748B]">Score: {domainResult.score}/{domainResult.max_score}</p>
                    </div>
                    <RiskBadge level={domainResult.risk_level} />
                  </div>

                  <div className="space-y-3">
                    {domainResult.checks.map((check, i) => (
                      <div key={i} className={`rounded-xl p-3 border ${
                        check.status === 'ok' ? 'bg-emerald-50 border-emerald-200' :
                        check.status === 'missing' ? 'bg-red-50 border-red-200' :
                        check.status === 'weak' ? 'bg-amber-50 border-amber-200' :
                        'bg-slate-50 border-slate-200'
                      }`} data-testid={`domain-check-${i}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-[#0F172A]">{check.name}</span>
                          <span className="text-xs font-bold" style={{ color: check.status === 'ok' ? '#10B981' : check.status === 'missing' ? '#EF4444' : '#F59E0B' }}>
                            {check.score}/{check.name === 'DMARC' ? 25 : 20}
                          </span>
                        </div>
                        <p className="text-xs text-[#475569]">{check.detail}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ─── PASSWORD TAB ─── */}
          <TabsContent value="password" className="space-y-4">
            <Card className="rounded-2xl border-slate-200/80 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
              <CardContent className="p-5">
                <h3 className="font-['Outfit'] text-sm font-semibold text-[#0F172A] mb-2">Verifier un mot de passe</h3>
                <p className="text-xs text-[#64748B] mb-3">
                  Verifiez si un mot de passe apparait dans des fuites de donnees connues. Votre mot de passe n'est jamais envoye en clair - seul un hash partiel est utilise.
                </p>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Entrez un mot de passe a tester"
                    onKeyDown={(e) => e.key === "Enter" && checkPassword()}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:bg-white focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 focus:outline-none"
                    data-testid="password-check-input"
                  />
                  <Button onClick={checkPassword} disabled={loading.password} className="bg-[#0F766E] hover:bg-[#115E59] text-white rounded-xl px-4" data-testid="check-password-button">
                    {loading.password ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {passwordResult && (
              <Card className="rounded-2xl border-slate-200/80 shadow-[0_2px_10px_rgba(15,23,42,0.04)] animate-fade-in-up" data-testid="password-result-card">
                <CardContent className="p-5 space-y-4">
                  <div className={`rounded-xl p-4 border ${passwordResult.compromised ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {passwordResult.compromised
                        ? <AlertTriangle className="w-5 h-5 text-red-600" />
                        : <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                      <span className={`text-sm font-semibold ${passwordResult.compromised ? 'text-red-800' : 'text-emerald-800'}`}>
                        {passwordResult.compromised
                          ? `Compromis ! Trouve ${passwordResult.appearances.toLocaleString()} fois dans des fuites.`
                          : "Ce mot de passe n'apparait dans aucune fuite connue."}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-[#0F172A]">Force du mot de passe</span>
                      <span className="text-xs font-semibold text-[#64748B]">{passwordResult.strength_label}</span>
                    </div>
                    <StrengthBar strength={passwordResult.strength} />
                  </div>

                  {passwordResult.recommendations?.filter(Boolean).length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-xs font-semibold text-[#0F172A]">Recommandations :</span>
                      {passwordResult.recommendations.filter(Boolean).map((rec, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-[#475569]">
                          <AlertTriangle className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />
                          {rec}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Navigation active="securite" />
    </div>
  );
}
