// src/pages/Home.jsx

import { useState, useRef } from 'react';
import SequenceInput from '../components/SequenceInput';
import ResultsPanel from '../components/ResultsPanel';
import ExportPanel from '../components/ExportPanel';
import { predict } from '../services/api';
import { useLocalStorage } from '../hooks/useLocalStorage';

function HeroBg() {
  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden',
      pointerEvents: 'none', zIndex: 0,
    }}>
      {/* Helix rings */}
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          position: 'absolute',
          right: `${-10 + i * 5}%`,
          top: `${10 + i * 15}%`,
          width: `${280 - i * 40}px`,
          height: `${280 - i * 40}px`,
          borderRadius: '50%',
          border: `1px solid rgba(124,58,237,${0.08 + i * 0.04})`,
          animation: `spin-slow ${12 + i * 4}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`,
        }} />
      ))}
      {/* Glow blobs */}
      <div style={{
        position: 'absolute', top: '20%', right: '5%',
        width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
        filter: 'blur(20px)',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', left: '2%',
        width: 200, height: 200, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)',
        filter: 'blur(15px)',
      }} />
    </div>
  );
}

export default function Home() {
  const [results, setResults] = useState(null);
  const [allResults, setAllResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [error, setError] = useState(null);
  const [currentMode, setCurrentMode] = useState('single');
  const [history, setHistory] = useLocalStorage('geneo_history', []);
  const resultsRef = useRef(null);

  const loadMessages = [
    'Calcul des embeddings ESM-2…',
    'Propagation dans le graphe GO…',
    'Inférence GCN en cours…',
    'Filtrage des termes GO…',
    'Résultats presque prêts…',
  ];

  const saveToHistory = (sequence, threshold, resultsData, mode, id = null) => {
    const entry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      sequence: sequence.substring(0, 200) + (sequence.length > 200 ? '…' : ''),
      fullSequence: sequence,
      threshold,
      results: resultsData,
      mode,
      proteinId: id || (mode === 'single' ? 'Séquence manuelle' : 'CSV import'),
    };
    setHistory(prev => [entry, ...prev].slice(0, 50));
  };

  const startLoadingCycle = () => {
    let i = 0;
    setLoadingMsg(loadMessages[0]);
    const iv = setInterval(() => {
      i = (i + 1) % loadMessages.length;
      setLoadingMsg(loadMessages[i]);
    }, 1800);
    return iv;
  };

  const handlePredict = async (sequence, threshold) => {
    setLoading(true);
    setError(null);
    setCurrentMode('single');
    const iv = startLoadingCycle();
    try {
      const data = await predict(sequence, threshold);
      setResults(data);
      setAllResults([]);
      saveToHistory(sequence, threshold, data, 'single');
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    } catch (err) {
      setError(err.message);
    } finally {
      clearInterval(iv);
      setLoading(false);
    }
  };

  const handleMultipleSequences = async (sequences, threshold) => {
    setLoading(true);
    setError(null);
    setCurrentMode('multi');
    const iv = startLoadingCycle();
    try {
      const arr = [];
      for (let i = 0; i < sequences.length; i++) {
        const seq = sequences[i];
        const data = await predict(seq.sequence, threshold);
        arr.push({ id: seq.id, results: data });
        saveToHistory(seq.sequence, threshold, data, 'multi', seq.id);
        await new Promise(r => setTimeout(r, 150));
      }
      setAllResults(arr);
      if (arr.length > 0) { setResults(arr[0].results); setSelectedIndex(0); }
    } catch (err) {
      setError(err.message);
    } finally {
      clearInterval(iv);
      setLoading(false);
    }
  };

  return (
    <div>
      {/* ── Hero section ─────────────────────────────────── */}
      <section style={{
        position: 'relative',
        padding: '48px 0 56px',
        marginBottom: 40,
        overflow: 'hidden',
      }}>
        <HeroBg />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-label" style={{ marginBottom: 16 }}>
            Gene Ontology Prediction · CAFA-6 Challenge
          </div>
          <h1 style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            marginBottom: 20,
            maxWidth: 700,
          }}>
            Prédisez la{' '}
            <span className="gradient-text">fonction biologique</span>
            {' '}de vos protéines
          </h1>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '1.05rem',
            color: 'var(--text-secondary)',
            maxWidth: 560,
            lineHeight: 1.7,
            marginBottom: 32,
          }}>
            Entrez une séquence d'acides aminés. Notre modèle{' '}
            <span style={{ color: 'var(--text-accent)' }}>ESM-2 + GCN</span>{' '}
            prédit ses termes GO (Processus Biologique, Fonction Moléculaire, Composante Cellulaire).
          </p>

          {/* Quick stats strip */}
          <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
            {[
              { label: 'Modèle', value: 'ESM-2 650M' },
              { label: 'Architecture', value: 'GCN + MLP' },
              { label: 'Compétition', value: 'CAFA-6' },
              { label: 'Backend', value: 'FastAPI / HF' },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontFamily: 'Space Mono', fontSize: '0.65rem',
                               color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {label}
                </span>
                <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '0.9rem',
                               fontWeight: 600, color: 'var(--text-primary)' }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sequence input ────────────────────────────────── */}
      <SequenceInput
        onPredict={handlePredict}
        onMultipleSequences={handleMultipleSequences}
        isLoading={loading}
      />

      {/* ── Loading state ─────────────────────────────────── */}
      {loading && (
        <div className="glass animate-fade-in" style={{
          textAlign: 'center', padding: '48px 24px', marginTop: 24,
        }}>
          <div className="dna-spinner" style={{ margin: '0 auto 20px' }} />
          <p style={{ fontFamily: 'Space Mono', fontSize: '0.8rem',
                      color: 'var(--text-accent)', letterSpacing: '0.05em' }}>
            {loadingMsg}
          </p>
          <div style={{
            marginTop: 16, height: 2, borderRadius: 1,
            background: 'var(--bg-elevated)', overflow: 'hidden', width: 240, margin: '16px auto 0',
          }}>
            <div style={{
              height: '100%', borderRadius: 1,
              background: 'linear-gradient(90deg, var(--accent-1), var(--accent-teal))',
              animation: 'shimmer 1.5s linear infinite',
              backgroundSize: '200% auto',
              width: '60%',
            }} />
          </div>
        </div>
      )}

      {/* ── Error ─────────────────────────────────────────── */}
      {error && !loading && (
        <div className="alert-error animate-fade-in" style={{ marginTop: 20 }}>
          <strong>⚠ Erreur de prédiction</strong><br />
          <span style={{ fontSize: '0.82rem', opacity: 0.8 }}>{error}</span>
        </div>
      )}

      {/* ── Multi-protein selector ────────────────────────── */}
      {results && currentMode === 'multi' && allResults.length > 1 && (
        <div className="glass animate-fade-up" style={{ padding: '16px 24px', marginTop: 20, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span className="section-label">Protéine sélectionnée</span>
          <select
            value={selectedIndex}
            onChange={e => {
              const idx = parseInt(e.target.value);
              setSelectedIndex(idx);
              setResults(allResults[idx].results);
            }}
            style={{
              background: 'var(--bg-deep)', border: '1px solid var(--border)',
              color: 'var(--text-primary)', padding: '8px 14px',
              borderRadius: 8, fontFamily: 'Space Mono', fontSize: '0.8rem',
              cursor: 'pointer', outline: 'none',
            }}
          >
            {allResults.map((item, idx) => (
              <option key={idx} value={idx}>
                {item.id} · {item.results.go_terms?.length ?? 0} termes GO
              </option>
            ))}
          </select>
        </div>
      )}

      {/* ── Results ───────────────────────────────────────── */}
      <div ref={resultsRef}>
        {results && !loading && (
          <>
            <ResultsPanel results={results} />
            <ExportPanel results={results} />
          </>
        )}
      </div>
    </div>
  );
}
