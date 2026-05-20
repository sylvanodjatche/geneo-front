function ExportPanel({ results }) {
  const exportToCSV = () => {
    const { go_terms } = results;
    const headers = ['GO ID', 'Nom', 'Namespace', 'Score'];
    const rows = go_terms.map(t => [t.id, t.name, t.namespace, t.score]);
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'geneo_predictions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'geneo_predictions.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-4 mt-6">
      <button
        onClick={exportToCSV}
        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition"
      >
        📄 Exporter CSV
      </button>
      <button
        onClick={exportToJSON}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
      >
        📦 Exporter JSON
      </button>
    </div>
  );
}

export default ExportPanel;