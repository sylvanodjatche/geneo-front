import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function ResultsPanel({ results }) {
  const { go_terms } = results;
  const [view, setView] = useState('list'); // 'list' ou 'chart'

  const grouped = {
    MF: go_terms.filter(t => t.namespace === 'MF'),
    BP: go_terms.filter(t => t.namespace === 'BP'),
    CC: go_terms.filter(t => t.namespace === 'CC')
  };

  const namespaceTitles = {
    MF: { title: '🔬 Fonction moléculaire', color: 'text-purple-700' },
    BP: { title: '⚙️ Processus biologique', color: 'text-green-700' },
    CC: { title: '🏠 Composant cellulaire', color: 'text-indigo-700' }
  };

  // Préparer les données pour le graphique (tous les termes)
  const chartData = go_terms.map(term => ({
    name: term.name.length > 20 ? term.name.slice(0,17)+'...' : term.name,
    score: term.score,
    id: term.id,
    namespace: term.namespace
  }));

  const colorMap = { MF: '#8b5cf6', BP: '#10b981', CC: '#6366f1' };

  return (
    <div className="mt-8 bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">📊 Résultats de prédiction</h2>
        <div className="flex gap-2">
          <button onClick={() => setView('list')} className={`px-3 py-1 rounded ${view === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Liste</button>
          <button onClick={() => setView('chart')} className={`px-3 py-1 rounded ${view === 'chart' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Graphique</button>
        </div>
      </div>

      {view === 'list' ? (
        // Affichage en liste (inchangé)
        Object.entries(grouped).map(([ns, terms]) => (
          <div key={ns} className="mb-8">
            <h3 className={`text-xl font-semibold ${namespaceTitles[ns].color} border-b pb-2 mb-3 dark:text-white`}>
              {namespaceTitles[ns].title}
            </h3>
            {terms.length === 0 ? (
              <p className="text-gray-500 italic">Aucun terme prédit pour cette catégorie.</p>
            ) : (
              <ul className="space-y-2">
                {terms.map(term => (
                  <li key={term.id} className="flex flex-wrap justify-between items-center border-b border-gray-100 dark:border-gray-700 py-2">
                    <div>
                      <span className="font-medium text-gray-800 dark:text-gray-200">{term.name}</span>
                      <span className="text-gray-500 text-sm ml-2">({term.id})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${term.score * 100}%` }}></div>
                      </div>
                      <span className="text-sm font-mono text-blue-700 dark:text-blue-300">{(term.score*100).toFixed(0)}%</span>
                      <a href={`https://www.ebi.ac.uk/QuickGO/term/${term.id}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 text-sm">🔗 QuickGO</a>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))
      ) : (
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={chartData} margin={{ left: 80, right: 20 }}>
              <XAxis type="number" domain={[0,1]} tickFormatter={(val) => `${(val*100).toFixed(0)}%`} />
              <YAxis type="category" dataKey="name" width={150} />
              <Tooltip formatter={(value) => `${(value*100).toFixed(0)}%`} />
              <Bar dataKey="score">
                {chartData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={colorMap[entry.namespace] || '#3b82f6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default ResultsPanel;