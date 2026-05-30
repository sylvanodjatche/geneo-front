// src/components/ExportPanel.jsx

export default function ExportPanel({ results }) {
  const { go_terms } = results;

  const exportCSV = () => {
    const headers = ['GO ID', 'Namespace', 'Score (%)'];
    const rows = go_terms.map(t => [t.id, t.namespace || '?', (t.score * 100).toFixed(2)]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    download(csv, 'geneo_predictions.csv', 'text/csv');
  };

  const exportJSON = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      totalTerms: go_terms.length,
      go_terms,
    };
    download(JSON.stringify(data, null, 2), 'geneo_predictions.json', 'application/json');
  };

  const download = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', gap: 10, marginTop: 16, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
      <button className="btn-ghost" onClick={exportCSV} style={{ fontSize: '0.82rem' }}>
        ⬇ Exporter CSV
      </button>
      <button className="btn-ghost" onClick={exportJSON} style={{ fontSize: '0.82rem' }}>
        ⬇ Exporter JSON
      </button>
    </div>
  );
}
