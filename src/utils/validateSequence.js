// src/utils/validateSequence.js

const AMINO_ACIDS = new Set('ACDEFGHIKLMNPQRSTVWYBZXOU'.split(''));

/**
 * Validate a protein sequence (FASTA or raw).
 * Returns null if valid, or an error string.
 */
export function validateSequence(input) {
  if (!input || !input.trim()) return null; // empty = no error shown

  const lines = input.trim().split('\n');
  const seqLines = lines.filter(l => !l.startsWith('>'));
  const cleaned = seqLines.join('').replace(/\s/g, '').toUpperCase();

  if (cleaned.length === 0) return null;
  if (cleaned.length < 5) return 'Séquence trop courte (minimum 5 acides aminés).';

  const invalid = [...cleaned].filter(c => !AMINO_ACIDS.has(c));
  if (invalid.length > 0) {
    const uniq = [...new Set(invalid)].slice(0, 5).join(', ');
    return `Caractère(s) invalide(s) détecté(s) : ${uniq}`;
  }

  return null;
}
