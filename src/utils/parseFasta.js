// src/utils/parseFasta.js

/**
 * Parse FASTA content and return array of { id, sequence }
 */
export function parseFasta(content) {
  if (!content || typeof content !== 'string') return [];

  const lines = content.split('\n');
  const results = [];
  let current = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('>')) {
      if (current) results.push(current);
      current = {
        id: trimmed.slice(1).split(/\s+/)[0] || 'unknown',
        sequence: '',
      };
    } else if (current) {
      current.sequence += trimmed.toUpperCase().replace(/[^A-Z]/g, '');
    } else {
      // No header — treat whole content as one sequence
      results.push({ id: 'sequence_1', sequence: trimmed.toUpperCase().replace(/[^A-Z]/g, '') });
      break;
    }
  }
  if (current && current.sequence) results.push(current);

  // If no FASTA header, treat as raw sequence
  if (results.length === 0 && content.trim()) {
    const seq = content.trim().toUpperCase().replace(/[^A-Z\s]/g, '').replace(/\s/g, '');
    if (seq) results.push({ id: 'sequence_1', sequence: seq });
  }

  return results;
}
