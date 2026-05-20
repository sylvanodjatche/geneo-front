
//src/components/SequenceInput.jsx

import { useState } from 'react';
import { parseCsvFile } from '../utils/parseCsv';

function SequenceInput({ onPredict, onMultipleSequences }) {
  const [sequence, setSequence] = useState('');
  const [threshold, setThreshold] = useState(0.5);
  const [multiSequences, setMultiSequences] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleSubmit = () => {
    if (multiSequences && multiSequences.length > 0) {
      onMultipleSequences(multiSequences, threshold);
    } else if (sequence.trim()) {
      onPredict(sequence, threshold);
    } else {
      alert('Veuillez entrer une séquence ou charger un fichier');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext === 'csv') {
      try {
        const seqs = await parseCsvFile(file);
        setMultiSequences(seqs);
        setSequence('');
        if (seqs.length) setSequence(seqs[0].sequence);
      } catch (err) {
        alert('Erreur CSV: ' + err.message);
      }
    } else {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSequence(ev.target.result);
        setMultiSequences(null);
      };
      reader.readAsText(file);
    }
  };

  const handleSelectChange = (idx) => {
    setSelectedIndex(idx);
    setSequence(multiSequences[idx].sequence);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 mb-8 transition-colors">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">📝 Entrée de la séquence</h2>
      <textarea
        rows="6"
        value={sequence}
        onChange={(e) => setSequence(e.target.value)}
        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
        placeholder="Collez votre séquence ou le contenu d'un fichier FASTA/CSV..."
      />
      <div className="my-4">
        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
            🔘 Seuil de confiance : <span className="font-bold text-blue-600 dark:text-blue-400">{threshold}</span>
        </label>
        <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={threshold}
            onChange={(e) => setThreshold(parseFloat(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-blue-500 to-gray-300"
            style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${threshold * 100}%, #d1d5db ${threshold * 100}%, #d1d5db 100%)`
            }}
        />
        </div>
      <div className="flex gap-4 items-center flex-wrap">
        <label className="cursor-pointer bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg transition">
          📂 Choisir un fichier
          <input type="file" accept=".fasta,.txt,.csv" onChange={handleFileUpload} className="hidden" />
        </label>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition shadow"
        >
          🚀 Prédire
        </button>
      </div>
      {multiSequences && multiSequences.length > 1 && (
        <div className="mt-4">
          <label className="block font-medium text-gray-700 dark:text-gray-300">Sélectionner une protéine :</label>
          <select
            value={selectedIndex}
            onChange={(e) => handleSelectChange(parseInt(e.target.value))}
            className="border rounded p-2 mt-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
          >
            {multiSequences.map((seq, idx) => (
              <option key={idx} value={idx}>
                {seq.id} (longueur: {seq.sequence.length})
              </option>
            ))}
          </select>
        </div>
      )}
      {sequence && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {sequence.length} caractères chargés.
        </p>
      )}
    </div>
  );
}

export default SequenceInput;