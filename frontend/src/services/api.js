const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
  ? '/api'
  : 'http://localhost:5000/api';

export async function analyzeText(text, mood = '') {
  const response = await fetch(`${API_BASE_URL}/analyze-text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, mood })
  });
  return response.json();
}

export async function submitMood(mood, text_input = '') {
  const response = await fetch(`${API_BASE_URL}/mood`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mood, text_input })
  });
  return response.json();
}

export async function getMoodHistory() {
  const response = await fetch(`${API_BASE_URL}/mood-history`);
  return response.json();
}

export async function submitJournalEntry(content) {
  const response = await fetch(`${API_BASE_URL}/journal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  });
  return response.json();
}

export async function getJournalEntries() {
  const response = await fetch(`${API_BASE_URL}/journal`);
  return response.json();
}

export async function deleteJournalEntry(id) {
  const response = await fetch(`${API_BASE_URL}/journal/${id}`, {
    method: 'DELETE'
  });
  return response.json();
}

export async function sendChatMessage(message) {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
  return response.json();
}

export async function checkCrisisRisk(text) {
  const response = await fetch(`${API_BASE_URL}/risk-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  return response.json();
}

export async function getModelMetrics() {
  const response = await fetch(`${API_BASE_URL}/model-metrics`);
  return response.json();
}

export async function getRecommendation() {
  const response = await fetch(`${API_BASE_URL}/recommendation`);
  return response.json();
}
