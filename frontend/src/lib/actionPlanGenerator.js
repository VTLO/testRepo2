export function generateActionPlan(answers, scores) {
  const tasks = [];
  const weakCats = scores?.weakCategories || [];

  // MFA tasks
  if (!answers.mfa_enabled || answers.mfa_enabled === 'none' || answers.mfa_enabled === 'unknown') {
    tasks.push({
      id: 'mfa_email',
      title: 'Activer la double authentification sur votre email',
      explanation: 'La double authentification (2FA) ajoute un code temporaire en plus de votre mot de passe.',
      why: 'Votre email est la cle de tous vos comptes. Sans 2FA, un pirate qui obtient votre mot de passe a acces a tout.',
      time: '10 minutes',
      effort: 'facile',
      impact: 'critique',
      category: 'account_security',
      period: 'today',
      steps: [
        'Connectez-vous a votre boite email',
        'Allez dans Parametres > Securite',
        'Cherchez "Verification en 2 etapes" ou "Double authentification"',
        'Activez avec votre numero de telephone ou une application comme Google Authenticator',
        'Sauvegardez les codes de secours dans un endroit sur'
      ],
      status: 'todo',
    });
  }
  if (answers.mfa_enabled === 'some') {
    tasks.push({
      id: 'mfa_all',
      title: 'Etendre la double authentification a tous vos comptes importants',
      explanation: 'Activez le 2FA sur vos comptes bancaires, cloud, et reseaux sociaux professionnels.',
      why: 'Chaque compte sans 2FA est une porte d\'entree potentielle pour un pirate.',
      time: '30 minutes',
      effort: 'facile',
      impact: 'eleve',
      category: 'account_security',
      period: 'week',
      steps: [
        'Listez vos comptes importants : banque, cloud, reseaux sociaux, comptabilite',
        'Pour chaque compte, allez dans les parametres de securite',
        'Activez la double authentification',
        'Utilisez une application d\'authentification plutot que les SMS si possible'
      ],
      status: 'todo',
    });
  }

  // Password tasks
  if (answers.password_habits === 'reuse' || answers.password_habits === 'simple') {
    tasks.push({
      id: 'password_manager',
      title: 'Installer un gestionnaire de mots de passe gratuit',
      explanation: 'Un gestionnaire cree et memorise des mots de passe uniques et complexes pour vous.',
      why: 'Reutiliser les memes mots de passe signifie qu\'un seul piratage compromet tous vos comptes.',
      time: '20 minutes',
      effort: 'facile',
      impact: 'critique',
      category: 'account_security',
      period: 'today',
      steps: [
        'Telechargez Bitwarden (gratuit) sur bitwarden.com',
        'Creez un compte avec un mot de passe maitre tres fort',
        'Installez l\'extension navigateur',
        'Commencez par changer les mots de passe de vos 3 comptes les plus importants',
        'Laissez Bitwarden generer et stocker les nouveaux mots de passe'
      ],
      status: 'todo',
    });
  }

  // Update tasks
  if (answers.updates === 'sometimes' || answers.updates === 'rarely') {
    tasks.push({
      id: 'enable_updates',
      title: 'Activer les mises a jour automatiques',
      explanation: 'Les mises a jour corrigent les failles de securite decouvertes.',
      why: 'Les pirates exploitent souvent des failles deja corrigees dans les mises a jour que vous n\'avez pas installees.',
      time: '10 minutes',
      effort: 'facile',
      impact: 'eleve',
      category: 'device_security',
      period: 'today',
      steps: [
        'Sur Windows : Parametres > Mise a jour et securite > Activez les mises a jour automatiques',
        'Sur Mac : Preferences Systeme > Mise a jour de logiciels > Cochez "Automatiquement"',
        'Sur votre telephone : Parametres > Mise a jour logicielle > Activez les mises a jour auto',
        'Redemarrez votre ordinateur si des mises a jour sont en attente'
      ],
      status: 'todo',
    });
  }

  // Backup tasks
  if (answers.backup === 'none' || answers.backup === 'manual') {
    tasks.push({
      id: 'setup_backup',
      title: 'Mettre en place une sauvegarde automatique',
      explanation: 'Configurez une sauvegarde automatique de vos fichiers importants.',
      why: 'En cas de ransomware, panne ou vol, vos donnees seront recuperables.',
      time: '30 minutes',
      effort: 'moyen',
      impact: 'critique',
      category: 'backup',
      period: 'week',
      steps: [
        'Identifiez vos fichiers les plus importants (documents clients, comptabilite, contrats)',
        'Choisissez une solution gratuite : Google Drive (15 Go), OneDrive (5 Go)',
        'Installez l\'application de synchronisation sur votre ordinateur',
        'Configurez la synchronisation automatique du dossier de travail',
        'Testez que vos fichiers apparaissent bien dans le cloud'
      ],
      status: 'todo',
    });
  }

  // Antivirus
  if (answers.antivirus === 'none') {
    tasks.push({
      id: 'enable_antivirus',
      title: 'Activer la protection antivirus integree',
      explanation: 'Windows Defender est deja installe et gratuit sur Windows.',
      why: 'Sans protection, votre ordinateur est vulnerable aux virus et logiciels malveillants.',
      time: '5 minutes',
      effort: 'facile',
      impact: 'eleve',
      category: 'device_security',
      period: 'today',
      steps: [
        'Sur Windows : allez dans Securite Windows > Protection contre les virus et menaces',
        'Verifiez que la protection en temps reel est activee',
        'Lancez une analyse rapide',
        'Sur Mac : la protection integree XProtect est automatique'
      ],
      status: 'todo',
    });
  }

  // Wi-Fi
  if (answers.wifi_security === 'wpa2_default' || answers.wifi_security === 'open') {
    tasks.push({
      id: 'secure_wifi',
      title: 'Securiser votre Wi-Fi professionnel',
      explanation: 'Changez le mot de passe par defaut de votre box/routeur.',
      why: 'Un Wi-Fi mal protege permet a n\'importe qui a proximite d\'intercepter vos donnees.',
      time: '15 minutes',
      effort: 'moyen',
      impact: 'eleve',
      category: 'network',
      period: 'week',
      steps: [
        'Connectez-vous a l\'interface de votre box (192.168.1.1 ou 192.168.0.1)',
        'Cherchez la section Wi-Fi ou Sans-fil',
        'Changez le mot de passe pour un mot de passe complexe (min 12 caracteres)',
        'Selectionnez WPA2 ou WPA3 comme type de securite',
        'Reconnectez vos appareils avec le nouveau mot de passe'
      ],
      status: 'todo',
    });
  }

  // Guest Wi-Fi
  if (answers.guest_wifi === 'no') {
    tasks.push({
      id: 'guest_wifi_setup',
      title: 'Creer un reseau Wi-Fi invite',
      explanation: 'Separee votre reseau de travail du reseau pour les visiteurs.',
      why: 'Les visiteurs ne doivent pas pouvoir acceder a vos fichiers et imprimantes.',
      time: '15 minutes',
      effort: 'moyen',
      impact: 'moyen',
      category: 'network',
      period: 'month',
      steps: [
        'Connectez-vous a l\'interface de votre box',
        'Cherchez l\'option "Reseau invite" ou "Guest Network"',
        'Activez-le avec un mot de passe different de votre reseau principal',
        'Donnez ce mot de passe invite a vos visiteurs'
      ],
      status: 'todo',
    });
  }

  // Client data
  if (answers.client_data === 'sensitive' || answers.client_data === 'basic') {
    tasks.push({
      id: 'data_audit',
      title: 'Faire un inventaire de vos donnees clients',
      explanation: 'Identifiez ou sont stockees les donnees personnelles de vos clients.',
      why: 'Le RGPD vous oblige a proteger ces donnees. En cas de fuite, votre responsabilite est engagee.',
      time: '45 minutes',
      effort: 'moyen',
      impact: 'eleve',
      category: 'data_protection',
      period: 'month',
      steps: [
        'Listez tous les endroits ou vous stockez des donnees clients',
        'Verifiez que l\'acces est protege par mot de passe',
        'Supprimez les donnees dont vous n\'avez plus besoin',
        'Verifiez que vos outils cloud sont securises (2FA, partages limites)'
      ],
      status: 'todo',
    });
  }

  // Phishing
  if (answers.phishing_awareness === 'clicked' || answers.phishing_awareness === 'aware_unsure') {
    tasks.push({
      id: 'phishing_training',
      title: 'Apprendre a reconnaitre le phishing',
      explanation: 'Familiarisez-vous avec les techniques courantes d\'hameconnage.',
      why: 'Le phishing est la premiere cause de piratage des petites entreprises.',
      time: '15 minutes',
      effort: 'facile',
      impact: 'eleve',
      category: 'email_phishing',
      period: 'week',
      steps: [
        'Verifiez toujours l\'adresse de l\'expediteur (pas seulement le nom affiche)',
        'Mefiance si on vous demande d\'agir dans l\'urgence',
        'Ne cliquez jamais sur un lien dans un email douteux',
        'En cas de doute, contactez directement l\'organisme par un autre moyen',
        'Consultez notre Centre d\'apprentissage pour plus de conseils'
      ],
      status: 'todo',
    });
  }

  // Incident plan
  if (answers.incident_plan === 'none' || answers.incident_plan === 'mental') {
    tasks.push({
      id: 'incident_plan',
      title: 'Rediger une fiche reflexe en cas d\'incident',
      explanation: 'Preparez une simple note avec les etapes a suivre en cas de probleme.',
      why: 'En situation de stress, avoir une marche a suivre evite la panique et les erreurs.',
      time: '30 minutes',
      effort: 'moyen',
      impact: 'moyen',
      category: 'business_continuity',
      period: 'month',
      steps: [
        'Notez les numeros importants : banque, hebergeur, support informatique',
        'Listez vos comptes les plus critiques par ordre de priorite',
        'Ecrivez les premieres actions a faire : deconnecter, changer mots de passe, prevenir',
        'Gardez cette fiche accessible (pas seulement sur l\'ordinateur !)',
        'Consultez la section Urgences de CyberCopilote pour vous inspirer'
      ],
      status: 'todo',
    });
  }

  // Device separation
  if (answers.device_separation === 'mixed') {
    tasks.push({
      id: 'device_separation',
      title: 'Separer vos usages pro et perso sur vos appareils',
      explanation: 'Creez un profil ou session separee pour le travail.',
      why: 'Melanger les usages expose vos donnees professionnelles aux risques personnels.',
      time: '20 minutes',
      effort: 'moyen',
      impact: 'moyen',
      category: 'device_security',
      period: 'month',
      steps: [
        'Creez un compte utilisateur separe sur votre ordinateur pour le travail',
        'Sur votre telephone, utilisez un profil professionnel si disponible',
        'Evitez d\'installer des applications personnelles dans l\'espace de travail',
        'Utilisez un navigateur different pour le travail et le personnel'
      ],
      status: 'todo',
    });
  }

  // Recurring monthly tasks
  tasks.push(
    {
      id: 'monthly_review_passwords',
      title: 'Verifier vos mots de passe compromis',
      explanation: 'Verifiez si vos identifiants ont fuite en ligne.',
      why: 'Des millions de mots de passe sont voles chaque mois. Verifier regulierement permet de reagir vite.',
      time: '10 minutes',
      effort: 'facile',
      impact: 'eleve',
      category: 'account_security',
      period: 'recurring',
      steps: [
        'Allez sur haveibeenpwned.com',
        'Entrez votre adresse email',
        'Si une fuite est detectee, changez immediatement le mot de passe du service concerne',
        'Activez le 2FA sur ce service'
      ],
      status: 'todo',
    },
    {
      id: 'monthly_backup_check',
      title: 'Verifier que vos sauvegardes fonctionnent',
      explanation: 'Assurez-vous que vos sauvegardes sont a jour et accessibles.',
      why: 'Une sauvegarde qui ne fonctionne pas ne sert a rien le jour ou vous en avez besoin.',
      time: '10 minutes',
      effort: 'facile',
      impact: 'eleve',
      category: 'backup',
      period: 'recurring',
      steps: [
        'Verifiez la date de votre derniere sauvegarde',
        'Ouvrez un fichier sauvegarde pour confirmer qu\'il est lisible',
        'Verifiez l\'espace disponible sur votre support de sauvegarde'
      ],
      status: 'todo',
    }
  );

  // Sort: today first, then week, month, recurring
  const periodOrder = { today: 0, week: 1, month: 2, recurring: 3 };
  const impactOrder = { critique: 0, eleve: 1, moyen: 2, faible: 3 };
  tasks.sort((a, b) => {
    const pDiff = (periodOrder[a.period] || 9) - (periodOrder[b.period] || 9);
    if (pDiff !== 0) return pDiff;
    return (impactOrder[a.impact] || 9) - (impactOrder[b.impact] || 9);
  });

  return tasks;
}

export function getImpactColor(impact) {
  const colors = {
    critique: 'bg-red-100 text-red-800 border-red-200',
    eleve: 'bg-amber-100 text-amber-800 border-amber-200',
    moyen: 'bg-blue-100 text-blue-800 border-blue-200',
    faible: 'bg-slate-100 text-slate-600 border-slate-200',
  };
  return colors[impact] || colors.moyen;
}

export function getEffortLabel(effort) {
  const labels = { facile: 'Facile', moyen: 'Moyen', difficile: 'Difficile' };
  return labels[effort] || effort;
}

export function getPeriodLabel(period) {
  const labels = {
    today: 'A faire aujourd\'hui',
    week: 'A faire cette semaine',
    month: 'A faire ce mois-ci',
    recurring: 'A verifier chaque mois',
  };
  return labels[period] || period;
}
