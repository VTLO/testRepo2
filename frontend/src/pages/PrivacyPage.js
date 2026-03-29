import { Shield, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC]" data-testid="privacy-page">
      <div className="bg-white border-b border-slate-200/50">
        <div className="max-w-3xl mx-auto px-6 py-6 sm:px-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-3 -ml-2 text-sm text-[#64748B] hover:text-[#0F172A]"
            data-testid="privacy-back-button"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Retour
          </Button>
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-[#0F766E]" strokeWidth={1.5} />
            <span className="font-['Outfit'] text-lg font-semibold text-[#0F172A]">Confidentialite et mentions</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 sm:px-8 space-y-6">
        <Card className="rounded-2xl border-slate-200/80 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
          <CardContent className="p-6 sm:p-8">
            <h2 className="font-['Outfit'] text-base font-semibold text-[#0F172A] mb-4">Protection de vos donnees</h2>
            <div className="space-y-3 text-sm text-[#475569] leading-relaxed">
              <p>
                <strong>Stockage local uniquement.</strong> Toutes vos donnees (diagnostic, plan d'action, historique de conversation) sont stockees exclusivement dans votre navigateur web. Aucune donnee personnelle n'est envoyee ni stockee sur un serveur distant.
              </p>
              <p>
                <strong>Conversations avec l'assistant.</strong> Lorsque vous utilisez l'assistant IA, vos messages sont envoyes a un service d'intelligence artificielle pour generer les reponses. Ces messages ne contiennent pas de donnees d'identification et ne sont pas associes a un compte utilisateur.
              </p>
              <p>
                <strong>Aucun compte requis.</strong> CyberCopilote fonctionne sans inscription, sans email, et sans mot de passe. Vous gardez le controle total de vos donnees.
              </p>
              <p>
                <strong>Export et suppression.</strong> Vous pouvez a tout moment exporter vos donnees au format JSON ou les supprimer completement depuis la page Parametres.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
          <CardContent className="p-6 sm:p-8">
            <h2 className="font-['Outfit'] text-base font-semibold text-[#0F172A] mb-4">Avertissement et limitations</h2>
            <div className="space-y-3 text-sm text-[#475569] leading-relaxed">
              <p>
                <strong>Guide educatif.</strong> CyberCopilote TPME fournit des conseils d'hygiene numerique a titre indicatif et educatif. Les recommandations ne constituent pas un avis juridique, une certification de securite, ni un audit professionnel.
              </p>
              <p>
                <strong>Pas de scan intrusif.</strong> Cette application n'effectue aucun scan de votre reseau, de vos appareils ou de vos comptes. Le diagnostic repose uniquement sur vos reponses declaratives.
              </p>
              <p>
                <strong>Incidents graves.</strong> En cas d'incident de securite serieux (ransomware, vol de donnees client, compromission bancaire), consultez un professionnel de la cybersecurite ou contactez cybermalveillance.gouv.fr pour une assistance officielle et gratuite.
              </p>
              <p>
                <strong>Ne remplace pas un professionnel.</strong> Pour les entreprises manipulant des donnees sensibles (sante, finance, juridique), un accompagnement par un prestataire specialise est recommande.
              </p>
              <p>
                <strong>Securite des mots de passe.</strong> CyberCopilote ne vous demandera jamais vos mots de passe, codes d'acces, ou informations bancaires. Ne partagez jamais ces informations.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-[#0F766E]/20 bg-[#CCFBF1]/20 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
          <CardContent className="p-6 sm:p-8">
            <h2 className="font-['Outfit'] text-base font-semibold text-[#0F766E] mb-3">Ressources officielles</h2>
            <ul className="space-y-2 text-sm text-[#475569]">
              <li>
                <strong>cybermalveillance.gouv.fr</strong> - Assistance et prevention des risques numeriques
              </li>
              <li>
                <strong>ANSSI (ssi.gouv.fr)</strong> - Guides de bonnes pratiques pour les TPE/PME
              </li>
              <li>
                <strong>CNIL (cnil.fr)</strong> - Protection des donnees personnelles et RGPD
              </li>
              <li>
                <strong>signal-spam.fr</strong> - Signalement de spam et phishing
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
