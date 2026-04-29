// atoms.jsx — Shared theme tokens, icons, and tiny components for FoodFlow.

import React from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// Theme
// ─────────────────────────────────────────────────────────────────────────────
export function makeTheme({ dark = false, density = 'regular' } = {}) {
  const d = density;
  const D = {
    compact: { rowH: 28, cellH: 64, padX: 12, padY: 8,  gap: 8,  fontXs: 10.5, fontSm: 11.5, fontBody: 12.5, fontH: 13.5 },
    regular: { rowH: 34, cellH: 80, padX: 16, padY: 12, gap: 12, fontXs: 11,   fontSm: 12,   fontBody: 13,   fontH: 14.5 },
    comfy:   { rowH: 40, cellH: 96, padX: 20, padY: 16, gap: 16, fontXs: 11.5, fontSm: 13,   fontBody: 14,   fontH: 16 },
  }[d] || {};

  if (dark) {
    return {
      ...D, dark: true, density: d,
      bg:        '#0b0c0e',
      bgPanel:   '#111317',
      bgRaised:  '#16191e',
      bgHover:   '#1a1d23',
      bgSubtle:  '#0f1115',
      border:    '#22262d',
      borderSoft:'#1a1d22',
      text:      '#e6e8ec',
      textDim:   '#9098a4',
      textMuted: '#5b6371',
      accent:    '#4a8df0',
      accentBg:  'rgba(74,141,240,0.14)',
      accentSoft:'rgba(74,141,240,0.08)',
      accentText:'#82b3ff',
      success:   '#3fb96a',
      successBg: 'rgba(63,185,106,0.14)',
      warning:   '#e6a73a',
      warningBg: 'rgba(230,167,58,0.16)',
      danger:    '#e85a5a',
      dangerBg:  'rgba(232,90,90,0.16)',
      shadow:    '0 1px 0 rgba(255,255,255,0.02), 0 12px 32px rgba(0,0,0,0.5)',
      shadowSm:  '0 1px 2px rgba(0,0,0,0.4)',
    };
  }
  return {
    ...D, dark: false, density: d,
    bg:        '#fafafa',
    bgPanel:   '#ffffff',
    bgRaised:  '#ffffff',
    bgHover:   '#f4f5f7',
    bgSubtle:  '#f7f8f9',
    border:    '#e6e8eb',
    borderSoft:'#eef0f2',
    text:      '#0f172a',
    textDim:   '#64748b',
    textMuted: '#94a0ad',
    accent:    '#185FA5',
    accentBg:  'rgba(24,95,165,0.08)',
    accentSoft:'rgba(24,95,165,0.05)',
    accentText:'#185FA5',
    success:   '#16a34a',
    successBg: 'rgba(22,163,74,0.10)',
    warning:   '#d97706',
    warningBg: 'rgba(245,158,11,0.14)',
    danger:    '#dc2626',
    dangerBg:  'rgba(220,38,38,0.10)',
    shadow:    '0 1px 0 rgba(255,255,255,1) inset, 0 8px 24px rgba(15,23,42,0.06)',
    shadowSm:  '0 1px 2px rgba(15,23,42,0.06)',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────────────────────
export function Icon({ name, size = 16, stroke = 'currentColor', sw = 1.5, style }) {
  const common = {
    width: size, height: size, viewBox: '0 0 24 24',
    fill: 'none', stroke, strokeWidth: sw,
    strokeLinecap: 'round', strokeLinejoin: 'round',
    style,
  };
  const paths = {
    dashboard: <><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></>,
    grid:      <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
    receipt:   <><path d="M5 3h14v18l-3-2-3 2-3-2-3 2-2-2V3Z"/><path d="M9 8h6M9 12h6M9 16h4"/></>,
    cash:      <><rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 9v.01M18 15v.01"/></>,
    chart:     <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></>,
    building:  <><rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3"/></>,
    plus:      <><path d="M12 5v14M5 12h14"/></>,
    minus:     <><path d="M5 12h14"/></>,
    close:     <><path d="M6 6l12 12M18 6L6 18"/></>,
    chevR:     <><path d="M9 6l6 6-6 6"/></>,
    chevL:     <><path d="M15 6l-6 6 6 6"/></>,
    chevD:     <><path d="M6 9l6 6 6-6"/></>,
    search:    <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>,
    bell:      <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9Z"/><path d="M10 21a2 2 0 0 0 4 0"/></>,
    settings:  <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.7l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.7-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.7.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.7 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.7.3 1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.7-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.7 1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z"/></>,
    arrowUp:   <><path d="M12 19V5M5 12l7-7 7 7"/></>,
    arrowDown: <><path d="M12 5v14M19 12l-7 7-7-7"/></>,
    bag:       <><path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 8a3 3 0 0 1 6 0"/></>,
    user:      <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    motorcycle:<><circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M6 17h6l4-7h3l2 4M14 7h3"/></>,
    counter:   <><path d="M3 10h18l-2 11H5L3 10Z"/><path d="M7 10V6a5 5 0 0 1 10 0v4"/></>,
    trash:     <><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></>,
    more:      <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
    check:     <><path d="M5 12l5 5 9-11"/></>,
    home:      <><path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-7H9v7H5a1 1 0 0 1-1-1v-9Z"/></>,
    menu:      <><path d="M4 7h16M4 12h16M4 17h16"/></>,
    cardCC:    <><rect x="2" y="6" width="20" height="13" rx="2"/><path d="M2 10h20M6 15h4"/></>,
    pix:       <><path d="M12 3l4 4-4 4-4-4 4-4Z"/><path d="M12 13l4 4-4 4-4-4 4-4Z"/><path d="M3 12l4-4 4 4-4 4-4-4Z"/><path d="M13 12l4-4 4 4-4 4-4-4Z"/></>,
    flame:     <><path d="M12 3s4 4 4 9a4 4 0 1 1-8 0c0-2 1-3 1-3s-1-2 0-4 3-2 3-2Z"/></>,
    clock:     <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    split:     <><path d="M6 3v6a4 4 0 0 0 4 4h4a4 4 0 0 1 4 4v4M6 21l-3-3 3-3M18 3l3 3-3 3"/></>,
    filter:    <><path d="M3 5h18l-7 9v6l-4-2v-4L3 5Z"/></>,
    calendar:  <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></>,
    pin:       <><path d="M12 22s7-7 7-13a7 7 0 1 0-14 0c0 6 7 13 7 13Z"/><circle cx="12" cy="9" r="2.5"/></>,
    logo:      <><path d="M4 17l4-9h2l3 7 3-9h4l-5 14h-2l-3-7-3 7H6L4 17Z"/></>,
  }[name] || null;
  return <svg {...common}>{paths}</svg>;
}

// ─────────────────────────────────────────────────────────────────────────────
// UI atoms
// ─────────────────────────────────────────────────────────────────────────────
export function StatusDot({ color = '#94a0ad' }) {
  return <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />;
}

export function Badge({ children, tone = 'neutral', t }) {
  const map = {
    neutral: { bg: t.bgSubtle,  fg: t.textDim,    bd: t.border },
    accent:  { bg: t.accentBg,  fg: t.accentText, bd: 'transparent' },
    success: { bg: t.successBg, fg: t.success,    bd: 'transparent' },
    warning: { bg: t.warningBg, fg: t.warning,    bd: 'transparent' },
    danger:  { bg: t.dangerBg,  fg: t.danger,     bd: 'transparent' },
  }[tone] || {};
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 7px', borderRadius: 4,
      background: map.bg, color: map.fg,
      border: `0.5px solid ${map.bd}`,
      fontSize: 10.5, fontWeight: 500,
      letterSpacing: '0.02em',
      whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}

export function statusToTone(status) {
  return ({
    livre:      'neutral',
    ocupada:    'accent',
    aguardando: 'warning',
    aberto:     'neutral',
    preparando: 'warning',
    entregue:   'success',
    fechado:    'success',
  })[status] || 'neutral';
}

export function statusLabel(status) {
  return ({
    livre: 'Livre', ocupada: 'Ocupada', aguardando: 'Aguardando',
    aberto: 'Aberto', preparando: 'Preparando', entregue: 'Entregue', fechado: 'Fechado',
  })[status] || status;
}

export function tipoLabel(tipo) {
  return ({ mesa: 'Mesa', balcao: 'Balcão', delivery: 'Delivery' })[tipo] || tipo;
}

export function tipoIcon(tipo) {
  return ({ mesa: 'grid', balcao: 'counter', delivery: 'motorcycle' })[tipo] || 'grid';
}

export function Btn({ children, kind = 'default', size = 'md', icon, t, onClick, style, type = 'button', disabled }) {
  const sizes = {
    sm: { h: 26, padX: 10, fs: 11.5, gap: 6, ic: 13 },
    md: { h: 32, padX: 12, fs: 12.5, gap: 6, ic: 14 },
    lg: { h: 38, padX: 16, fs: 13.5, gap: 8, ic: 16 },
  }[size];
  const kinds = {
    default: { bg: t.bgPanel, fg: t.text,    bd: t.border, hover: t.bgHover },
    primary: { bg: t.accent,  fg: '#fff',    bd: t.accent, hover: t.accent },
    ghost:   { bg: 'transparent', fg: t.textDim, bd: 'transparent', hover: t.bgHover },
    danger:  { bg: t.bgPanel, fg: t.danger,  bd: t.border, hover: t.dangerBg },
    success: { bg: t.success, fg: '#fff',    bd: t.success, hover: t.success },
  }[kind];
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = kinds.hover; }}
      onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.background = kinds.bg; }}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: sizes.gap,
        height: sizes.h, padding: `0 ${sizes.padX}px`,
        background: kinds.bg, color: kinds.fg,
        border: `0.5px solid ${kinds.bd}`,
        borderRadius: 6,
        fontSize: sizes.fs, fontWeight: 500, fontFamily: 'inherit',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        whiteSpace: 'nowrap',
        transition: 'background 80ms',
        ...style,
      }}>
      {icon && <Icon name={icon} size={sizes.ic} />}
      {children}
    </button>
  );
}

export function Divider({ t, style, vertical = false }) {
  return <div style={{
    background: t.borderSoft,
    ...(vertical ? { width: 1, alignSelf: 'stretch' } : { height: 1, width: '100%' }),
    ...style,
  }} />;
}

export function KBD({ children, t }) {
  return <span style={{
    display: 'inline-block', padding: '1px 5px',
    borderRadius: 3, fontSize: 10,
    background: t.bgSubtle, border: `0.5px solid ${t.border}`,
    color: t.textDim, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  }}>{children}</span>;
}

export const MONO = { fontFamily: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace', fontVariantNumeric: 'tabular-nums' };
