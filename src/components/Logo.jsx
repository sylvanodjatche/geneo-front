// src/components/Logo.jsx

import React from 'react';

export function GENEoLogo({ size = 32, showText = true, className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} style={{ userSelect: 'none' }}>
      {/* Icon: lightning bolt shape from the favicon */}
      <svg
        width={size}
        height={size * (46 / 48)}
        viewBox="0 0 48 46"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <defs>
          <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="50%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <filter id="logo-glow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          fill="url(#logo-grad)"
          filter="url(#logo-glow)"
          d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z"
        />
        {/* Inner highlight */}
        <path
          fill="rgba(255,255,255,0.15)"
          d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z"
          clipPath="inset(0 0 60% 0)"
        />
      </svg>

      {showText && (
        <div style={{ lineHeight: 1 }}>
          <span
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: size * 0.72,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #a78bfa 0%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            GENEo
          </span>
          <div
            style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: size * 0.22,
              color: 'rgba(148,163,184,0.7)',
              letterSpacing: '0.1em',
              marginTop: 1,
            }}
          >
            PROTEIN ORACLE
          </div>
        </div>
      )}
    </div>
  );
}

export default GENEoLogo;
