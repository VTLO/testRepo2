export const QUESTIONS = [
  {
    id: 'business_type',
    question: 'Quel est votre type d\'activite ?',
    helpText: 'Cela nous aide a adapter les recommandations a votre contexte.',
    type: 'single',
    category: null,
    options: [
      { value: 'freelance', label: 'Freelance / Independant' },
      { value: 'auto_entrepreneur', label: 'Auto-entrepreneur' },
      { value: 'consultant', label: 'Consultant / Coach' },
      { value: 'commerce', label: 'Commerce / Boutique' },
      { value: 'liberal', label: 'Profession liberale (therapeute, avocat...)' },
      { value: 'tpe', label: 'TPE (1 a 5 personnes)' },
      { value: 'other', label: 'Autre' },
    ],
  },
  {
    id: 'team_size',
    question: 'Combien de personnes travaillent dans votre structure ?',
    helpText: 'Vous inclus.',
    type: 'single',
    category: null,
    options: [
      { value: '1', label: 'Juste moi' },
      { value: '2-3', label: '2 a 3 personnes' },
      { value: '4-5', label: '4 a 5 personnes' },
      { value: '5+', label: 'Plus de 5' },
    ],
  },
  {
    id: 'devices',
    question: 'Quels appareils utilisez-vous pour travailler ?',
    helpText: 'Selectionnez tous ceux qui s\'appliquent.',
    type: 'multi',
    category: 'device_security',
    options: [
      { value: 'laptop', label: 'Ordinateur portable' },
      { value: 'desktop', label: 'Ordinateur fixe' },
      { value: 'smartphone', label: 'Smartphone' },
      { value: 'tablet', label: 'Tablette' },
    ],
  },
  {
    id: 'device_separation',
    question: 'Utilisez-vous les memes appareils pour le travail et le personnel ?',
    helpText: 'Melanger les usages augmente les risques.',
    type: 'single',
    category: 'device_security',
    options: [
      { value: 'separated', label: 'Non, j\'ai des appareils separes', score: 10 },
      { value: 'mixed', label: 'Oui, je melange les deux', score: 0 },
      { value: 'partial', label: 'Partiellement (telephone perso, PC pro)', score: 5 },
    ],
  },
  {
    id: 'email_provider',
    question: 'Quel type de messagerie utilisez-vous pour le travail ?',
    helpText: 'La messagerie est souvent la premiere cible des attaques.',
    type: 'single',
    category: 'email_phishing',
    options: [
      { value: 'pro_suite', label: 'Email professionnel (Google Workspace, Microsoft 365)', score: 10 },
      { value: 'free_email', label: 'Email gratuit (Gmail, Outlook perso, Yahoo)', score: 3 },
      { value: 'own_domain', label: 'Email avec mon propre domaine', score: 7 },
      { value: 'unsure', label: 'Je ne sais pas', score: 0 },
    ],
  },
  {
    id: 'mfa_enabled',
    question: 'Avez-vous active la double authentification (MFA/2FA) sur vos comptes importants ?',
    helpText: 'La double authentification ajoute un code en plus du mot de passe. C\'est la protection la plus efficace.',
    type: 'single',
    category: 'account_security',
    options: [
      { value: 'all', label: 'Oui, sur tous mes comptes importants', score: 15 },
      { value: 'some', label: 'Oui, sur certains comptes', score: 8 },
      { value: 'none', label: 'Non, pas encore', score: 0 },
      { value: 'unknown', label: 'Je ne sais pas ce que c\'est', score: 0 },
    ],
  },
  {
    id: 'password_habits',
    question: 'Comment gerez-vous vos mots de passe ?',
    helpText: 'Les mots de passe reutilises sont l\'une des causes principales de piratage.',
    type: 'single',
    category: 'account_security',
    options: [
      { value: 'manager', label: 'J\'utilise un gestionnaire de mots de passe', score: 15 },
      { value: 'unique', label: 'J\'utilise des mots de passe differents sans gestionnaire', score: 8 },
      { value: 'reuse', label: 'J\'utilise souvent les memes mots de passe', score: 0 },
      { value: 'simple', label: 'J\'utilise des mots de passe simples a retenir', score: 2 },
    ],
  },
  {
    id: 'updates',
    question: 'A quelle frequence mettez-vous a jour vos appareils et logiciels ?',
    helpText: 'Les mises a jour corrigent des failles de securite connues.',
    type: 'single',
    category: 'device_security',
    options: [
      { value: 'auto', label: 'Automatiquement, des que possible', score: 10 },
      { value: 'regular', label: 'Regulierement, chaque semaine', score: 8 },
      { value: 'sometimes', label: 'De temps en temps', score: 3 },
      { value: 'rarely', label: 'Rarement ou jamais', score: 0 },
    ],
  },
  {
    id: 'antivirus',
    question: 'Avez-vous une protection antivirus sur vos appareils ?',
    helpText: 'Windows Defender (integre a Windows) est deja une bonne protection.',
    type: 'single',
    category: 'device_security',
    options: [
      { value: 'dedicated', label: 'Oui, un antivirus dedie', score: 10 },
      { value: 'builtin', label: 'Oui, la protection integree (Windows Defender, etc.)', score: 8 },
      { value: 'none', label: 'Non, rien', score: 0 },
      { value: 'unsure', label: 'Je ne sais pas', score: 2 },
    ],
  },
  {
    id: 'backup',
    question: 'Faites-vous des sauvegardes regulieres de vos donnees importantes ?',
    helpText: 'En cas de panne, vol ou ransomware, la sauvegarde est votre filet de securite.',
    type: 'single',
    category: 'backup',
    options: [
      { value: 'auto_multi', label: 'Oui, automatiquement sur plusieurs supports', score: 15 },
      { value: 'auto_cloud', label: 'Oui, automatiquement dans le cloud', score: 12 },
      { value: 'manual', label: 'Oui, manuellement de temps en temps', score: 5 },
      { value: 'none', label: 'Non, pas vraiment', score: 0 },
    ],
  },
  {
    id: 'wifi_security',
    question: 'Comment est configure votre Wi-Fi professionnel ?',
    helpText: 'Un Wi-Fi mal securise peut permettre a des intrus d\'acceder a vos donnees.',
    type: 'single',
    category: 'network',
    options: [
      { value: 'wpa3', label: 'WPA3 avec mot de passe complexe', score: 10 },
      { value: 'wpa2_strong', label: 'WPA2 avec un bon mot de passe', score: 8 },
      { value: 'wpa2_default', label: 'Le mot de passe d\'origine de la box', score: 3 },
      { value: 'open', label: 'Pas de mot de passe / je ne sais pas', score: 0 },
    ],
  },
  {
    id: 'guest_wifi',
    question: 'Avez-vous un reseau Wi-Fi separe pour les visiteurs/clients ?',
    helpText: 'Separer les reseaux empeche les visiteurs d\'acceder a vos fichiers.',
    type: 'single',
    category: 'network',
    dependsOn: { id: 'business_type', notValues: ['freelance'] },
    options: [
      { value: 'yes', label: 'Oui, un reseau invite separe', score: 10 },
      { value: 'no', label: 'Non, tout le monde utilise le meme', score: 0 },
      { value: 'no_visitors', label: 'Je ne recois pas de visiteurs', score: 10 },
    ],
  },
  {
    id: 'client_data',
    question: 'Stockez-vous des donnees personnelles de clients ?',
    helpText: 'Emails, numeros de telephone, adresses, informations de paiement...',
    type: 'single',
    category: 'data_protection',
    options: [
      { value: 'sensitive', label: 'Oui, des donnees sensibles (sante, finance...)', score: 0 },
      { value: 'basic', label: 'Oui, des informations basiques (nom, email)', score: 5 },
      { value: 'minimal', label: 'Tres peu de donnees clients', score: 8 },
      { value: 'none', label: 'Non, aucune', score: 10 },
    ],
  },
  {
    id: 'phishing_awareness',
    question: 'Avez-vous deja recu un email ou SMS suspect vous demandant des informations ?',
    helpText: 'Le phishing est la menace numero 1 pour les petites entreprises.',
    type: 'single',
    category: 'email_phishing',
    options: [
      { value: 'aware_trained', label: 'Oui, et je sais les identifier', score: 10 },
      { value: 'aware_unsure', label: 'Oui, mais je ne suis pas toujours sur(e)', score: 5 },
      { value: 'clicked', label: 'Oui, et j\'ai deja clique par erreur', score: 0 },
      { value: 'never', label: 'Je ne pense pas en avoir recu', score: 3 },
    ],
  },
  {
    id: 'incident_plan',
    question: 'Avez-vous un plan en cas de probleme de securite ?',
    helpText: 'Meme une simple note avec les etapes a suivre peut faire la difference.',
    type: 'single',
    category: 'business_continuity',
    options: [
      { value: 'documented', label: 'Oui, j\'ai une procedure ecrite', score: 15 },
      { value: 'mental', label: 'J\'ai une idee de quoi faire, sans document', score: 5 },
      { value: 'none', label: 'Non, je n\'y ai jamais pense', score: 0 },
    ],
  },
  {
    id: 'cloud_tools',
    question: 'Quels outils cloud utilisez-vous ?',
    helpText: 'Les outils en ligne sont pratiques mais necessitent une bonne securisation.',
    type: 'multi',
    category: 'account_security',
    options: [
      { value: 'google_drive', label: 'Google Drive' },
      { value: 'dropbox', label: 'Dropbox' },
      { value: 'onedrive', label: 'OneDrive' },
      { value: 'notion', label: 'Notion / Trello / Asana' },
      { value: 'accounting', label: 'Logiciel de comptabilite en ligne' },
      { value: 'crm', label: 'CRM (gestion clients)' },
      { value: 'none', label: 'Aucun outil cloud' },
    ],
  },
];

export function getVisibleQuestions(answers) {
  return QUESTIONS.filter(q => {
    if (!q.dependsOn) return true;
    const depAnswer = answers[q.dependsOn.id];
    if (q.dependsOn.notValues) {
      return !q.dependsOn.notValues.includes(depAnswer);
    }
    if (q.dependsOn.values) {
      return q.dependsOn.values.includes(depAnswer);
    }
    return true;
  });
}
