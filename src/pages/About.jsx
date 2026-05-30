// src/pages/About.jsx

import { GENEoLogo } from '../components/Logo';

const TEAM = [
{ name: 'DJATCHE', role: 'Architecture & Backend', icon: '⚙' },
{ name: 'GOUJOU', role: 'Machine Learning & GCN', icon: '🧠' },
{ name: 'TAGNE', role: 'Frontend & Visualisation', icon: '🎨' },
];

const TECH = [
{ label: 'Embeddings', value: 'ESM-2 650M · Meta AI', color: '#a855f7' },
{ label: 'Modèle prédictif', value: 'GCN + MLP Hiérarchique', color: '#10b981' },
{ label: 'Compétition', value: 'CAFA-6 (Kaggle)', color: '#06b6d4' },
{ label: 'Backend', value: 'FastAPI · HuggingFace Spaces', color: '#f59e0b' },
{ label: 'Frontend', value: 'React 19 · Vite · Tailwind 3', color: '#6366f1' },
{ label: 'Déploiement', value: 'Vercel', color: '#ec4899' },
{ label: 'Graphiques', value: 'Recharts', color: '#a855f7' },
{ label: 'Université', value: 'Université de Yaoundé I', color: '#10b981' },
];

export default function About() {
return (

<div className="animate-fade-in" style={{ maxWidth: 800, margin: '0 auto' }}> {/* Hero */} <div style={{ textAlign: 'center', padding: '32px 0 48px' }}> <div className="animate-float" style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}> <GENEoLogo size={52} showText={true} /> </div> <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2.2rem', marginBottom: 16, letterSpacing: '-0.02em' }}> À propos de{' '} <span className="gradient-text">GENEo</span> </h1> <p style={{ fontFamily: 'Inter', fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: 560, margin: '0 auto', }}> GENEo est un outil de prédiction de la <strong style={{ color: 'var(--text-primary)' }}>fonction biologique des protéines</strong> par annotation de la Gene Ontology (GO). Développé dans le cadre du Master 1 Informatique, il participe à la compétition internationale <strong style={{ color: 'var(--text-accent)' }}>CAFA-6</strong>. </p> </div>
{/* How it works */}

<div className="glass" style={{ padding: '32px', marginBottom: 24 }}> <div className="section-label" style={{ marginBottom: 16 }}>Comment ça fonctionne</div> <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20 }}> {[ { step: '01', icon: '🧬', title: 'Séquence d\'entrée', desc: 'Vous fournissez une séquence d\'acides aminés (format FASTA ou brut).' }, { step: '02', icon: '🔬', title: 'ESM-2 Embedding', desc: 'Le modèle ESM-2 transforme la séquence en vecteur de 1 280 dimensions.' }, { step: '03', icon: '🕸', title: 'GCN + MLP', desc: 'Un réseau de neurones graphique et un MLP prédisent les termes GO.' }, { step: '04', icon: '📋', title: 'Résultats GO', desc: 'Vous obtenez des termes BP, MF, CC avec un score de confiance.' }, ].map(({ step, icon, title, desc }) => ( <div key={step} style={{ position: 'relative' }}> <div style={{ fontFamily: 'Space Mono', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: 8, }}> ÉTAPE {step} </div> <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>{icon}</div> <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '0.95rem', marginBottom: 6, color: 'var(--text-primary)' }}> {title} </h3> <p style={{ fontFamily: 'Inter', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}> {desc} </p> </div> ))} </div> </div>
{/* Tech stack */}

<div className="glass" style={{ padding: '32px', marginBottom: 24 }}> <div className="section-label" style={{ marginBottom: 16 }}>Stack technologique</div> <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}> {TECH.map(({ label, value, color }) => ( <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 14px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, borderLeft: `3px solid ${color}`, }}> <div style={{ flex: 1, minWidth: 0 }}> <div style={{ fontFamily: 'Space Mono', fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}> {label} </div> <div style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}> {value} </div> </div> </div> ))} </div> </div>
{/* Team */}

<div className="glass" style={{ padding: '32px', marginBottom: 24 }}> <div className="section-label" style={{ marginBottom: 20 }}>L'équipe</div> <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}> {TEAM.map(({ name, role, icon }) => ( <div key={name} className="glass-hover" style={{ flex: '1 1 180px', maxWidth: 220, padding: '24px 20px', textAlign: 'center', border: '1px solid var(--border)', borderRadius: 12, background: 'var(--bg-surface)', }}> <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{icon}</div> <h3 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 4 }}> {name} </h3> <p style={{ fontFamily: 'Inter', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{role}</p> </div> ))} </div> </div>
{/* Footer note */}

<div style={{ textAlign: 'center', padding: '24px 0' }}> <p style={{ fontFamily: 'Space Mono', fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}> Projet UE 4258 · Master 1 Informatique · Université de Yaoundé I · 2025–2026 </p> <a href="https://sylvanod-geneo-inference.hf.space" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 12, fontFamily: 'Space Mono', fontSize: '0.72rem', color: 'var(--text-accent)', textDecoration: 'none', }} > 🌐 sylvanod-geneo-inference.hf.space ↗ </a> </div> </div> ); }
