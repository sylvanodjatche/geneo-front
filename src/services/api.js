// src/services/api.js
// Connexion au backend réel (Hugging Face Space)
const API_BASE_URL = 'https://sylvanod-geneo-inference.hf.space';

export async function predict(sequence, threshold) {
  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sequence, threshold })
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API error:', error);
    throw new Error('Erreur de connexion au serveur de prédiction');
  }
}