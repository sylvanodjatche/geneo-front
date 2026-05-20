import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

function History() {
  const [history, setHistory] = useLocalStorage('geneo_history', []);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const deleteEntry = (id) => setHistory(prev => prev.filter(e => e.id !== id));
  const clearAll = () => { if (confirm('Supprimer tout ?')) setHistory([]); };

  // Filtrage
  const filtered = history.filter(entry =>
    entry.sequence.toLowerCase().includes(search.toLowerCase()) ||
    entry.proteinId.toLowerCase().includes(search.toLowerCase()) ||
    new Date(entry.timestamp).toLocaleString().includes(search)
  );

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage-1)*itemsPerPage, currentPage*itemsPerPage);

  if (history.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-2xl p-6 text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">📜 Historique</h1>
        <p className="text-gray-500 dark:text-gray-400">Aucune prédiction enregistrée.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-2xl p-6">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">📜 Historique</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="🔍 Rechercher..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="border rounded p-2 dark:bg-gray-700 dark:text-white"
          />
          <button onClick={clearAll} className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm">
            Tout supprimer
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {paginated.map(entry => (
          <div key={entry.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {new Date(entry.timestamp).toLocaleString()}
                </p>
                <p className="font-semibold dark:text-white">{entry.proteinId}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{entry.sequence}</p>
                <p className="text-sm">Seuil : {entry.threshold}</p>
                <div className="mt-1">
                  <span className="text-xs font-semibold dark:text-gray-200">Résultats :</span>
                  <ul className="text-xs text-gray-600 dark:text-gray-300">
                    {entry.results.go_terms.slice(0,3).map(term => (
                      <li key={term.id}>{term.name} ({(term.score*100).toFixed(0)}%)</li>
                    ))}
                    {entry.results.go_terms.length > 3 && <li>...</li>}
                  </ul>
                </div>
              </div>
              <button onClick={() => deleteEntry(entry.id)} className="text-red-500 hover:text-red-700 text-sm">
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p-1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Précédent
          </button>
          <span className="px-3 py-1">Page {currentPage} / {totalPages}</span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}

export default History;