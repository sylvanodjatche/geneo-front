// src/components/ResultsPanel.jsx
function ResultsPanel({ results }) {
  const { go_terms } = results;

  if (!go_terms || go_terms.length === 0) {
    return (
      <div className="mt-8 bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">📊 Résultats de prédiction</h2>
        <p className="text-gray-500 dark:text-gray-400 italic">Aucun terme ne dépasse le seuil.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">📊 Résultats de prédiction</h2>
      <ul className="space-y-2">
        {go_terms.map((term) => (
          <li key={term.id} className="flex flex-wrap justify-between items-center border-b border-gray-100 dark:border-gray-700 py-2">
            <div>
              <span className="font-mono text-gray-800 dark:text-gray-200">{term.id}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${term.score * 100}%` }}></div>
              </div>
              <span className="text-sm font-mono text-blue-700 dark:text-blue-300">{(term.score * 100).toFixed(0)}%</span>
              <a
                href={`https://www.ebi.ac.uk/QuickGO/term/${term.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 dark:text-blue-400 text-sm"
              >
                🔗 QuickGO
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ResultsPanel;