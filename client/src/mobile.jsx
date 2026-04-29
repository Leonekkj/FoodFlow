// mobile.jsx — Compact mobile layout for FoodFlow (bottom tab bar, simplified pages).

import React from 'react'
import { Icon, Badge, StatusDot, MONO, tipoIcon, tipoLabel, statusToTone, statusLabel } from './atoms.jsx'
import { Panel, PanelHeader } from './shell.jsx'
import { FMT_BRL } from './data.jsx'
import { MesaCard } from './pages-a.jsx'
import { LineChart } from './pages-b.jsx'

function MobileTabbar({ t, page, setPage }) {
  const items = [
    { id: 'dashboard',  label: 'Início', icon: 'home' },
    { id: 'mesas',      label: 'Mesas',  icon: 'grid' },
    { id: 'pedidos',    label: 'Pedido', icon: 'plus', primary: true },
    { id: 'caixa',      label: 'Caixa',  icon: 'cash' },
    { id: 'relatorios', label: 'Relat.', icon: 'chart' },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      paddingBottom: 'env(safe-area-inset-bottom, 12px)',
      paddingTop: 8,
      background: t.bgPanel, borderTop: `0.5px solid ${t.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
    }}>
      {items.map(i => {
        const active = page === i.id;
        if (i.primary) return (
          <button key={i.id} onClick={() => setPage(i.id)} style={{
            width: 44, height: 44, borderRadius: 22,
            background: t.accent, border: 0, cursor: 'pointer',
            display: 'grid', placeItems: 'center',
            boxShadow: '0 4px 12px rgba(24,95,165,0.32)',
          }}>
            <Icon name={i.icon} size={20} stroke="#fff" sw={2}/>
          </button>
        );
        return (
          <button key={i.id} onClick={() => setPage(i.id)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            background: 'transparent', border: 0, cursor: 'pointer',
            color: active ? t.accentText : t.textMuted,
            padding: 4,
          }}>
            <Icon name={i.icon} size={18} stroke={active ? t.accentText : t.textMuted} sw={1.7}/>
            <span style={{ fontSize: 9.5, fontWeight: active ? 600 : 500 }}>{i.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function MobileHeader({ t, title, sub }) {
  return (
    <div style={{ padding: '8px 16px 12px', borderBottom: `0.5px solid ${t.borderSoft}`, background: t.bgPanel }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: t.text, letterSpacing: '-0.01em' }}>{title}</div>
          {sub && <div style={{ fontSize: 11.5, color: t.textMuted, marginTop: 1 }}>{sub}</div>}
        </div>
        <button style={{
          width: 32, height: 32, borderRadius: 8, background: t.bgSubtle,
          border: `0.5px solid ${t.border}`, display: 'grid', placeItems: 'center', cursor: 'pointer',
        }}>
          <Icon name="bell" size={14} stroke={t.textDim}/>
        </button>
      </div>
    </div>
  );
}

function MobileDash({ t, data }) {
  const m = data.metrics;
  return (
    <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ background: t.accent, color: '#fff', borderRadius: 10, padding: '14px 16px' }}>
        <div style={{ fontSize: 10.5, letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.78 }}>Receita do dia</div>
        <div style={{ fontSize: 24, fontWeight: 600, ...MONO, letterSpacing: '-0.02em', marginTop: 2 }}>{FMT_BRL(m.receita)}</div>
        <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Icon name="arrowUp" size={11} sw={2}/>12,4% vs. ontem
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <Panel t={t} style={{ padding: 12 }}>
          <div style={{ fontSize: 10, color: t.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500 }}>Pedidos</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: t.text, ...MONO, marginTop: 2 }}>{m.pedidos}</div>
        </Panel>
        <Panel t={t} style={{ padding: 12 }}>
          <div style={{ fontSize: 10, color: t.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500 }}>Mesas abertas</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: t.text, ...MONO, marginTop: 2 }}>{m.mesasAbertas}/{(data.mesas || []).length}</div>
        </Panel>
      </div>
      <Panel t={t} padding={false}>
        <div style={{ padding: '12px 14px 8px', display: 'flex', alignItems: 'center' }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: t.text, flex: 1 }}>Pedidos ativos</div>
          <span style={{ fontSize: 11, color: t.accentText }}>Ver todos</span>
        </div>
        {(data.pedidos || []).slice(0, 3).map(o => (
          <div key={o.id} style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, borderTop: `0.5px solid ${t.borderSoft}` }}>
            <div style={{
              width: 28, height: 28, borderRadius: 6, background: t.bgSubtle, border: `0.5px solid ${t.border}`,
              display: 'grid', placeItems: 'center',
            }}>
              <Icon name={tipoIcon(o.tipo)} size={13} stroke={t.textDim}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: t.text }}>
                {o.tipo === 'mesa' ? `Mesa ${o.mesa_id}` : tipoLabel(o.tipo)} · #{o.id}
              </div>
              <div style={{ fontSize: 10.5, color: t.textMuted }}>{o.criado} atrás</div>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: t.text, ...MONO }}>{FMT_BRL(o.total)}</span>
          </div>
        ))}
      </Panel>
    </div>
  );
}

function MobileMesas({ t, data }) {
  const totals = {};
  (data.pedidos || []).forEach(p => { if (p.mesa_id) totals[p.mesa_id] = (totals[p.mesa_id] || 0) + p.total; });
  return (
    <div style={{ padding: 14 }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        {[
          { k: 'ocupada',    label: 'Ocupadas', color: t.accent },
          { k: 'aguardando', label: 'Aguard.',  color: t.warning },
          { k: 'livre',      label: 'Livres',   color: t.textMuted },
        ].map(s => {
          const n = (data.mesas || []).filter(m => m.status === s.k).length;
          return (
            <div key={s.k} style={{
              flex: 1, padding: '6px 8px', background: t.bgPanel,
              border: `0.5px solid ${t.border}`, borderRadius: 6,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <StatusDot color={s.color}/>
              <span style={{ fontSize: 10.5, color: t.textDim, flex: 1 }}>{s.label}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: t.text, ...MONO }}>{n}</span>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {(data.mesas || []).map(m => (
          <MesaCard key={m.id} t={t} mesa={m} total={totals[m.id]}/>
        ))}
      </div>
    </div>
  );
}

function MobilePedidos({ t, data }) {
  const cats = [...new Set((data.produtos || []).map(p => p.categoria))];
  const [cat, setCat] = React.useState(cats[0] || '');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '4px 12px 12px', display: 'flex', gap: 6, overflowX: 'auto', borderBottom: `0.5px solid ${t.borderSoft}` }}>
        {cats.map(c => {
          const active = cat === c;
          return (
            <button key={c} onClick={() => setCat(c)} style={{
              padding: '5px 10px', borderRadius: 4, whiteSpace: 'nowrap',
              background: active ? t.accentBg : 'transparent',
              color: active ? t.accentText : t.textDim,
              border: `0.5px solid ${active ? 'transparent' : t.border}`,
              fontSize: 11, fontFamily: 'inherit', fontWeight: 500, cursor: 'pointer',
            }}>{c}</button>
          );
        })}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {(data.produtos || []).filter(p => p.categoria === cat).map(p => (
            <div key={p.id} style={{
              padding: 10, background: t.bgPanel,
              border: `0.5px solid ${t.border}`, borderRadius: 7,
              display: 'flex', flexDirection: 'column', gap: 4,
            }}>
              <div style={{
                height: 50,
                background: `repeating-linear-gradient(45deg, ${t.bgSubtle}, ${t.bgSubtle} 6px, ${t.borderSoft} 6px, ${t.borderSoft} 7px)`,
                borderRadius: 4, marginBottom: 4,
              }}/>
              <span style={{ fontSize: 11.5, color: t.text, fontWeight: 500, lineHeight: 1.3 }}>{p.nome}</span>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: t.accentText, ...MONO }}>{FMT_BRL(p.preco)}</span>
                <button style={{
                  width: 22, height: 22, borderRadius: 5, background: t.accent, border: 0, cursor: 'pointer',
                  display: 'grid', placeItems: 'center',
                }}><Icon name="plus" size={12} stroke="#fff" sw={2}/></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileCaixa({ t, data }) {
  const ativos = (data.pedidos || []).filter(p => p.status !== 'fechado');
  return (
    <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {ativos.length === 0 && (
        <div style={{ padding: 40, textAlign: 'center', color: t.textMuted, fontSize: 12.5 }}>
          Nenhuma conta em aberto.
        </div>
      )}
      {ativos.map(p => (
        <div key={p.id} style={{
          padding: 12, background: t.bgPanel,
          border: `0.5px solid ${t.border}`, borderRadius: 8,
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name={tipoIcon(p.tipo)} size={14} stroke={t.textDim}/>
            <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>
              {p.tipo === 'mesa' ? `Mesa ${p.mesa_id}` : tipoLabel(p.tipo)}
            </span>
            <span style={{ fontSize: 11, color: t.textMuted, ...MONO }}>#{p.id}</span>
            <div style={{ flex: 1 }}/>
            <Badge t={t} tone={statusToTone(p.status)}>{statusLabel(p.status)}</Badge>
          </div>
          <div style={{ fontSize: 11.5, color: t.textDim, lineHeight: 1.4 }}>
            {(p.items || []).map(it => `${it.quantidade}× ${it.nome}`).join(', ')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', paddingTop: 8, borderTop: `0.5px solid ${t.borderSoft}` }}>
            <span style={{ fontSize: 10.5, color: t.textMuted, flex: 1 }}>{p.criado} atrás</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: t.text, ...MONO }}>{FMT_BRL(p.total)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function MobileRelat({ t, data }) {
  return (
    <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Panel t={t}>
        <PanelHeader t={t} title="Últimos 7 dias" sub="Receita por dia"/>
        <LineChart t={t} data={data.historico || []} h={140}/>
      </Panel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <Panel t={t} style={{ padding: 12 }}>
          <div style={{ fontSize: 10, color: t.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500 }}>Receita 7d</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: t.text, ...MONO, marginTop: 2 }}>
            {FMT_BRL((data.historico || []).reduce((s, d) => s + d.valor, 0))}
          </div>
        </Panel>
        <Panel t={t} style={{ padding: 12 }}>
          <div style={{ fontSize: 10, color: t.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500 }}>Pedidos</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: t.text, ...MONO, marginTop: 2 }}>{data.metrics?.pedidos || 0}</div>
        </Panel>
      </div>
    </div>
  );
}

export function MobileApp({ t, data, setData, refresh }) {
  const [page, setPage] = React.useState('dashboard');
  const titles = {
    dashboard:  { title: 'Olá, Rafael',   sub: `Centro · Terça, 29 de Abril` },
    mesas:      { title: 'Mesas',          sub: `${(data.mesas || []).length} totais · ${(data.mesas || []).filter(m => m.status !== 'livre').length} ocupadas` },
    pedidos:    { title: 'Novo pedido',    sub: 'Selecione produtos' },
    caixa:      { title: 'Caixa',          sub: `${(data.pedidos || []).filter(p => p.status !== 'fechado').length} contas em aberto` },
    relatorios: { title: 'Relatórios',     sub: 'Últimos 7 dias' },
  };
  const T = titles[page] || titles.dashboard;
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      background: t.bg, color: t.text,
      width: '100%', height: '100%',
      fontFamily: 'inherit',
      position: 'relative',
    }}>
      <MobileHeader t={t} title={T.title} sub={T.sub}/>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
        {page === 'dashboard'  && <MobileDash     t={t} data={data}/>}
        {page === 'mesas'      && <MobileMesas    t={t} data={data} setData={setData}/>}
        {page === 'pedidos'    && <MobilePedidos  t={t} data={data}/>}
        {page === 'caixa'      && <MobileCaixa    t={t} data={data}/>}
        {page === 'relatorios' && <MobileRelat    t={t} data={data}/>}
      </div>
      <MobileTabbar t={t} page={page} setPage={setPage}/>
    </div>
  );
}
