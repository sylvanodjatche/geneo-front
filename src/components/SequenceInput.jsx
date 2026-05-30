// src/components/SequenceInput.jsx

import { useState, useRef } from 'react';
import { parseCsvFile } from '../utils/parseCsv';
import { parseFasta } from '../utils/parseFasta';
import { validateSequence } from '../utils/validateSequence';

const EXAMPLE_SEQUENCE =
  'MAFSDLTSRTVHLYDNWIKDADPRVEDWLLMSSPLPQTILLGFYVYFVTSLGPKLMENRKPFELKKAMITYNFFIVLFSVYMCYEFVMSGWGIGYSFRCDIVDYSRSPTALRMARTCWLYYFSKFIELLDTIFFVLRKKNSQVTFLHVFHHTIMPWTWWFGVKFAAGGLGTFHALLNTAVHVVMYSYYGLSALGPAYQKYLWWKKYLTSLQLVQFVIVAIHISQFFFMEDCKYQFPVFACIIMSYSFMFLLLFLHFWYRAYTKGQRLPKTVKNGTCKNKDN';

export default function SequenceInput({ onPredict, onMultipleSequences, isLoading }) {
  const [sequence, setSequence] = useState('');
  const [threshold, setThreshold] = useState(0.5);
  const [multiSeqs, setMultiSeqs] = useState(null);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const fileInputRef = useRef(null);

  const charCount = sequence.replace(/\s|>/g, '').length;

  const handleSequenceChange = (val) => {
    setSequence(val);
    setMultiSeqs(null);
    setFileName(null);
    const err = validateSequence(val);
    setValidationError(err);
  };

  const processFile = async (file) => {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['fasta', 'txt', 'csv'].includes(ext)) {
      setValidationError('Format non supporté. Utilisez .fasta, .txt ou .csv');
      return;
    }
    setFileName(file.name);
    setValidationError(null);

    if (ext === 'csv') {
      try {
        const seqs = await parseCsvFile(file);
        if (!seqs || seqs.length === 0) {
          setValidationError('Aucune séquence trouvée dans le CSV.');
          return;
        }
        setMultiSeqs(seqs);
        setSequence(seqs[0].sequence);
        setSelectedIdx(0);
      } catch (err) {
        setValidationError('Erreur CSV : ' + err.message);
      }
    } else {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const content = ev.target.result;
        const parsed = parseFasta(content);
        if (parsed && parsed.length > 1) {
          setMultiSeqs(parsed);
          setSequence(parsed[0].sequence);
          setSelectedIdx(0);
        } else if (parsed && parsed.length === 1) {
          setSequence(parsed[0].sequence);
          setMultiSeqs(null);
        } else {
          setSequence(content);
          setMultiSeqs(null);
        }
      };
      reader.onerror = () => setValidationError('Erreur de lecture du fichier.');
      reader.readAsText(file);
    }
  };

  const handleFileInput = (e) => { processFile(e.target.files[0]); e.target.value = ''; };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    processFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = () => {
    if (isLoading) return;
    if (multiSeqs && multiSeqs.length > 0) {
      onMultipleSequences(multiSeqs, threshold);
    } else if (sequence.trim()) {
      const err = validateSequence(sequence);
      if (err) { setValidationError(err); return; }
      onPredict(sequence, threshold);
    } else {
      setValidationError('Veuillez entrer une séquence ou charger un fichier.');
    }
  };

  const loadExample = () => {
    setSequence(EXAMPLE_SEQUENCE);
    setMultiSeqs(null);
    setFileName(null);
    setValidationError(null);
  };

  const clearAll = () => {
    setSequence(''); setMultiSeqs(null); setFileName(null); setValidationError(null);
  };

  const pct = threshold * 100;
  const thresholdColor = pct < 30 ? '#ef4444' : pct < 60 ? '#f59e0b' : '#10b981';

  return (
    <div className="glass animate-fade-up" style={{ padding: '32px', marginBottom: 24 }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="section-label" style={{ marginBottom: 4 }}>Étape 01</div>
          <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.25rem', margin: 0, color: 'var(--text-primary)' }}>
            Séquence d'acides aminés
          </h2>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-ghost" onClick={loadExample} style={{ fontSize: '0.8rem' }}>
            ⚗ Exemple
          </button>
          {sequence && (
            <button className="btn-ghost" onClick={clearAll} style={{ fontSize: '0.8rem', color: 'var(--accent-red)' }}>
              ✕ Effacer
            </button>
          )}
        </div>
      </div>

      {/* Textarea with drag & drop */}
      <div
        style={{
          position: 'relative',
          border: dragOver
            ? '1px solid rgba(139,92,246,0.6)'
            : validationError
              ? '1px solid rgba(239,68,68,0.4)'
              : '1px solid var(--border)',
          borderRadius: 10,
          background: dragOver ? 'rgba(124,58,237,0.05)' : 'var(--bg-deep)',
          transition: 'all 0.2s',
        }}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <textarea
          rows={7}
          value={sequence}
          onChange={e => handleSequenceChange(e.target.value)}
          className="geneo-input"
          style={{ border: 'none', background: 'transparent', resize: 'vertical', minHeight: 160 }}
          placeholder={
            `Collez votre séquence FASTA ou brute…\n\n>sp|P12345|PROT_HUMAN Exemple de protéine\nMKTLLLTLVVVTIVCLDLGA…\n\nOu glissez-déposez un fichier .fasta / .txt / .csv`
          }
          spellCheck={false}
        />
        {dragOver && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            borderRadius: 10, pointerEvents: 'none',
            background: 'rgba(124,58,237,0.08)',
          }}>
            <span style={{ fontFamily: 'Syne', fontWeight: 600, color: 'var(--text-accent)', fontSize: '1.1rem' }}>
              ⬇ Déposer ici
            </span>
          </div>
        )}
      </div>

      {/* Meta info row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {charCount > 0 && (
            <span style={{ fontFamily: 'Space Mono', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {charCount} acides aminés
            </span>
          )}
          {fileName && (
            <span style={{
              fontFamily: 'Space Mono', fontSize: '0.72rem',
              color: 'var(--accent-teal)',
              background: 'rgba(6,182,212,0.08)',
              border: '1px solid rgba(6,182,212,0.2)',
              padding: '2px 8px', borderRadius: 4,
            }}>
              📄 {fileName}
            </span>
          )}
          {multiSeqs && (
            <span style={{
              fontFamily: 'Space Mono', fontSize: '0.72rem',
              color: 'var(--accent-2)',
              background: 'rgba(168,85,247,0.08)',
              border: '1px solid rgba(168,85,247,0.2)',
              padding: '2px 8px', borderRadius: 4,
            }}>
              {multiSeqs.length} séquences détectées
            </span>
          )}
        </div>
        {validationError && (
          <span style={{ fontFamily: 'Inter', fontSize: '0.78rem', color: '#fca5a5' }}>
            ⚠ {validationError}
          </span>
        )}
      </div>

      {/* Multi-seq selector */}
      {multiSeqs && multiSeqs.length > 1 && (
        <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--bg-surface)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="section-label">Prévisualiser</span>
          <select
            value={selectedIdx}
            onChange={e => {
              const idx = parseInt(e.target.value);
              setSelectedIdx(idx);
              setSequence(multiSeqs[idx].sequence);
            }}
            style={{
              background: 'var(--bg-deep)', border: '1px solid var(--border)',
              color: 'var(--text-primary)', padding: '6px 12px',
              borderRadius: 6, fontFamily: 'Space Mono', fontSize: '0.78rem',
              cursor: 'pointer', outline: 'none', flex: 1,
            }}
          >
            {multiSeqs.map((seq, i) => (
              <option key={i} value={i}>
                {seq.id} ({seq.sequence.length} aa)
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="divider" />

      {/* Controls row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Threshold slider */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
            <span className="section-label">Étape 02 — Seuil de confiance</span>
            <span style={{
              fontFamily: 'Space Mono', fontWeight: 700,
              fontSize: '1.1rem', color: thresholdColor,
              textShadow: `0 0 10px ${thresholdColor}60`,
              transition: 'color 0.3s',
            }}>
              {threshold.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min="0" max="1" step="0.01"
            value={threshold}
            onChange={e => setThreshold(parseFloat(e.target.value))}
            className="geneo-range"
            style={{
              background: `linear-gradient(to right, ${thresholdColor} 0%, ${thresholdColor} ${pct}%, rgba(99,130,255,0.12) ${pct}%, rgba(99,130,255,0.12) 100%)`,
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            {['Sensible', 'Équilibré', 'Précis'].map((label, i) => (
              <span key={label} style={{
                fontFamily: 'Space Mono', fontSize: '0.65rem',
                color: 'var(--text-muted)', letterSpacing: '0.05em',
              }}>
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".fasta,.txt,.csv"
            onChange={handleFileInput}
            style={{ display: 'none' }}
          />
          <button
            className="btn-ghost"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            style={{ whiteSpace: 'nowrap' }}
          >
            📂 Fichier
          </button>
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={isLoading || (!sequence.trim() && !multiSeqs)}
            style={{ whiteSpace: 'nowrap', minWidth: 130 }}
          >
            {isLoading ? (
              <>
                <span style={{
                  width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff', borderRadius: '50%',
                  display: 'inline-block', animation: 'spin-slow 0.8s linear infinite',
                }} />
                Analyse…
              </>
            ) : (
              <>⚡ Prédire</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
