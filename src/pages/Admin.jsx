// src/pages/Admin.jsx

import { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useLocalStorage } from '../hooks/useLocalStorage';

const NS_COLORS = { MF: '#a855f7', BP: '#10b981', CC: '#6366f1', '?': '#64748b' };

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px' }}>
      <p style={{ fontFamily: 'Space Mono', fontSize: '0.75rem', color: 'var(--text-primary)', margin: 0 }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ fontFamily: 'Space Mono', fontSize: '0.78rem', color: p.color, margin: '4px 0 0' }}>
          {p.value} prédiction{p.value > 1 ? 's' : ''}
        </p>
      ))}
    </div>
  );
};

function StatCard({ label, value, sub, color = '#a78bfa', icon }) {
  return (
    <div className="glass glass-hover" style={{ padding: '24px', flex: '1 1 160px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <span className="section-label">{label}</span>
        <span style={{ fontSize: '1.4rem' }}>{icon}</span>
      </div>
      <div className="stat-value" style={{ background: `linear-gradient(135deg, ${color}, #06b6d4)`, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        {value}
      </div>
      {sub && <p style={{ fontFamily: 'Inter', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 6 }}>{sub}</p>}
    </div>
  );
}

export default function Admin() {
  const [history] = useLocalStorage('geneo_history', []);

  const stats = useMemo(() => {
    if (!history.length) return null;

    const total = history.length;
    const singleMode = history.filter(e => e.mode === 'single').length;
    const batchMode = history.filter(e => e.mode === 'multi').length;

    // Average terms per prediction
    const avgTerms = (history.reduce((s, e) => s + (e.results?.go_terms?.length || 0), 0) / total).toFixed(1);

    // Total GO terms predicted
    const totalTerms = history.reduce((s, e) => s + (e.results?.go_terms?.length || 0), 0);

    // Avg threshold
    const avgThreshold = (history.reduce((s, e) => s + (e.threshold || 0.5), 0) / total).toFixed(2);

    // NS distribution
    const nsCounts = { MF: 0, BP: 0, CC: 0, '?': 0 };
    history.forEach(e => {
      (e.results?.go_terms || []).forEach(t => {
        const ns = t.namespace || '?';
        nsCounts[ns] = (nsCounts[ns] || 0) + 1;
      });
    });
    const nsPie = Object.entries(nsCounts)
      .filter(([, v]) => v > 0)
      .map(([ns, count]) => ({ name: ns, value: count, color: NS_COLORS[ns] }));

    // Activity by day (last 14 days)
    const dayMap = {};
    history.forEach(e => {
      const day = new Date(e.timestamp).toLocaleDateString('fr-FR', { month: 'short', day: '2-digit' });
      dayMap[day] = (dayMap[day] || 0) + 1;
    });
    // Sort by date
    const activityData = Object.entries(dayMap)
      .sort((a, b) => new Date(a[0]) - new Date(b[0]))
      .slice(-14)
      .map(([date, count]) => ({ date, count }));

    // Most frequent GO terms
    const termFreq = {};
    history.forEach(e => {
      (e.results?.go_terms || []).forEach(t => {
        termFreq[t.id] = (termFreq[t.id] || 0) + 1;
      });
    });
    const topTerms = Object.entries(termFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([id, count]) => ({ id, count }));

    // Latest activity
    const latest = [...history].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5);

    return { total, singleMode, batchMode, avgTerms, totalTerms, avgThreshold, nsPie, activityData, topTerms, latest };
  }, [history]);

  const formatDate = ts => new Date(ts).toLocaleString('fr-FR', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  });

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div className="section-label" style={{ marginBottom: 8 }}>Tableau de bord</div>
        <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2rem', margin: 0 }}>
          Dashboard des statistiques d'utilisation
        </h1>
        <p style={{ fontFamily: 'Inter', color: 'var(--text-secondary)', marginTop: 8, fontSize: '0.88rem' }}>
          Statistiques d'utilisation locales (localStorage)
        </p>
      </div>

      {!stats ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>📊</div>
          <p style={{ fontFamily: 'Syne', fontWeight: 600, color: 'var(--text-muted)', fontSize: '1rem' }}>
            Aucune donnée disponible. Faites vos premières prédictions.
          </p>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 28 }}>
            <StatCard icon="⚡" label="Total prédictions" value={stats.total} sub={`${stats.singleMode} manuelles · ${stats.batchMode} batch`} color="#7c3aed" />
            <StatCard icon="🧬" label="Termes GO prédits" value={stats.totalTerms.toLocaleString()} sub={`Moy. ${stats.avgTerms} termes/prédiction`} color="#10b981" />
            <StatCard icon="🎯" label="Seuil moyen" value={stats.avgThreshold} sub="Score de confiance moyen utilisé" color="#06b6d4" />
            <StatCard icon="📅" label="Première analyse" value={new Date(history[history.length-1]?.timestamp).toLocaleDateString('fr-FR')} sub="Date de début d'utilisation" color="#f59e0b" />
          </div>

          {/* Activity chart + NS pie */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 28 }} className="grid-responsive">
            {/* Activity line chart */}
            <div className="glass" style={{ padding: '24px' }}>
              <div className="section-label" style={{ marginBottom: 16 }}>Fréquence d'utilisation</div>
              {stats.activityData.length >= 2 ? (
                <div style={{ height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.activityData} margin={{ left: 0, right: 16, top: 4, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,130,255,0.06)" />
                      <XAxis dataKey="date" tick={{ fontFamily: 'Space Mono', fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <YAxis allowDecimals={false} tick={{ fontFamily: 'Space Mono', fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} width={24} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone" dataKey="count"
                        stroke="url(#lineGrad)" strokeWidth={2.5}
                        dot={{ fill: '#7c3aed', r: 4, strokeWidth: 0 }}
                        activeDot={{ r: 6, fill: '#a78bfa' }}
                      />
                      <defs>
                        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#7c3aed" />
                          <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                      </defs>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p style={{ fontFamily: 'Space Mono', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>
                  Pas assez de données pour le graphique.
                </p>
              )}
            </div>

            {/* Namespace pie */}
            <div className="glass" style={{ padding: '24px' }}>
              <div className="section-label" style={{ marginBottom: 16 }}>Distribution GO</div>
              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.nsPie} cx="50%" cy="45%"
                      innerRadius={50} outerRadius={80}
                      paddingAngle={3} dataKey="value"
                    >
                      {stats.nsPie.map((entry, i) => (
                        <Cell key={i} fill={entry.color} fillOpacity={0.85} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v, n) => [`${v} termes`, n]}
                      contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, fontFamily: 'Space Mono', fontSize: '0.72rem' }}
                    />
                    <Legend
                      formatter={(v) => <span style={{ fontFamily: 'Space Mono', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{v}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Top terms + Recent activity */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="grid-responsive">
            {/* Top GO terms */}
            <div className="glass" style={{ padding: '24px' }}>
              <div className="section-label" style={{ marginBottom: 16 }}>Termes GO les plus fréquents</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {stats.topTerms.map(({ id, count }, i) => (
                  <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontFamily: 'Space Mono', fontSize: '0.65rem', color: 'var(--text-muted)', width: 20 }}>
                      {(i + 1).toString().padStart(2, '0')}
                    </span>
                    <a
                      href={`https://www.ebi.ac.uk/QuickGO/term/${id}`}
                      target="_blank" rel="noopener noreferrer"
                      style={{ fontFamily: 'Space Mono', fontSize: '0.75rem', color: 'var(--text-accent)', flex: 1, textDecoration: 'none' }}
                    >
                      {id}
                    </a>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        height: 3, width: `${(count / stats.topTerms[0].count) * 80}px`,
                        background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
                        borderRadius: 2,
                      }} />
                      <span style={{ fontFamily: 'Space Mono', fontSize: '0.72rem', color: 'var(--text-primary)', minWidth: 20 }}>
                        ×{count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent activity */}
            <div className="glass" style={{ padding: '24px' }}>
              <div className="section-label" style={{ marginBottom: 16 }}>Activité récente</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {stats.latest.map(entry => (
                  <div key={entry.id} style={{
                    display: 'flex', gap: 12, alignItems: 'flex-start',
                    paddingBottom: 12, borderBottom: '1px solid var(--border)',
                  }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%', marginTop: 4, flexShrink: 0,
                      background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                    }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: '0.82rem', color: 'var(--text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {entry.proteinId}
                      </p>
                      <p style={{ fontFamily: 'Space Mono', fontSize: '0.65rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                        {formatDate(entry.timestamp)} · {entry.results?.go_terms?.length || 0} termes GO
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Analytics note */}
          <div style={{
            marginTop: 24, padding: '16px 20px',
            background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.2)',
            borderRadius: 10,
          }}>
            <p style={{ fontFamily: 'Inter', fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
              💡 <strong style={{ color: 'var(--accent-teal)' }}>Note :</strong> Ces statistiques sont calculées depuis le localStorage de votre navigateur.
              Pour un tracking multi-utilisateurs en production, intégrez{' '}
              <a href="https://plausible.io" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-accent)' }}>Plausible Analytics</a>
              {' '}(open-source, RGPD-friendly, gratuit sur self-host) ou{' '}
              <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-accent)' }}>Google Analytics 4</a>.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
