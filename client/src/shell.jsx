// shell.jsx — Sidebar + topbar + page chrome for FoodFlow desktop.

import React from 'react'
import { Icon, StatusDot, KBD, Btn } from './atoms.jsx'

export const NAV = [
  { id: 'dashboard',  label: 'Dashboard',  icon: 'dashboard' },
  { id: 'mesas',      label: 'Mesas',      icon: 'grid' },
  { id: 'pedidos',    label: 'Pedidos',    icon: 'receipt' },
  { id: 'caixa',      label: 'Caixa',      icon: 'cash' },
  { id: 'relatorios', label: 'Relatórios', icon: 'chart' },
  { id: 'unidades',   label: 'Unidades',   icon: 'building' },
  { section: 'MVP Comercial' },
  { id: 'cardapio',     label: 'Cardápio',     icon: 'bag',      badge: 'MVP' },
  { id: 'funcionarios', label: 'Funcionários', icon: 'user',     badge: 'MVP' },
  { id: 'integracoes',  label: 'Integrações',  icon: 'settings', badge: 'MVP' },
  { section: 'v1.5 — Gestão' },
  { id: 'estoque',    label: 'Estoque',    icon: 'flame', badge: 'v1.5' },
  { id: 'financeiro', label: 'Financeiro', icon: 'chart', badge: 'v1.5' },
  { section: 'v2.0 — Plataforma' },
  { id: 'fidelidade', label: 'Fidelidade', icon: 'check', badge: 'v2.0' },
];

export function Wordmark({ t, collapsed = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 32 }}>
      <div style={{
        width: 22, height: 22, borderRadius: 5,
        background: t.accent,
        display: 'grid', placeItems: 'center', flexShrink: 0,
        boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
      }}>
        <span style={{
          color: '#fff', fontWeight: 700, fontSize: 13,
          fontFamily: '"Geist", system-ui, sans-serif',
          letterSpacing: '-0.02em',
        }}>F</span>
      </div>
      {!collapsed && (
        <span style={{
          fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em',
          color: t.text,
        }}>FoodFlow</span>
      )}
    </div>
  );
}

export function Sidebar({ t, page, setPage, collapsed = false, unidade, setUnidade, unidades }) {
  const W = collapsed ? 56 : 220;
  const [unidOpen, setUnidOpen] = React.useState(false);

  return (
    <aside style={{
      width: W, flexShrink: 0,
      background: t.bgPanel,
      borderRight: `0.5px solid ${t.border}`,
      display: 'flex', flexDirection: 'column',
      transition: 'width 160ms',
    }}>
      <div style={{
        height: 48, padding: collapsed ? '0 17px' : '0 14px',
        display: 'flex', alignItems: 'center',
        borderBottom: `0.5px solid ${t.borderSoft}`,
      }}>
        <Wordmark t={t} collapsed={collapsed} />
      </div>

      {!collapsed && (
        <div style={{ padding: '10px 10px 6px' }}>
          <button onClick={() => setUnidOpen(o => !o)}
            style={{
              width: '100%', height: 36, padding: '0 8px 0 10px',
              display: 'flex', alignItems: 'center', gap: 8,
              background: unidOpen ? t.bgHover : t.bgSubtle,
              border: `0.5px solid ${t.border}`, borderRadius: 6,
              cursor: 'pointer', color: t.text, fontFamily: 'inherit',
            }}>
            <Icon name="pin" size={13} stroke={t.textDim} />
            <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
              <div style={{ fontSize: 9.5, fontWeight: 500, color: t.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase', lineHeight: 1.2 }}>Unidade</div>
              <div style={{ fontSize: 12, fontWeight: 500, color: t.text, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{unidade?.nome || '—'}</div>
            </div>
            <Icon name="chevD" size={12} stroke={t.textDim} style={{ transform: unidOpen ? 'rotate(180deg)' : 'none', transition: 'transform 120ms' }}/>
          </button>
          {unidOpen && (
            <div style={{
              marginTop: 4, background: t.bgPanel, border: `0.5px solid ${t.border}`,
              borderRadius: 6, padding: 4, boxShadow: t.shadow,
            }}>
              {unidades.map(u => (
                <button key={u.id} onClick={() => { setUnidade(u); setUnidOpen(false); }}
                  style={{
                    width: '100%', textAlign: 'left',
                    padding: '6px 8px', borderRadius: 4,
                    border: 0, cursor: 'pointer', background: u.id === unidade?.id ? t.bgHover : 'transparent',
                    color: t.text, fontFamily: 'inherit', fontSize: 12,
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                  <StatusDot color={u.ativo ? t.success : t.textMuted} />
                  <span style={{ flex: 1 }}>{u.nome}</span>
                  {!u.ativo && <span style={{ fontSize: 10, color: t.textMuted }}>inativa</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <nav style={{ flex: 1, padding: collapsed ? '6px' : '4px 8px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
        {NAV.map((item, i) => {
          if (item.section) {
            if (collapsed) return null;
            return (
              <div key={i} style={{
                padding: '10px 10px 3px',
                fontSize: 9.5, fontWeight: 600, color: t.textMuted,
                letterSpacing: '0.07em', textTransform: 'uppercase',
              }}>{item.section}</div>
            );
          }
          const active = page === item.id;
          const badgeColors = { MVP: '#185FA5', 'v1.5': '#d97706', 'v2.0': '#16a34a' };
          return (
            <button key={item.id} onClick={() => setPage(item.id)}
              title={collapsed ? item.label : undefined}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                height: 30, padding: collapsed ? '0' : '0 10px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                background: active ? t.accentBg : 'transparent',
                color: active ? t.accentText : t.textDim,
                border: 0, borderRadius: 6, cursor: 'pointer',
                fontFamily: 'inherit', fontSize: 12.5, fontWeight: active ? 500 : 450,
                position: 'relative',
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = t.bgHover; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
              <Icon name={item.icon} size={15} stroke={active ? t.accentText : t.textDim} sw={1.6}/>
              {!collapsed && <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>}
              {!collapsed && item.badge && (
                <span style={{
                  fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 3,
                  background: badgeColors[item.badge] || t.accent, color: '#fff',
                  letterSpacing: '0.03em',
                }}>{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div style={{
        padding: collapsed ? '8px 6px' : '8px 10px',
        borderTop: `0.5px solid ${t.borderSoft}`,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <div style={{
          width: 26, height: 26, borderRadius: '50%',
          background: t.bgSubtle, border: `0.5px solid ${t.border}`,
          display: 'grid', placeItems: 'center',
          fontSize: 11, fontWeight: 600, color: t.textDim,
          flexShrink: 0,
        }}>RS</div>
        {!collapsed && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: t.text, lineHeight: 1.2 }}>Rafael Souza</div>
            <div style={{ fontSize: 10.5, color: t.textMuted, lineHeight: 1.2 }}>Gerente</div>
          </div>
        )}
        {!collapsed && <Icon name="settings" size={13} stroke={t.textMuted} />}
      </div>
    </aside>
  );
}

export function Topbar({ t, title, subtitle, right }) {
  return (
    <header style={{
      height: 56, padding: '0 20px', flexShrink: 0,
      borderBottom: `0.5px solid ${t.border}`,
      display: 'flex', alignItems: 'center', gap: 16,
      background: t.bgPanel,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: t.text, letterSpacing: '-0.01em', lineHeight: 1.25 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 11.5, color: t.textDim, lineHeight: 1.3 }}>{subtitle}</div>}
      </div>
      <div style={{ position: 'relative', width: 220, height: 30 }}>
        <Icon name="search" size={13} stroke={t.textMuted}
          style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)' }}/>
        <input placeholder="Buscar pedidos, mesas..."
          style={{
            width: '100%', height: '100%',
            padding: '0 28px 0 28px',
            background: t.bgSubtle, border: `0.5px solid ${t.border}`,
            borderRadius: 6, color: t.text,
            fontSize: 12, fontFamily: 'inherit', outline: 'none',
          }}/>
        <span style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)' }}>
          <KBD t={t}>⌘K</KBD>
        </span>
      </div>
      <button style={{
        width: 30, height: 30, borderRadius: 6,
        border: `0.5px solid ${t.border}`, background: t.bgPanel,
        display: 'grid', placeItems: 'center', cursor: 'pointer', position: 'relative',
      }}>
        <Icon name="bell" size={14} stroke={t.textDim} />
        <span style={{
          position: 'absolute', top: 5, right: 5,
          width: 6, height: 6, borderRadius: '50%', background: t.danger,
        }}/>
      </button>
      {right}
    </header>
  );
}

export function Panel({ t, children, style, padding = true }) {
  return (
    <section style={{
      background: t.bgPanel,
      border: `0.5px solid ${t.border}`,
      borderRadius: 8,
      ...(padding ? { padding: 16 } : {}),
      ...style,
    }}>
      {children}
    </section>
  );
}

export function PanelHeader({ t, title, sub, right, style }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      paddingBottom: 12, marginBottom: 12,
      borderBottom: `0.5px solid ${t.borderSoft}`,
      ...style,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: t.text, letterSpacing: '-0.005em' }}>{title}</div>
        {sub && <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>{sub}</div>}
      </div>
      {right}
    </div>
  );
}
