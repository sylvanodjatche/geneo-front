import Papa from 'papaparse';

export const parseCsvFile = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,       // la première ligne contient les noms de colonnes
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data;
        // On suppose que les colonnes s'appellent "id" (ou "protein_id") et "sequence"
        // Si pas d'en-tête, on prend la première colonne comme séquence et on génère un id
        if (data.length === 0) {
          reject(new Error("Le fichier est vide"));
          return;
        }
        // Détection automatique des colonnes
        const firstRow = data[0];
        let idKey = null;
        let seqKey = null;
        if (firstRow.hasOwnProperty('id')) idKey = 'id';
        else if (firstRow.hasOwnProperty('protein_id')) idKey = 'protein_id';
        if (firstRow.hasOwnProperty('sequence')) seqKey = 'sequence';
        else if (firstRow.hasOwnProperty('seq')) seqKey = 'seq';

        if (!seqKey) {
          // Si pas de colonne identifiée, on prend la première colonne comme séquence
          const firstCol = Object.keys(firstRow)[0];
          seqKey = firstCol;
          idKey = null; // on générera des ids automatiquement
        }

        const sequences = data.map((row, idx) => ({
          id: idKey ? row[idKey] : `prot_${idx+1}`,
          sequence: row[seqKey].replace(/\s/g, '').toUpperCase()
        })).filter(item => item.sequence.length > 0);
        resolve(sequences);
      },
      error: (error) => reject(error)
    });
  });
};