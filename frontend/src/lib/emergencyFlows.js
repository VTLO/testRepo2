export const EMERGENCY_FLOWS = [
  {
    id: 'suspicious_link',
    title: 'J\'ai clique sur un lien suspect',
    icon: 'MousePointerClick',
    severity: 'high',
    steps: {
      immediate: [
        'Ne saisissez AUCUNE information sur la page ouverte',
        'Fermez immediatement l\'onglet ou le navigateur',
        'Deconnectez-vous du Wi-Fi si vous avez saisi des informations',
      ],
      doNot: [
        'Ne retournez pas sur le lien pour "verifier"',
        'Ne transferez pas le message a d\'autres personnes',
      ],
      passwords: [
        'Si vous avez entre un mot de passe : changez-le immediatement',
        'Changez aussi ce mot de passe sur tous les sites ou vous l\'utilisez',
        'Activez la double authentification (2FA)',
      ],
      notify: [
        'Signalez le message a votre fournisseur email (bouton "spam" ou "phishing")',
        'Signalez sur signal-spam.fr ou phishing-initiative.fr',
      ],
      proof: [
        'Faites une capture d\'ecran du message ou email original',
        'Notez la date et l\'heure de l\'incident',
      ],
      timeline: {
        firstHour: 'Changez les mots de passe, lancez un scan antivirus',
        first24h: 'Surveillez vos comptes bancaires et emails pour toute activite suspecte',
      },
    },
  },
  {
    id: 'password_shared',
    title: 'J\'ai partage mon mot de passe par erreur',
    icon: 'KeyRound',
    severity: 'critical',
    steps: {
      immediate: [
        'Changez ce mot de passe IMMEDIATEMENT',
        'Changez-le sur TOUS les sites ou vous l\'utilisez',
        'Activez la double authentification (2FA) sur le compte concerne',
      ],
      doNot: [
        'Ne gardez pas l\'ancien mot de passe "en attendant"',
        'Ne reutilisez jamais ce mot de passe compromis',
      ],
      passwords: [
        'Utilisez un gestionnaire de mots de passe pour creer un nouveau mot de passe unique',
        'Le nouveau mot de passe doit faire au moins 12 caracteres',
      ],
      notify: [
        'Si c\'est un compte bancaire : contactez votre banque immediatement',
        'Si c\'est un compte pro : prevenez votre equipe ou vos clients si necessaire',
      ],
      proof: [
        'Notez a qui et comment le mot de passe a ete partage',
        'Gardez les preuves (email, SMS, capture d\'ecran)',
      ],
      timeline: {
        firstHour: 'Changez tous les mots de passe identiques, activez le 2FA partout',
        first24h: 'Verifiez les connexions recentes sur vos comptes importants',
      },
    },
  },
  {
    id: 'email_compromised',
    title: 'Mon email semble compromis',
    icon: 'Mail',
    severity: 'critical',
    steps: {
      immediate: [
        'Changez le mot de passe de votre email immediatement',
        'Activez la double authentification (2FA)',
        'Verifiez les regles de transfert (des pirates ajoutent des transferts automatiques)',
      ],
      doNot: [
        'Ne supprimez pas les emails suspects envoyes depuis votre compte (preuves)',
        'Ne continuez pas a utiliser le compte sans avoir change le mot de passe',
      ],
      passwords: [
        'Changez les mots de passe de tous les services lies a cet email',
        'Commencez par les comptes bancaires et les comptes de paiement',
      ],
      notify: [
        'Prevenez vos contacts que des emails frauduleux ont pu etre envoyes en votre nom',
        'Contactez votre fournisseur email si vous ne pouvez plus acceder au compte',
      ],
      proof: [
        'Verifiez l\'historique de connexion (Google : myaccount.google.com/security)',
        'Notez les connexions suspectes (lieu, horaire, appareil)',
      ],
      timeline: {
        firstHour: 'Securisez le compte email, changez les mots de passe critiques',
        first24h: 'Verifiez tous les comptes lies, prevenez vos contacts',
      },
    },
  },
  {
    id: 'social_hacked',
    title: 'Mon compte professionnel (Facebook, Instagram, WhatsApp) est pirate',
    icon: 'UserX',
    severity: 'high',
    steps: {
      immediate: [
        'Essayez de vous reconnecter et changez le mot de passe',
        'Si impossible : utilisez la procedure de recuperation de compte de la plateforme',
        'Deconnectez toutes les sessions actives depuis les parametres de securite',
      ],
      doNot: [
        'Ne payez jamais de "rancon" pour recuperer votre compte',
        'Ne cliquez pas sur des liens envoyes par le pirate pretendant etre le support',
      ],
      passwords: [
        'Changez le mot de passe du compte pirate ET de l\'email associe',
        'Activez le 2FA sur les deux comptes',
      ],
      notify: [
        'Signalez le piratage a la plateforme via leur formulaire officiel',
        'Prevenez vos clients et abonnes via un autre canal',
        'Deposez plainte sur cybermalveillance.gouv.fr',
      ],
      proof: [
        'Faites des captures d\'ecran de l\'activite suspecte',
        'Conservez les preuves pour une eventuelle plainte',
      ],
      timeline: {
        firstHour: 'Tentez la recuperation, securisez l\'email associe',
        first24h: 'Signalez a la plateforme, prevenez vos contacts, deposez plainte si necessaire',
      },
    },
  },
  {
    id: 'device_lost',
    title: 'Mon telephone ou ordinateur a ete vole ou perdu',
    icon: 'Smartphone',
    severity: 'critical',
    steps: {
      immediate: [
        'Localisez l\'appareil : iCloud (Apple), findmydevice.google.com (Android/Google)',
        'Verrouillez l\'appareil a distance',
        'Si l\'appareil contient des donnees sensibles : effacez-le a distance',
      ],
      doNot: [
        'Ne tentez pas de recuperer l\'appareil seul(e) si vous pensez qu\'il a ete vole',
        'N\'attendez pas pour agir en esperant le retrouver',
      ],
      passwords: [
        'Changez les mots de passe de tous les comptes connectes sur l\'appareil',
        'Priorite : email, banque, reseaux sociaux, cloud',
        'Deconnectez l\'appareil de vos comptes a distance',
      ],
      notify: [
        'Deposez plainte au commissariat ou a la gendarmerie',
        'Notez le numero IMEI de l\'appareil (sur la boite ou facture)',
        'Contactez votre operateur pour bloquer la carte SIM',
        'Prevenez votre assurance si applicable',
      ],
      proof: [
        'Gardez la preuve de depot de plainte',
        'Notez la date, le lieu et les circonstances',
      ],
      timeline: {
        firstHour: 'Localisez, verrouillez, changez les mots de passe critiques',
        first24h: 'Deposez plainte, bloquez la SIM, effacez si necessaire, verifiez les comptes',
      },
    },
  },
  {
    id: 'ransomware',
    title: 'Je suspecte un ransomware',
    icon: 'Lock',
    severity: 'critical',
    steps: {
      immediate: [
        'DECONNECTEZ immediatement l\'appareil d\'Internet (Wi-Fi et cable)',
        'Ne redemarrez PAS l\'ordinateur',
        'Deconnectez tous les disques externes et cles USB',
      ],
      doNot: [
        'NE PAYEZ PAS la rancon - il n\'y a aucune garantie de recuperation',
        'Ne supprimez pas les fichiers chiffres (ils pourront peut-etre etre decryptes)',
        'Ne branchez pas de cle USB sur l\'ordinateur infecte',
      ],
      passwords: [
        'Depuis un AUTRE appareil sain, changez tous vos mots de passe importants',
        'Commencez par l\'email, la banque, et les services cloud',
      ],
      notify: [
        'Contactez cybermalveillance.gouv.fr pour de l\'aide gratuite',
        'Deposez plainte aupres des autorites',
        'Verifiez sur nomoreransom.org si un outil de decryptage existe',
      ],
      proof: [
        'Photographiez le message de rancon',
        'Notez l\'extension des fichiers chiffres',
        'Conservez l\'appareil en l\'etat pour analyse',
      ],
      timeline: {
        firstHour: 'Isolez l\'appareil, ne touchez a rien, changez les mots de passe depuis un autre appareil',
        first24h: 'Signalez sur cybermalveillance.gouv.fr, verifiez les sauvegardes, deposez plainte',
      },
    },
  },
  {
    id: 'fraudulent_invoice',
    title: 'J\'ai recu ou paye une facture frauduleuse',
    icon: 'FileWarning',
    severity: 'high',
    steps: {
      immediate: [
        'Si le paiement vient d\'etre fait : contactez votre banque IMMEDIATEMENT pour tenter un rappel de fonds',
        'Verifiez l\'identite reelle du fournisseur par un autre canal (telephone)',
      ],
      doNot: [
        'Ne payez pas une deuxieme fois si on vous le demande',
        'Ne repondez pas aux relances du fraudeur',
      ],
      passwords: [
        'Si vous avez clique sur un lien dans la facture : changez vos mots de passe',
        'Verifiez que votre compte email n\'a pas ete pirate (fausses factures envoyees en votre nom)',
      ],
      notify: [
        'Contactez votre banque pour signaler la fraude',
        'Deposez plainte au commissariat ou en ligne sur pre-plainte-en-ligne.gouv.fr',
        'Signalez sur internet-signalement.gouv.fr',
      ],
      proof: [
        'Conservez la facture frauduleuse',
        'Gardez les preuves de paiement et de communication',
        'Notez les coordonnees bancaires du fraudeur',
      ],
      timeline: {
        firstHour: 'Contactez la banque pour bloquer/recuperer le virement',
        first24h: 'Deposez plainte, rassemblez les preuves, prevenez votre comptable',
      },
    },
  },
];
