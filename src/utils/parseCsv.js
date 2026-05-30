// src/utils/parseCsv.js

import Papa from 'papaparse';

/**
 * Parse a CSV File and return array of { id, sequence }
 */
export function parseCsvFile(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const { data } = results;
        if (!data || data.length === 0) {
          reject(new Error('Fichier CSV vide.'));
          return;
        }
        // Accept columns: sequence / Sequence / SEQUENCE + optional id/ID
        const seqKey = Object.keys(data[0]).find(k => k.toLowerCase() === 'sequence');
        const idKey  = Object.keys(data[0]).find(k => k.toLowerCase() === 'id' || k.toLowerCase() === 'protein_id');

        if (!seqKey) {
          reject(new Error("Colonne 'sequence' introuvable dans le CSV."));
          return;
        }

        const sequences = data
          .map((row, i) => ({
            id: idKey ? row[idKey] : `protein_${i + 1}`,
            sequence: (row[seqKey] || '').trim().toUpperCase().replace(/[^A-Z]/g, ''),
          }))
          .filter(s => s.sequence.length > 0);

        resolve(sequences);
      },
      error: (err) => reject(new Error(err.message)),
    });
  });
}
