const STORAGE_PREFIX = 'cybercopilote_';

const KEYS = {
  DIAGNOSTIC: `${STORAGE_PREFIX}diagnostic`,
  SCORES: `${STORAGE_PREFIX}scores`,
  ACTION_PLAN: `${STORAGE_PREFIX}action_plan`,
  REMINDERS: `${STORAGE_PREFIX}reminders`,
  CHAT_HISTORY: `${STORAGE_PREFIX}chat_history`,
  CHAT_SESSION: `${STORAGE_PREFIX}chat_session`,
  ONBOARDING_DONE: `${STORAGE_PREFIX}onboarding_done`,
  LAST_REVIEW: `${STORAGE_PREFIX}last_review`,
};

function getItem(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function removeItem(key) {
  localStorage.removeItem(key);
}

// Diagnostic
export function getDiagnosticAnswers() {
  return getItem(KEYS.DIAGNOSTIC) || {};
}
export function saveDiagnosticAnswers(answers) {
  setItem(KEYS.DIAGNOSTIC, answers);
}

// Scores
export function getScores() {
  return getItem(KEYS.SCORES);
}
export function saveScores(scores) {
  setItem(KEYS.SCORES, scores);
}

// Action plan
export function getActionPlan() {
  return getItem(KEYS.ACTION_PLAN) || [];
}
export function saveActionPlan(plan) {
  setItem(KEYS.ACTION_PLAN, plan);
}

// Reminders
export function getReminders() {
  return getItem(KEYS.REMINDERS) || { notifications: false, monthlyReview: true, backupReminder: true, updateReminder: true, mfaReminder: true };
}
export function saveReminders(reminders) {
  setItem(KEYS.REMINDERS, reminders);
}

// Chat
export function getChatHistory() {
  return getItem(KEYS.CHAT_HISTORY) || [];
}
export function saveChatHistory(history) {
  setItem(KEYS.CHAT_HISTORY, history);
}
export function getChatSession() {
  return getItem(KEYS.CHAT_SESSION);
}
export function saveChatSession(sessionId) {
  setItem(KEYS.CHAT_SESSION, sessionId);
}

// Onboarding
export function isOnboardingDone() {
  return getItem(KEYS.ONBOARDING_DONE) === true;
}
export function setOnboardingDone() {
  setItem(KEYS.ONBOARDING_DONE, true);
}

// Last review date
export function getLastReview() {
  return getItem(KEYS.LAST_REVIEW);
}
export function setLastReview(date) {
  setItem(KEYS.LAST_REVIEW, date);
}

// Export ALL data
export function exportAllData() {
  const data = {};
  Object.entries(KEYS).forEach(([name, key]) => {
    data[name] = getItem(key);
  });
  data._exportDate = new Date().toISOString();
  data._version = '1.0';
  return data;
}

// Import ALL data
export function importAllData(data) {
  if (!data || !data._version) throw new Error('Format invalide');
  Object.entries(KEYS).forEach(([name, key]) => {
    if (data[name] !== undefined && data[name] !== null) {
      setItem(key, data[name]);
    }
  });
}

// Reset
export function resetAllData() {
  Object.values(KEYS).forEach(removeItem);
}
