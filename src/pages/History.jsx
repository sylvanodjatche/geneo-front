// src/pages/History.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';

const NS_COLORS = { MF: '#a855f7', BP: '#10b981', CC: '#6366f1', '?': '#64748b' };

export default function History() {
  const [history, setHistory] = useLocalStorage('geneo_history', []);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(null);
  const PER_PAGE = 8;
  const navigate = useNavigate();

  const filtered = history.filter(e =>
    e.proteinId?.toLowerCase().includes(search.toLowerCase()) ||
    e.sequence?.toLowerCase().includes(search.toLowerCase()) ||
    new Date(e.timestamp).toLocaleString().includes(search)
  );

  const pages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const deleteEntry = (id) => setHistory(prev => prev.filter(e => e.id !== id));
  const clearAll = () => { if (window.confirm('Supprimer tout l\'historique ?')) setHistory([]); };

  const reloadInHome = (entry) => {
    // Store in sessionStorage for Home to pick up
    sessionStorage.setItem('geneo_reload', JSON.stringify(entry));
    navigate('/');
  };

  const formatDate = (ts) => {
    const d = new Date(ts);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
      + ' · ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  if (history.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>📭</div>
        <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.5rem', color: 'var(--text-primary)' }}>
          Historique vide
        </h2>
        <p style={{ color: 'var(--text-muted)', marginTop: 8, fontFamily: 'Inter', fontSize: '0.9rem' }}>
          Vos prédictions apparaîtront ici automatiquement.
        </p>
        <button className="btn-primary" onClick={() => navigate('/')} style={{ marginTop: 24 }}>
          ⚡ Faire une prédiction
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div className="section-label" style={{ marginBottom: 8 }}>Analyses passées</div>
        <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2rem', margin: 0 }}>
          Historique
        </h1>
        <p style={{ fontFamily: 'Inter', color: 'var(--text-secondary)', marginTop: 8, fontSize: '0.9rem' }}>
          {history.length} prédiction{history.length > 1 ? 's' : ''} enregistrée{history.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Controls */}
      <div className="glass" style={{ padding: '16px 20px', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, position: 'relative', minWidth: 200 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.9rem', pointerEvents: 'none' }}>
            🔍
          </span>
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Rechercher par ID, séquence, date…"
            className="geneo-input"
            style={{ paddingLeft: 36, paddingTop: 9, paddingBottom: 9, borderRadius: 8, resize: 'none', height: 'auto' }}
          />
        </div>
        <button className="btn-ghost" onClick={clearAll} style={{ color: '#f87171', borderColor: 'rgba(239,68,68,0.25)' }}>
          🗑 Tout supprimer
        </button>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {paginated.map(entry => {
          const isOpen = expanded === entry.id;
          const topTerms = entry.results?.go_terms?.slice(0, 3) || [];
          const totalTerms = entry.results?.go_terms?.length || 0;

          return (
            <div
              key={entry.id}
              className="glass glass-hover"
              style={{
                padding: '20px 24px',
                transition: 'all 0.25s',
                cursor: 'pointer',
              }}
              onClick={() => setExpanded(isOpen ? null : entry.id)}
            >
              {/* Row top */}
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                {/* Left info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      {entry.proteinId}
                    </span>
                    <span style={{
                      fontFamily: 'Space Mono', fontSize: '0.65rem',
                      padding: '2px 8px', borderRadius: 4,
                      background: 'rgba(6,182,212,0.1)', color: 'var(--accent-teal)',
                      border: '1px solid rgba(6,182,212,0.2)',
                    }}>
                      {entry.mode === 'multi' ? 'Batch CSV' : 'Manuel'}
                    </span>
                    <span style={{ fontFamily: 'Space Mono', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                      seuil {entry.threshold}
                    </span>
                  </div>
                  <div style={{ fontFamily: 'Space Mono', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                    {formatDate(entry.timestamp)}
                  </div>
                  {/* Mini GO term preview */}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {topTerms.map(t => (
                      <span key={t.id} style={{
                        fontFamily: 'Space Mono', fontSize: '0.65rem',
                        padding: '2px 8px', borderRadius: 4,
                        background: `${NS_COLORS[t.namespace] || '#64748b'}18`,
                        color: NS_COLORS[t.namespace] || '#94a3b8',
                        border: `1px solid ${NS_COLORS[t.namespace] || '#64748b'}30`,
                      }}>
                        {t.id} · {(t.score * 100).toFixed(0)}%
                      </span>
                    ))}
                    {totalTerms > 3 && (
                      <span style={{ fontFamily: 'Space Mono', fontSize: '0.65rem', color: 'var(--text-muted)', padding: '2px 4px' }}>
                        +{totalTerms - 3} autres
                      </span>
                    )}
                  </div>
                </div>

                {/* Right actions */}
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                  <span style={{
                    fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem',
                    background: 'linear-gradient(135deg, #a78bfa, #06b6d4)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                    {totalTerms}
                  </span>
                  <span style={{ fontFamily: 'Space Mono', fontSize: '0.6rem', color: 'var(--text-muted)' }}>termes</span>
                  <span style={{
                    color: 'var(--text-muted)', fontSize: '0.8rem',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.25s', marginLeft: 8,
                  }}>▼</span>
                </div>
              </div>

              {/* Expanded detail */}
              {isOpen && (
                <div style={{ marginTop: 20, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                  <div style={{ marginBottom: 12 }}>
                    <span className="section-label">Séquence</span>
                    <p style={{
                      fontFamily: 'Space Mono', fontSize: '0.72rem',
                      color: 'var(--text-muted)', marginTop: 4,
                      wordBreak: 'break-all', background: 'var(--bg-deep)',
                      padding: '10px 12px', borderRadius: 8,
                      border: '1px solid var(--border)',
                    }}>
                      {entry.sequence}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <button
                      className="btn-primary"
                      onClick={e => { e.stopPropagation(); reloadInHome(entry); }}
                      style={{ fontSize: '0.82rem', padding: '8px 18px' }}
                    >
                      ↩ Recharger dans l'analyseur
                    </button>
                    <button
                      className="btn-ghost"
                      onClick={e => { e.stopPropagation(); deleteEntry(entry.id); }}
                      style={{ fontSize: '0.82rem', color: '#f87171', borderColor: 'rgba(239,68,68,0.25)' }}
                    >
                      🗑 Supprimer
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 28, alignItems: 'center' }}>
          <button
            className="btn-ghost"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{ opacity: page === 1 ? 0.4 : 1 }}
          >
            ← Préc.
          </button>
          {Array.from({ length: pages }, (_, i) => i + 1).map(n => (
            <button
              key={n}
              onClick={() => setPage(n)}
              style={{
                width: 36, height: 36, borderRadius: 8, cursor: 'pointer',
                fontFamily: 'Space Mono', fontSize: '0.78rem',
                background: page === n ? 'linear-gradient(135deg, var(--accent-1), var(--accent-2))' : 'transparent',
                color: page === n ? '#fff' : 'var(--text-muted)',
                border: `1px solid ${page === n ? 'transparent' : 'var(--border)'}`,
                transition: 'all 0.2s',
              }}
            >
              {n}
            </button>
          ))}
          <button
            className="btn-ghost"
            onClick={() => setPage(p => Math.min(pages, p + 1))}
            disabled={page === pages}
            style={{ opacity: page === pages ? 0.4 : 1 }}
          >
            Suiv. →
          </button>
        </div>
      )}
    </div>
  );
}
