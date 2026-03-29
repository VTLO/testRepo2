export const LEARNING_CARDS = [
  {
    id: 'phishing',
    title: 'Qu\'est-ce que le phishing ?',
    icon: 'Fish',
    category: 'email_phishing',
    readTime: '3 min',
    content: [
      {
        subtitle: 'Definition simple',
        text: 'Le phishing (ou hameconnage) est une technique ou un pirate se fait passer pour un organisme de confiance (banque, impots, La Poste...) pour vous soutirer des informations personnelles.'
      },
      {
        subtitle: 'Comment le reconnaitre ?',
        text: 'Verifiez toujours l\'adresse email de l\'expediteur (pas seulement le nom affiche). Mefiance si on vous demande d\'agir dans l\'urgence, si le message contient des fautes, ou si le lien ne pointe pas vers le site officiel.'
      },
      {
        subtitle: 'Que faire ?',
        text: 'Ne cliquez sur rien. Signalez le message comme spam. En cas de doute, contactez directement l\'organisme par telephone ou via son site officiel (pas via le lien du message).'
      },
    ],
  },
  {
    id: 'mfa',
    title: 'Pourquoi activer la double authentification ?',
    icon: 'ShieldCheck',
    category: 'account_security',
    readTime: '2 min',
    content: [
      {
        subtitle: 'Le principe',
        text: 'La double authentification (2FA ou MFA) ajoute une deuxieme verification quand vous vous connectez : en plus de votre mot de passe, vous devez confirmer avec un code recu sur votre telephone.'
      },
      {
        subtitle: 'Pourquoi c\'est essentiel',
        text: 'Meme si un pirate obtient votre mot de passe, il ne pourra pas se connecter sans ce deuxieme code. C\'est la protection la plus efficace et la plus simple a mettre en place.'
      },
      {
        subtitle: 'Comment faire',
        text: 'Allez dans les parametres de securite de chaque compte important et activez la "Verification en 2 etapes". Utilisez une application comme Google Authenticator ou Microsoft Authenticator.'
      },
    ],
  },
  {
    id: 'backup',
    title: 'Comment faire une bonne sauvegarde ?',
    icon: 'HardDrive',
    category: 'backup',
    readTime: '3 min',
    content: [
      {
        subtitle: 'La regle du 3-2-1',
        text: '3 copies de vos donnees, sur 2 supports differents, dont 1 hors site (cloud). Meme une version simplifiee protege deja enormement.'
      },
      {
        subtitle: 'Solutions gratuites',
        text: 'Google Drive (15 Go), OneDrive (5 Go), ou un disque dur externe. L\'ideal est de combiner cloud + support physique.'
      },
      {
        subtitle: 'Automatisez !',
        text: 'Configurez la synchronisation automatique de vos dossiers importants. Ne comptez pas sur votre memoire pour faire des sauvegardes manuelles.'
      },
    ],
  },
  {
    id: 'scam_recognition',
    title: 'Comment reconnaitre une arnaque ?',
    icon: 'AlertTriangle',
    category: 'email_phishing',
    readTime: '3 min',
    content: [
      {
        subtitle: 'Les signaux d\'alerte',
        text: 'Urgence artificielle ("Votre compte sera bloque dans 24h"), offres trop belles, demandes d\'informations personnelles par email, fautes d\'orthographe, adresses email suspectes.'
      },
      {
        subtitle: 'Les arnaques courantes',
        text: 'Faux support technique, fausses factures, faux avis de passage de colis, faux remboursement d\'impots, arnaque au president (faux dirigeant demandant un virement).'
      },
      {
        subtitle: 'Le reflexe a adopter',
        text: 'En cas de doute, ne faites RIEN. Contactez l\'organisme par un canal officiel. Prenez le temps de verifier. Un organisme serieux ne vous demandera jamais votre mot de passe par email.'
      },
    ],
  },
  {
    id: 'wifi_security',
    title: 'Comment securiser son Wi-Fi pro ?',
    icon: 'Wifi',
    category: 'network',
    readTime: '2 min',
    content: [
      {
        subtitle: 'Changez le mot de passe par defaut',
        text: 'Le mot de passe ecrit sur votre box est connu des pirates. Changez-le pour un mot de passe unique d\'au moins 12 caracteres.'
      },
      {
        subtitle: 'Choisissez le bon protocole',
        text: 'Utilisez WPA2 ou WPA3 (jamais WEP qui est obsolete). Cette option se trouve dans les parametres de votre box.'
      },
      {
        subtitle: 'Separee les reseaux',
        text: 'Si vous recevez des clients ou visiteurs, activez le reseau invite de votre box pour qu\'ils n\'aient pas acces a vos fichiers professionnels.'
      },
    ],
  },
  {
    id: 'after_hack',
    title: 'Que faire apres un piratage ?',
    icon: 'LifeBuoy',
    category: 'business_continuity',
    readTime: '3 min',
    content: [
      {
        subtitle: 'Les 3 premieres actions',
        text: '1. Changez immediatement les mots de passe compromis. 2. Activez le 2FA sur tous vos comptes. 3. Verifiez l\'activite recente de vos comptes.'
      },
      {
        subtitle: 'Signalez',
        text: 'Rendez-vous sur cybermalveillance.gouv.fr pour etre guide gratuitement. Deposez plainte si necessaire. Prevenez votre banque en cas de donnees financieres compromises.'
      },
      {
        subtitle: 'Apprenez',
        text: 'Analysez comment c\'est arrive pour eviter que ca se reproduise. Mettez en place les protections manquantes. Ne vous sentez pas coupable : ca arrive meme aux experts.'
      },
    ],
  },
  {
    id: 'priority_accounts',
    title: 'Quels comptes proteger en priorite ?',
    icon: 'Star',
    category: 'account_security',
    readTime: '2 min',
    content: [
      {
        subtitle: 'Niveau 1 : ultra-critique',
        text: 'Email principal (c\'est la cle de tout), comptes bancaires, services de paiement (PayPal, Stripe...).'
      },
      {
        subtitle: 'Niveau 2 : tres important',
        text: 'Cloud et stockage (Google Drive, Dropbox), reseaux sociaux professionnels, outils de comptabilite, CRM client.'
      },
      {
        subtitle: 'Comment les proteger',
        text: 'Pour chaque compte : mot de passe unique et complexe + double authentification (2FA). Commencez par le niveau 1, puis passez au niveau 2.'
      },
    ],
  },
];
