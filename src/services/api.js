// src/services/api.js

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://sylvanod-geneo-inference.hf.space';

const TIMEOUT_MS = 60_000; // 60s — inference can be slow on HF free tier

/**
 * POST /predict with timeout + retry
 */
export async function predict(sequence, threshold, retries = 2) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const cleanSeq = sequence
    .split('\n')
    .filter(l => !l.startsWith('>'))
    .join('')
    .replace(/\s/g, '')
    .toUpperCase();

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sequence: cleanSeq, threshold }),
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(`Erreur serveur ${response.status}${text ? ' : ' + text.slice(0, 120) : ''}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      if (err.name === 'AbortError') {
        throw new Error('Délai d\'attente dépassé (60 s). Le serveur est peut-être en veille — réessayez dans quelques secondes.');
      }
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, 1200 * (attempt + 1)));
        continue;
      }
      throw new Error('Impossible de contacter le serveur de prédiction. Vérifiez votre connexion.');
    }
  }
}
