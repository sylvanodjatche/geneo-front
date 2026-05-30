// src/components/ResultsPanel.jsx

import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, CartesianGrid,
} from 'recharts';

const NS_COLORS = {
  MF: '#a855f7',
  BP: '#10b981',
  CC: '#6366f1',
  '?': '#64748b',
};

const NS_LABELS = {
  MF: 'Fonction Moléculaire',
  BP: 'Processus Biologique',
  CC: 'Composante Cellulaire',
  '?': 'Non classifié',
};

function NsBadge({ ns }) {
  const cls = NS_COLORS[ns] ? `ns-${ns}` : 'ns-unknown';
  return <span className={`ns-badge ${cls}`}>{ns === '?' ? 'N/A' : ns}</span>;
}

function ScoreBar({ score, ns }) {
  const color = NS_COLORS[ns] || '#64748b';
  return (
    <div className="score-bar" style={{ width: 120, flexShrink: 0 }}>
      <div
        className="score-bar-fill"
        style={{
          width: `${score * 100}%`,
          background: `linear-gradient(90deg, ${color}99, ${color})`,
        }}
      />
    </div>
  );
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border)',
      borderRadius: 10, padding: '10px 14px',
      fontFamily: 'Space Mono', fontSize: '0.75rem',
    }}>
      <div style={{ color: 'var(--text-primary)', marginBottom: 4 }}>{d.fullId}</div>
      <div style={{ color: NS_COLORS[d.namespace] || '#64748b' }}>
        {NS_LABELS[d.namespace] || 'Non classifié'}
      </div>
      <div style={{ color: 'var(--text-accent)', marginTop: 4, fontSize: '1rem', fontWeight: 700 }}>
        {(d.score * 100).toFixed(1)}%
      </div>
    </div>
  );
};

export default function ResultsPanel({ results }) {
  const { go_terms } = results;
  const [view, setView] = useState('list');
  const [nsFilter, setNsFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('score');

  if (!go_terms || go_terms.length === 0) {
    return (
      <div className="glass animate-fade-up" style={{ padding: 32, textAlign: 'center', marginTop: 24 }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔬</div>
        <p style={{ fontFamily: 'Syne', fontWeight: 600, color: 'var(--text-secondary)' }}>
          Aucun terme GO ne dépasse le seuil sélectionné.
        </p>
        <p style={{ fontFamily: 'Inter', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 8 }}>
          Essayez de réduire le seuil de confiance.
        </p>
      </div>
    );
  }

  // Stats summary
  const nsCounts = useMemo(() => {
    const counts = { MF: 0, BP: 0, CC: 0, '?': 0 };
    go_terms.forEach(t => {
      const ns = t.namespace || '?';
      counts[ns] = (counts[ns] || 0) + 1;
    });
    return counts;
  }, [go_terms]);

  const avgScore = (go_terms.reduce((s, t) => s + t.score, 0) / go_terms.length);
  const topScore = Math.max(...go_terms.map(t => t.score));

  // Filtered + sorted terms
  const displayed = useMemo(() => {
    let arr = go_terms;
    if (nsFilter !== 'ALL') arr = arr.filter(t => (t.namespace || '?') === nsFilter);
    if (sortBy === 'score') arr = [...arr].sort((a, b) => b.score - a.score);
    else arr = [...arr].sort((a, b) => a.id.localeCompare(b.id));
    return arr;
  }, [go_terms, nsFilter, sortBy]);

  // Chart data (top 20)
  const chartData = useMemo(() =>
    [...go_terms]
      .sort((a, b) => b.score - a.score)
      .slice(0, 20)
      .map(t => ({
        name: t.id,
        fullId: t.id,
        score: t.score,
        namespace: t.namespace || '?',
      })),
    [go_terms]
  );

  return (
    <div className="glass animate-fade-up" style={{ padding: 32, marginTop: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div className="section-label" style={{ marginBottom: 4 }}>Résultats de prédiction</div>
          <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.3rem', margin: 0 }}>
            {go_terms.length} termes GO détectés
          </h2>
        </div>
        {/* View toggle */}
        <div style={{ display: 'flex', gap: 4, background: 'var(--bg-deep)', padding: 4, borderRadius: 10, border: '1px solid var(--border)' }}>
          {[
            { id: 'list', label: '≡ Liste' },
            { id: 'chart', label: '▦ Graphique' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className={view === id ? 'tab-active' : ''}
              style={{
                padding: '7px 16px', borderRadius: 7, border: '1px solid transparent',
                background: 'transparent', cursor: 'pointer',
                fontFamily: 'Syne', fontWeight: 600, fontSize: '0.82rem',
                color: view === id ? 'var(--text-primary)' : 'var(--text-muted)',
                transition: 'all 0.2s',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Score max', value: `${(topScore * 100).toFixed(1)}%`, color: '#10b981' },
          { label: 'Score moyen', value: `${(avgScore * 100).toFixed(1)}%`, color: '#a855f7' },
          { label: 'Fonc. Mol.', value: nsCounts['MF'] || 0, color: NS_COLORS.MF },
          { label: 'Proc. Bio.', value: nsCounts['BP'] || 0, color: NS_COLORS.BP },
          { label: 'Comp. Cell.', value: nsCounts['CC'] || 0, color: NS_COLORS.CC },
        ].map(({ label, value, color }) => (
          <div key={label} style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: 10, padding: '12px 14px',
          }}>
            <div style={{ fontFamily: 'Space Mono', fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
              {label}
            </div>
            <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.4rem', color, lineHeight: 1 }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Filters (list view only) */}
      {view === 'list' && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <span className="section-label" style={{ marginRight: 4 }}>Filtrer</span>
          {['ALL', 'BP', 'MF', 'CC'].map(ns => (
            <button
              key={ns}
              onClick={() => setNsFilter(ns)}
              style={{
                padding: '4px 14px', borderRadius: 20,
                border: `1px solid ${nsFilter === ns ? NS_COLORS[ns] || 'var(--border-glow)' : 'var(--border)'}`,
                background: nsFilter === ns ? `${NS_COLORS[ns] || 'var(--accent-1)'}18` : 'transparent',
                color: nsFilter === ns ? NS_COLORS[ns] || 'var(--text-accent)' : 'var(--text-muted)',
                fontFamily: 'Space Mono', fontSize: '0.72rem',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              {ns === 'ALL' ? `Tous (${go_terms.length})` : `${ns} (${nsCounts[ns] || 0})`}
            </button>
          ))}
          <div style={{ marginLeft: 'auto' }}>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{
                background: 'var(--bg-deep)', border: '1px solid var(--border)',
                color: 'var(--text-secondary)', padding: '4px 10px',
                borderRadius: 8, fontFamily: 'Space Mono', fontSize: '0.72rem',
                cursor: 'pointer', outline: 'none',
              }}
            >
              <option value="score">Trier : Score ↓</option>
              <option value="id">Trier : ID ↑</option>
            </select>
          </div>
        </div>
      )}

      {/* List view */}
      {view === 'list' && (
        <div className="results-list">
          {displayed.map((term, i) => (
            <div
              key={term.id}
              className="glass-hover"
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '12px 14px', borderRadius: 8, marginBottom: 6,
                border: '1px solid var(--border)',
                background: 'var(--bg-surface)',
                animation: `fadeUp 0.3s ease forwards`,
                animationDelay: `${Math.min(i * 0.03, 0.5)}s`,
                opacity: 0,
              }}
            >
              {/* Rank */}
              <span style={{
                fontFamily: 'Space Mono', fontSize: '0.65rem',
                color: 'var(--text-muted)', width: 24, flexShrink: 0,
              }}>
                {(i + 1).toString().padStart(2, '0')}
              </span>

              {/* NS badge */}
              <NsBadge ns={term.namespace || '?'} />

              {/* GO ID */}
              <a
                href={`https://www.ebi.ac.uk/QuickGO/term/${term.id}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: 'Space Mono', fontSize: '0.8rem',
                  color: 'var(--text-accent)', flex: 1,
                  textDecoration: 'none', minWidth: 0,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}
                title={`Ouvrir ${term.id} dans QuickGO`}
              >
                {term.id}
                <span style={{ fontSize: '0.65rem', marginLeft: 4, opacity: 0.5 }}>↗</span>
              </a>

              {/* Score bar + value */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <ScoreBar score={term.score} ns={term.namespace || '?'} />
                <span style={{
                  fontFamily: 'Space Mono', fontWeight: 700,
                  fontSize: '0.82rem',
                  color: NS_COLORS[term.namespace] || '#64748b',
                  width: 44, textAlign: 'right',
                }}>
                  {(term.score * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chart view */}
      {view === 'chart' && (
        <div style={{ height: 500 }}>
          <p style={{ fontFamily: 'Space Mono', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 12 }}>
            Top 20 termes GO par score de confiance
          </p>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={chartData} margin={{ left: 10, right: 30, top: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,130,255,0.06)" horizontal={false} />
              <XAxis
                type="number" domain={[0, 1]}
                tickFormatter={v => `${(v * 100).toFixed(0)}%`}
                tick={{ fontFamily: 'Space Mono', fontSize: 10, fill: '#64748b' }}
                axisLine={{ stroke: 'var(--border)' }}
                tickLine={false}
              />
              <YAxis
                type="category" dataKey="name" width={100}
                tick={{ fontFamily: 'Space Mono', fontSize: 10, fill: '#94a3b8' }}
                axisLine={false} tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,130,255,0.05)' }} />
              <Bar dataKey="score" radius={[0, 4, 4, 0]} maxBarSize={22}>
                {chartData.map((entry, idx) => (
                  <Cell key={idx} fill={NS_COLORS[entry.namespace] || '#64748b'} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
