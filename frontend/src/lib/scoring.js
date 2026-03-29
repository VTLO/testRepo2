import { QUESTIONS } from './diagnosticQuestions';

const CATEGORIES = {
  account_security: { name: 'Securite des comptes', maxScore: 30, weight: 1.2 },
  device_security: { name: 'Securite des appareils', maxScore: 30, weight: 1.0 },
  backup: { name: 'Sauvegardes', maxScore: 15, weight: 1.1 },
  email_phishing: { name: 'Email et Phishing', maxScore: 20, weight: 1.1 },
  network: { name: 'Reseau et Wi-Fi', maxScore: 20, weight: 0.9 },
  data_protection: { name: 'Protection des donnees', maxScore: 10, weight: 1.0 },
  business_continuity: { name: 'Continuite d\'activite', maxScore: 15, weight: 0.8 },
};

export function calculateScores(answers) {
  const categoryScores = {};
  
  Object.keys(CATEGORIES).forEach(cat => {
    categoryScores[cat] = { raw: 0, max: 0, percentage: 0 };
  });

  QUESTIONS.forEach(q => {
    if (!q.category) return;
    const answer = answers[q.id];
    if (!answer) return;

    const cat = q.category;
    if (!categoryScores[cat]) return;

    if (q.type === 'single') {
      const option = q.options.find(o => o.value === answer);
      if (option && option.score !== undefined) {
        categoryScores[cat].raw += option.score;
        const maxOption = q.options.reduce((max, o) => (o.score || 0) > (max.score || 0) ? o : max, q.options[0]);
        categoryScores[cat].max += maxOption.score || 0;
      }
    } else if (q.type === 'multi' && Array.isArray(answer)) {
      // Multi-choice: more tools = more need for security
      categoryScores[cat].raw += Math.min(answer.length * 2, 10);
      categoryScores[cat].max += 10;
    }
  });

  // Calculate percentages
  Object.keys(categoryScores).forEach(cat => {
    const { raw, max } = categoryScores[cat];
    categoryScores[cat].percentage = max > 0 ? Math.round((raw / max) * 100) : 50;
  });

  // Overall weighted score
  let totalWeighted = 0;
  let totalWeight = 0;
  Object.entries(categoryScores).forEach(([cat, data]) => {
    const weight = CATEGORIES[cat]?.weight || 1;
    totalWeighted += data.percentage * weight;
    totalWeight += weight;
  });
  const overall = Math.round(totalWeighted / totalWeight);

  // Severity
  let severity;
  if (overall >= 75) severity = 'low';
  else if (overall >= 50) severity = 'moderate';
  else if (overall >= 25) severity = 'high';
  else severity = 'critical';

  // Weak categories
  const weakCategories = Object.entries(categoryScores)
    .filter(([, data]) => data.percentage < 50)
    .sort((a, b) => a[1].percentage - b[1].percentage)
    .map(([cat]) => cat);

  return {
    overall,
    severity,
    categories: Object.entries(categoryScores).map(([key, data]) => ({
      key,
      name: CATEGORIES[key]?.name || key,
      score: data.percentage,
      raw: data.raw,
      max: data.max,
    })),
    weakCategories,
    timestamp: new Date().toISOString(),
  };
}

export function getSeverityLabel(severity) {
  const labels = { low: 'Faible', moderate: 'Modere', high: 'Eleve', critical: 'Critique' };
  return labels[severity] || severity;
}

export function getSeverityColor(severity) {
  const colors = {
    low: { text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', fill: '#10B981' },
    moderate: { text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', fill: '#F59E0B' },
    high: { text: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', fill: '#F97316' },
    critical: { text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', fill: '#EF4444' },
  };
  return colors[severity] || colors.moderate;
}

export function getCategoryIcon(key) {
  const icons = {
    account_security: 'KeyRound',
    device_security: 'Laptop',
    backup: 'HardDrive',
    email_phishing: 'Mail',
    network: 'Wifi',
    data_protection: 'ShieldCheck',
    business_continuity: 'LifeBuoy',
  };
  return icons[key] || 'Shield';
}
