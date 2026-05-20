import { useState } from 'react';
import SequenceInput from '../components/SequenceInput';
import ResultsPanel from '../components/ResultsPanel';
import ExportPanel from '../components/ExportPanel';
import { useLocalStorage } from '../hooks/useLocalStorage';

function Home() {
  const [results, setResults] = useState(null);
  const [allResults, setAllResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentMode, setCurrentMode] = useState('single');
  const [history, setHistory] = useLocalStorage('geneo_history', []);

  const saveToHistory = (sequence, threshold, resultsData, mode, id = null) => {
    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      sequence: sequence.substring(0, 200) + (sequence.length > 200 ? '...' : ''),
      fullSequence: sequence,
      threshold,
      results: resultsData,
      mode,
      proteinId: id || (mode === 'single' ? 'manuelle' : 'csv')
    };
    setHistory(prev => [newEntry, ...prev].slice(0, 50));
  };

  const handlePredict = async (sequence, threshold) => {
    setLoading(true);
    setError(null);
    setCurrentMode('single');
    try {
      const mockResults = {
        go_terms: [
          { id: "GO:0003674", name: "molecular_function", namespace: "MF", score: 0.92 },
          { id: "GO:0003824", name: "catalytic activity", namespace: "MF", score: 0.87 },
          { id: "GO:0008150", name: "biological_process", namespace: "BP", score: 0.65 }
        ]
      };
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResults(mockResults);
      setAllResults([]);
      saveToHistory(sequence, threshold, mockResults, 'single');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMultipleSequences = async (sequences, threshold) => {
    setLoading(true);
    setError(null);
    setCurrentMode('multi');
    try {
      const resultsArray = [];
      for (let i = 0; i < sequences.length; i++) {
        const seq = sequences[i];
        const mockResults = {
          go_terms: [
            { id: "GO:0003674", name: "molecular_function", namespace: "MF", score: Math.max(0, 0.92 - i * 0.05) },
            { id: "GO:0003824", name: "catalytic activity", namespace: "MF", score: Math.max(0, 0.87 - i * 0.05) },
            { id: "GO:0008150", name: "biological_process", namespace: "BP", score: Math.max(0, 0.65 - i * 0.05) }
          ]
        };
        await new Promise(resolve => setTimeout(resolve, 200));
        resultsArray.push({ id: seq.id, results: mockResults });
        saveToHistory(seq.sequence, threshold, mockResults, 'multi', seq.id);
      }
      setAllResults(resultsArray);
      if (resultsArray.length > 0) {
        setResults(resultsArray[0].results);
        setSelectedIndex(0);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResultChange = (index) => {
    setSelectedIndex(index);
    setResults(allResults[index].results);
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-center text-gray-800 my-6">
        🧬 GENEo - Prédiction de fonction protéique
      </h1>
      <SequenceInput onPredict={handlePredict} onMultipleSequences={handleMultipleSequences} />
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Analyse en cours...</p>
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg my-4">
          ❌ Erreur : {error}
        </div>
      )}
      {results && currentMode === 'multi' && allResults.length > 1 && (
        <div className="my-4 p-4 bg-gray-100 rounded-lg flex items-center gap-4">
          <label className="font-medium">Protéine :</label>
          <select
            value={selectedIndex}
            onChange={(e) => handleResultChange(parseInt(e.target.value))}
            className="border rounded p-2 bg-white"
          >
            {allResults.map((item, idx) => (
              <option key={idx} value={idx}>
                {item.id} (score moyen: {(item.results.go_terms.reduce((s,t)=>s+t.score,0)/item.results.go_terms.length).toFixed(2)})
              </option>
            ))}
          </select>
        </div>
      )}
      {results && (
        <>
          <ResultsPanel results={results} />
          <ExportPanel results={results} />
        </>
      )}
    </div>
  );
}

export default Home;