import { useState, useRef } from "react";
import { Settings as SettingsIcon, Bell, Download, Upload, Trash2, Shield, CheckCircle2, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { getReminders, saveReminders, exportAllData, importAllData, resetAllData } from "@/lib/storage";
import Navigation from "@/components/Navigation";

export default function Settings() {
  const [reminders, setReminders] = useState(getReminders());
  const [exportMessage, setExportMessage] = useState(null);
  const [importMessage, setImportMessage] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const fileInputRef = useRef(null);

  const toggleReminder = (key) => {
    const updated = { ...reminders, [key]: !reminders[key] };
    setReminders(updated);
    saveReminders(updated);
  };

  const handleExport = () => {
    try {
      const data = exportAllData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cybercopilote-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setExportMessage("success");
      setTimeout(() => setExportMessage(null), 3000);
    } catch {
      setExportMessage("error");
    }
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target.result);
        importAllData(data);
        setImportMessage("success");
        setTimeout(() => {
          setImportMessage(null);
          window.location.reload();
        }, 1500);
      } catch {
        setImportMessage("error");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleReset = () => {
    resetAllData();
    window.location.href = "/";
  };

  const reminderItems = [
    { key: 'monthlyReview', label: 'Revue mensuelle de cyberhygiene', desc: 'Rappel pour verifier votre score et vos actions chaque mois' },
    { key: 'backupReminder', label: 'Rappel de sauvegarde', desc: 'Verifiez regulierement que vos sauvegardes fonctionnent' },
    { key: 'updateReminder', label: 'Rappel de mises a jour', desc: 'Pensez a mettre a jour vos appareils et logiciels' },
    { key: 'mfaReminder', label: 'Rappel MFA', desc: 'Activez la double authentification sur vos nouveaux comptes' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24" data-testid="settings-page">
      <div className="bg-white border-b border-slate-200/50">
        <div className="max-w-3xl mx-auto px-6 py-6 sm:px-8">
          <div className="flex items-center gap-3 mb-1">
            <SettingsIcon className="w-5 h-5 text-[#0F766E]" strokeWidth={1.5} />
            <span className="font-['Outfit'] text-lg font-semibold text-[#0F172A]">Parametres</span>
          </div>
          <p className="text-sm text-[#64748B]">Rappels, sauvegarde et gestion des donnees</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6 sm:px-8 space-y-6">
        {/* Reminders */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-[#0F766E]" strokeWidth={1.5} />
            <h2 className="font-['Outfit'] text-base font-semibold text-[#0F172A]">Rappels in-app</h2>
          </div>
          <Card className="rounded-2xl border-slate-200/80 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
            <CardContent className="p-0 divide-y divide-slate-100">
              {reminderItems.map((item) => (
                <div key={item.key} className="flex items-center justify-between px-5 py-4" data-testid={`reminder-${item.key}`}>
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="text-sm font-medium text-[#0F172A]">{item.label}</p>
                    <p className="text-xs text-[#64748B]">{item.desc}</p>
                  </div>
                  <Switch
                    checked={reminders[item.key]}
                    onCheckedChange={() => toggleReminder(item.key)}
                    data-testid={`reminder-toggle-${item.key}`}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Export / Import */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-[#0F766E]" strokeWidth={1.5} />
            <h2 className="font-['Outfit'] text-base font-semibold text-[#0F172A]">Sauvegarde des donnees</h2>
          </div>
          <Card className="rounded-2xl border-slate-200/80 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
            <CardContent className="p-5 space-y-4">
              <p className="text-sm text-[#475569]">
                Vos donnees sont stockees localement dans votre navigateur. Exportez-les pour les sauvegarder ou les transferer.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleExport}
                  variant="outline"
                  className="rounded-xl border-slate-200 hover:border-slate-300 flex items-center gap-2"
                  data-testid="export-button"
                >
                  <Download className="w-4 h-4" /> Exporter (JSON)
                </Button>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="rounded-xl border-slate-200 hover:border-slate-300 flex items-center gap-2"
                  data-testid="import-button"
                >
                  <Upload className="w-4 h-4" /> Importer
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleImport}
                  data-testid="import-file-input"
                />
              </div>
              {exportMessage === 'success' && (
                <div className="flex items-center gap-2 text-sm text-[#10B981]" data-testid="export-success">
                  <CheckCircle2 className="w-4 h-4" /> Export reussi !
                </div>
              )}
              {importMessage === 'success' && (
                <div className="flex items-center gap-2 text-sm text-[#10B981]" data-testid="import-success">
                  <CheckCircle2 className="w-4 h-4" /> Import reussi ! Rechargement...
                </div>
              )}
              {importMessage === 'error' && (
                <div className="flex items-center gap-2 text-sm text-[#EF4444]" data-testid="import-error">
                  <AlertTriangle className="w-4 h-4" /> Fichier invalide
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Reset */}
        <div>
          <Card className="rounded-2xl border-red-200 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
            <CardContent className="p-5">
              <h3 className="font-['Outfit'] text-sm font-semibold text-red-700 mb-2">Reinitialiser toutes les donnees</h3>
              <p className="text-xs text-[#64748B] mb-4">
                Cette action supprimera definitivement toutes vos donnees locales (diagnostic, plan d'action, historique de chat).
              </p>
              {!showResetConfirm ? (
                <Button
                  variant="outline"
                  onClick={() => setShowResetConfirm(true)}
                  className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 text-sm"
                  data-testid="reset-button"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Tout supprimer
                </Button>
              ) : (
                <div className="flex gap-3">
                  <Button
                    onClick={handleReset}
                    className="bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm"
                    data-testid="reset-confirm-button"
                  >
                    Confirmer la suppression
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowResetConfirm(false)}
                    className="rounded-xl text-sm"
                    data-testid="reset-cancel-button"
                  >
                    Annuler
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Navigation active="parametres" />
    </div>
  );
}
