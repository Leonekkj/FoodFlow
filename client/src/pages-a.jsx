// pages-a.jsx — Dashboard + Mesas + Pedidos pages.

import React from 'react'
import { Icon, Badge, Btn, StatusDot, MONO, statusToTone, statusLabel, tipoLabel, tipoIcon } from './atoms.jsx'
import { Panel, PanelHeader } from './shell.jsx'
import { FMT_BRL, FMT_INT } from './data.jsx'

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard
// ─────────────────────────────────────────────────────────────────────────────

export function MetricCard({ t, label, value, sub, trend, hero = false, mono = true, badge }) {
  return (
    <div style={{
      flex: 1, minWidth: 0,
      background: hero ? t.accent : t.bgPanel,
      color: hero ? '#fff' : t.text,
      border: hero ? 'none' : `0.5px solid ${t.border}`,
      borderRadius: 8,
      padding: '14px 16px',
      display: 'flex', flexDirection: 'column', gap: 4,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{
          fontSize: 10.5, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase',
          color: hero ? 'rgba(255,255,255,0.78)' : t.textMuted,
        }}>{label}</span>
        {badge}
      </div>
      <div style={{
        fontSize: hero ? 28 : 22, fontWeight: 600, letterSpacing: '-0.02em',
        lineHeight: 1.1, marginTop: 2,
        ...(mono ? MONO : {}),
      }}>{value}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
        {trend != null && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 2,
            fontSize: 11, fontWeight: 500,
            color: hero
              ? 'rgba(255,255,255,0.95)'
              : (trend >= 0 ? t.success : t.danger),
            ...MONO,
          }}>
            <Icon name={trend >= 0 ? 'arrowUp' : 'arrowDown'} size={11} sw={2}/>
            {Math.abs(trend).toFixed(1)}%
          </span>
        )}
        {sub && <span style={{ fontSize: 11, color: hero ? 'rgba(255,255,255,0.7)' : t.textMuted }}>{sub}</span>}
      </div>
    </div>
  );
}

function HourlyBars({ t, data }) {
  const max = Math.max(1, ...data.map(d => d.valor));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 140, paddingTop: 8 }}>
      {data.map((d, i) => {
        const h = Math.max(2, (d.valor / max) * 120);
        const isPeak = d.valor === max && max > 0;
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end', position: 'relative' }}>
              <div style={{
                width: '100%', height: h,
                background: isPeak ? t.accent : t.accentBg,
                borderRadius: '3px 3px 0 0',
                position: 'relative',
              }}>
                {isPeak && (
                  <div style={{
                    position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)',
                    fontSize: 10, fontWeight: 600, color: t.text, ...MONO, whiteSpace: 'nowrap',
                  }}>{FMT_BRL(d.valor)}</div>
                )}
              </div>
            </div>
            <span style={{ fontSize: 10, color: t.textMuted, ...MONO }}>{d.hora}</span>
          </div>
        );
      })}
    </div>
  );
}

export function OrderRowDense({ t, order, onClick }) {
  return (
    <button onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '8px 10px', borderRadius: 5,
        background: 'transparent', border: 0, cursor: 'pointer',
        fontFamily: 'inherit', textAlign: 'left',
        width: '100%',
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = t.bgHover}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
      <div style={{
        width: 28, height: 28, borderRadius: 6,
        background: t.bgSubtle, border: `0.5px solid ${t.border}`,
        display: 'grid', placeItems: 'center', flexShrink: 0,
      }}>
        <Icon name={tipoIcon(order.tipo)} size={13} stroke={t.textDim}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: t.text, ...MONO }}>#{order.id}</span>
          <span style={{ fontSize: 11.5, color: t.textDim }}>·</span>
          <span style={{ fontSize: 11.5, color: t.textDim }}>
            {order.tipo === 'mesa' ? `Mesa ${order.mesa_id}` : tipoLabel(order.tipo)}
          </span>
        </div>
        <div style={{ fontSize: 10.5, color: t.textMuted, marginTop: 1 }}>
          {(order.items || []).length} {(order.items || []).length === 1 ? 'item' : 'itens'} · {order.criado} atrás
        </div>
      </div>
      <Badge t={t} tone={statusToTone(order.status)}>{statusLabel(order.status)}</Badge>
      <span style={{ fontSize: 12.5, fontWeight: 600, color: t.text, ...MONO, minWidth: 70, textAlign: 'right' }}>
        {FMT_BRL(order.total)}
      </span>
    </button>
  );
}

export function DashboardPage({ t, data, setPage }) {
  const m = data.metrics;
  const recent = (data.pedidos || []).slice(0, 5);

  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <MetricCard t={t} hero label="Receita do dia" value={FMT_BRL(m.receita)}
          trend={12.4} sub="vs. ontem"/>
        <MetricCard t={t} label="Total pedidos" value={FMT_INT(m.pedidos)}
          trend={8.1} sub={`${(data.pedidos || []).filter(p=>p.status==='preparando').length} preparando`}/>
        <MetricCard t={t} label="Mesas abertas" value={`${m.mesasAbertas}/${(data.mesas || []).length}`}
          sub={`${(data.mesas || []).filter(x=>x.status==='aguardando').length} aguardando`}/>
        <MetricCard t={t} label="Ticket médio" value={FMT_BRL(m.ticketMedio || 0)}
          trend={-2.3} sub="por pedido"/>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 12 }}>
        <Panel t={t}>
          <PanelHeader t={t} title="Receita por hora" sub="Hoje · 10:00 → 22:00"
            right={<Badge t={t} tone="accent">Tempo real</Badge>}/>
          <HourlyBars t={t} data={data.hourly || []}/>
        </Panel>
        <Panel t={t} padding={false}>
          <div style={{ padding: '14px 16px 10px', borderBottom: `0.5px solid ${t.borderSoft}`, display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: t.text }}>Últimos pedidos</div>
              <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>{recent.length} ativos</div>
            </div>
            <button onClick={() => setPage('pedidos')} style={{
              fontSize: 11.5, color: t.accentText, background: 'transparent', border: 0,
              cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 2,
            }}>Ver todos <Icon name="chevR" size={11} stroke={t.accentText}/></button>
          </div>
          <div style={{ padding: 6 }}>
            {recent.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: t.textMuted, fontSize: 12 }}>Sem pedidos ativos</div>
            ) : recent.map(o => <OrderRowDense key={o.id} t={t} order={o} onClick={() => setPage('pedidos')}/>)}
          </div>
        </Panel>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Panel t={t} padding={false}>
          <div style={{ padding: '14px 16px 10px', borderBottom: `0.5px solid ${t.borderSoft}` }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: t.text }}>Top produtos</div>
            <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>Por quantidade vendida</div>
          </div>
          <div style={{ padding: 4 }}>
            {(data.topProdutos || []).length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: t.textMuted, fontSize: 12 }}>Sem vendas hoje</div>
            ) : (data.topProdutos || []).map((p, i) => {
              const pct = (p.qtd / data.topProdutos[0].qtd) * 100;
              return (
                <div key={p.id} style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 16, fontSize: 11, color: t.textMuted, ...MONO }}>{String(i+1).padStart(2, '0')}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: t.text, fontWeight: 500 }}>{p.nome}</span>
                      <span style={{ fontSize: 11, color: t.textMuted, ...MONO, marginLeft: 'auto' }}>{p.qtd} un</span>
                    </div>
                    <div style={{ height: 3, background: t.bgSubtle, borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: t.accent, borderRadius: 2 }}/>
                    </div>
                  </div>
                  <span style={{ fontSize: 11.5, color: t.textDim, ...MONO, minWidth: 70, textAlign: 'right' }}>{FMT_BRL(p.receita)}</span>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel t={t}>
          <PanelHeader t={t} title="Canais de venda" sub="Distribuição da receita"/>
          <CanalChart t={t} canal={data.porCanal || { mesa: 0, balcao: 0, delivery: 0 }}/>
        </Panel>
      </div>
    </div>
  );
}

function CanalChart({ t, canal }) {
  const total = canal.mesa + canal.balcao + canal.delivery;
  const items = [
    { key: 'mesa',     label: 'Mesa',     val: canal.mesa,     color: t.accent,  icon: 'grid' },
    { key: 'balcao',   label: 'Balcão',   val: canal.balcao,   color: t.warning, icon: 'counter' },
    { key: 'delivery', label: 'Delivery', val: canal.delivery, color: t.success, icon: 'motorcycle' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ height: 8, borderRadius: 4, overflow: 'hidden', display: 'flex', background: t.bgSubtle }}>
        {total > 0 && items.map(i => (
          <div key={i.key} style={{ width: `${(i.val/total)*100}%`, background: i.color }}/>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {items.map(i => (
          <div key={i.key} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
            <div style={{ width: 24, height: 24, borderRadius: 5, background: t.bgSubtle, display: 'grid', placeItems: 'center' }}>
              <Icon name={i.icon} size={13} stroke={i.color} sw={1.7}/>
            </div>
            <span style={{ flex: 1, fontSize: 12.5, color: t.text }}>{i.label}</span>
            <span style={{ fontSize: 11, color: t.textMuted, ...MONO, width: 44, textAlign: 'right' }}>
              {total > 0 ? `${Math.round((i.val/total)*100)}%` : '—'}
            </span>
            <span style={{ fontSize: 12, fontWeight: 500, color: t.text, ...MONO, width: 84, textAlign: 'right' }}>
              {FMT_BRL(i.val)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Mesas
// ─────────────────────────────────────────────────────────────────────────────

export function MesaCard({ t, mesa, total, onClick }) {
  const tones = {
    livre:      { bg: t.bgPanel, fg: t.textDim,  bd: t.border,  accent: t.textMuted, dot: t.textMuted },
    ocupada:    { bg: t.bgPanel, fg: t.text,     bd: t.border,  accent: t.accent,    dot: t.accent },
    aguardando: { bg: t.bgPanel, fg: t.text,     bd: t.warning, accent: t.warning,   dot: t.warning },
  }[mesa.status] || { bg: t.bgPanel, fg: t.textDim, bd: t.border, accent: t.textMuted, dot: t.textMuted };

  return (
    <button onClick={onClick}
      style={{
        position: 'relative',
        height: 116, padding: 12,
        background: tones.bg,
        border: `0.5px solid ${tones.bd}`,
        borderRadius: 8,
        cursor: 'pointer', textAlign: 'left',
        fontFamily: 'inherit',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        overflow: 'hidden',
        transition: 'transform 80ms, box-shadow 80ms',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = t.shadow; e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
      {mesa.status !== 'livre' && (
        <span style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: tones.accent }}/>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 10.5, color: t.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Mesa</span>
        <StatusDot color={tones.dot}/>
      </div>
      <div style={{ fontSize: 36, fontWeight: 600, color: tones.fg, letterSpacing: '-0.04em', lineHeight: 1, ...MONO }}>
        {String(mesa.numero).padStart(2, '0')}
      </div>
      <div>
        <div style={{ fontSize: 10.5, color: tones.accent, letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 500 }}>
          {statusLabel(mesa.status)}
        </div>
        {total != null && (
          <div style={{ fontSize: 12, fontWeight: 500, color: t.text, marginTop: 2, ...MONO }}>{FMT_BRL(total)}</div>
        )}
      </div>
    </button>
  );
}

export function MesasPage({ t, data, setData, openMesa, setOpenMesa, setPage, refresh }) {
  const totals = {};
  (data.pedidos || []).forEach(p => { if (p.tipo === 'mesa' && p.mesa_id) totals[p.mesa_id] = (totals[p.mesa_id] || 0) + p.total; });

  const counts = {
    livre:      (data.mesas || []).filter(m => m.status === 'livre').length,
    ocupada:    (data.mesas || []).filter(m => m.status === 'ocupada').length,
    aguardando: (data.mesas || []).filter(m => m.status === 'aguardando').length,
  };

  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {[
          { k: 'ocupada', label: 'Ocupadas', color: t.accent },
          { k: 'aguardando', label: 'Aguardando', color: t.warning },
          { k: 'livre', label: 'Livres', color: t.textMuted },
        ].map(s => (
          <div key={s.k} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '6px 12px',
            background: t.bgPanel, border: `0.5px solid ${t.border}`,
            borderRadius: 6,
          }}>
            <StatusDot color={s.color}/>
            <span style={{ fontSize: 11.5, color: t.textDim }}>{s.label}</span>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: t.text, ...MONO }}>{counts[s.k]}</span>
          </div>
        ))}
        <div style={{ flex: 1 }}/>
        <Btn t={t} icon="plus" kind="default" size="sm">Nova mesa</Btn>
        <Btn t={t} icon="receipt" kind="primary" size="sm" onClick={() => setPage('pedidos')}>Novo pedido</Btn>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
        {(data.mesas || []).map(m => (
          <MesaCard key={m.id} t={t} mesa={m} total={totals[m.id]}
            onClick={() => setOpenMesa(m)} />
        ))}
      </div>

      {openMesa && (
        <MesaPanel t={t} mesa={openMesa}
          pedido={(data.pedidos || []).find(p => p.mesa_id === openMesa.id)}
          onClose={() => setOpenMesa(null)}
          onAbrir={() => {
            setOpenMesa(null);
            setPage('pedidos');
          }}
          onFechar={async () => {
            const pedidoMesa = (data.pedidos || []).find(p => p.mesa_id === openMesa.id && p.status !== 'fechado');
            if (pedidoMesa) {
              try {
                await fetch('/api/caixa', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ pedido_id: pedidoMesa.id, forma_pagto: 'dinheiro', valor: pedidoMesa.total }),
                });
                if (refresh) await refresh();
              } catch {
                setData(d => ({
                  ...d,
                  mesas: (d.mesas || []).map(m => m.id === openMesa.id ? { ...m, status: 'livre' } : m),
                  pedidos: (d.pedidos || []).filter(p => p.mesa_id !== openMesa.id),
                }));
              }
            }
            setOpenMesa(null);
          }}
        />
      )}
    </div>
  );
}

function MesaPanel({ t, mesa, pedido, onClose, onAbrir, onFechar }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 30,
      display: 'flex', justifyContent: 'flex-end',
      background: 'rgba(0,0,0,0.18)',
      animation: 'ff-fade 120ms ease-out',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 380, background: t.bgPanel,
        borderLeft: `0.5px solid ${t.border}`,
        boxShadow: t.shadow,
        display: 'flex', flexDirection: 'column',
        animation: 'ff-slide 200ms cubic-bezier(0.2,0.8,0.2,1)',
      }}>
        <div style={{ padding: '14px 18px', borderBottom: `0.5px solid ${t.borderSoft}`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 7,
            background: mesa.status === 'livre' ? t.bgSubtle : t.accentBg,
            display: 'grid', placeItems: 'center',
          }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: mesa.status === 'livre' ? t.textDim : t.accentText, ...MONO }}>
              {String(mesa.numero).padStart(2, '0')}
            </span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>Mesa {mesa.numero}</div>
            <div style={{ fontSize: 11.5, color: t.textMuted }}>{statusLabel(mesa.status)}{pedido ? ` · #${pedido.id} · ${pedido.criado} atrás` : ''}</div>
          </div>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: 5, border: 0, background: 'transparent', cursor: 'pointer',
          }}><Icon name="close" size={14} stroke={t.textDim}/></button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 18 }}>
          {pedido ? (
            <>
              <div style={{ fontSize: 10.5, color: t.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 8 }}>
                Itens · {(pedido.items || []).length}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {(pedido.items || []).map((it, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '10px 0', borderBottom: i < pedido.items.length - 1 ? `0.5px solid ${t.borderSoft}` : 'none',
                  }}>
                    <span style={{ fontSize: 11, color: t.textMuted, ...MONO, width: 28 }}>{it.quantidade}×</span>
                    <span style={{ flex: 1, fontSize: 12.5, color: t.text }}>{it.nome}</span>
                    <span style={{ fontSize: 12, color: t.textDim, ...MONO }}>
                      {FMT_BRL(it.quantidade * it.preco_unit)}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 18, padding: '12px 14px', background: t.bgSubtle, borderRadius: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: t.textDim, marginBottom: 4 }}>
                  <span>Subtotal</span><span style={MONO}>{FMT_BRL(pedido.total)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: t.textDim, marginBottom: 6 }}>
                  <span>Taxa serviço (10%)</span><span style={MONO}>{FMT_BRL(pedido.total * 0.1)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 600, color: t.text, paddingTop: 6, borderTop: `0.5px solid ${t.border}` }}>
                  <span>Total</span><span style={MONO}>{FMT_BRL(pedido.total * 1.1)}</span>
                </div>
              </div>
            </>
          ) : (
            <div style={{
              padding: '40px 20px', textAlign: 'center',
              border: `0.5px dashed ${t.border}`, borderRadius: 8,
              color: t.textMuted, fontSize: 12.5,
            }}>
              <Icon name="grid" size={20} stroke={t.textMuted} style={{ marginBottom: 6 }}/>
              <div>Esta mesa está livre.</div>
              <div style={{ marginTop: 4 }}>Abra um pedido para começar.</div>
            </div>
          )}
        </div>

        <div style={{ padding: 14, borderTop: `0.5px solid ${t.borderSoft}`, display: 'flex', gap: 8 }}>
          {pedido ? (
            <>
              <Btn t={t} kind="default" size="md" icon="plus" onClick={onAbrir}>Adicionar</Btn>
              <Btn t={t} kind="primary" size="md" icon="cash" onClick={onFechar} style={{ flex: 1 }}>Fechar conta</Btn>
            </>
          ) : (
            <Btn t={t} kind="primary" size="md" icon="plus" onClick={onAbrir} style={{ flex: 1 }}>Abrir novo pedido</Btn>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Pedidos
// ─────────────────────────────────────────────────────────────────────────────

export function PedidosPage({ t, data, setData, refresh, onToast }) {
  const [tab, setTab] = React.useState('balcao');
  const [cart, setCart] = React.useState([]);
  const [endereco, setEndereco] = React.useState('');
  const [cat, setCat] = React.useState('Pizzas');
  const [submitting, setSubmitting] = React.useState(false);

  const cats = [...new Set((data.produtos || []).map(p => p.categoria))];
  const total = cart.reduce((s, it) => s + it.quantidade * it.preco, 0);

  const add = (prod) => {
    setCart(c => {
      const existing = c.find(x => x.id === prod.id);
      if (existing) return c.map(x => x.id === prod.id ? { ...x, quantidade: x.quantidade + 1 } : x);
      return [...c, { id: prod.id, nome: prod.nome, preco: prod.preco, quantidade: 1 }];
    });
  };
  const inc = (id, delta) => setCart(c => c.map(x => x.id === id ? { ...x, quantidade: Math.max(0, x.quantidade + delta) } : x).filter(x => x.quantidade > 0));
  const rm = (id) => setCart(c => c.filter(x => x.id !== id));

  const submit = async () => {
    if (cart.length === 0) return;
    if (tab === 'delivery' && !endereco.trim()) return;
    setSubmitting(true);
    try {
      const body = {
        tipo: tab,
        endereco: tab === 'delivery' ? endereco : null,
        mesa_id: null,
        items: cart.map(c => ({ produto_id: c.id, quantidade: c.quantidade, preco_unit: c.preco })),
      };
      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const newOrder = await res.json();
        setData(d => ({ ...d, pedidos: [newOrder, ...(d.pedidos || [])] }));
        setCart([]);
        setEndereco('');
        if (onToast) onToast(`🖨️ Comanda #${newOrder.id} enviada para a cozinha`);
        if (refresh) refresh();
      }
    } catch {
      // fallback: add locally
      const newOrder = {
        id: 2050 + Math.floor(Math.random() * 100),
        tipo: tab,
        mesa_id: null,
        endereco: tab === 'delivery' ? endereco : null,
        status: 'aberto',
        items: cart.map(c => ({ produto_id: c.id, nome: c.nome, quantidade: c.quantidade, preco_unit: c.preco })),
        total,
        criado: '01 min',
      };
      setData(d => ({ ...d, pedidos: [newOrder, ...(d.pedidos || [])] }));
      setCart([]);
      setEndereco('');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = (data.produtos || []).filter(p => p.categoria === cat);

  return (
    <div style={{ padding: 20, display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16, height: 'calc(100% - 40px)' }}>
      <Panel t={t} padding={false} style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div style={{ display: 'flex', borderBottom: `0.5px solid ${t.borderSoft}`, padding: '0 14px' }}>
          {[
            { k: 'balcao', label: 'Balcão', icon: 'counter' },
            { k: 'delivery', label: 'Delivery', icon: 'motorcycle' },
          ].map(x => {
            const active = tab === x.k;
            return (
              <button key={x.k} onClick={() => setTab(x.k)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  height: 42, padding: '0 14px',
                  background: 'transparent', border: 0, cursor: 'pointer',
                  fontFamily: 'inherit', fontSize: 12.5, fontWeight: active ? 600 : 450,
                  color: active ? t.text : t.textDim,
                  borderBottom: active ? `2px solid ${t.accent}` : '2px solid transparent',
                  marginBottom: -0.5,
                }}>
                <Icon name={x.icon} size={14} stroke={active ? t.text : t.textDim} sw={1.6}/>
                {x.label}
              </button>
            );
          })}
          <div style={{ flex: 1 }}/>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 0' }}>
            <Icon name="search" size={13} stroke={t.textMuted}/>
            <input placeholder="Filtrar produtos..." style={{
              border: 0, background: 'transparent', color: t.text,
              fontSize: 12, fontFamily: 'inherit', outline: 'none', width: 140,
            }}/>
          </div>
        </div>

        <div style={{ padding: '12px 14px', display: 'flex', gap: 6, flexWrap: 'wrap', borderBottom: `0.5px solid ${t.borderSoft}` }}>
          {cats.map(c => {
            const active = cat === c;
            return (
              <button key={c} onClick={() => setCat(c)}
                style={{
                  padding: '4px 10px', borderRadius: 4,
                  background: active ? t.accentBg : 'transparent',
                  color: active ? t.accentText : t.textDim,
                  border: `0.5px solid ${active ? 'transparent' : t.border}`,
                  cursor: 'pointer', fontSize: 11.5, fontFamily: 'inherit', fontWeight: 500,
                }}>{c}</button>
            );
          })}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8 }}>
            {filtered.map(p => (
              <button key={p.id} onClick={() => add(p)}
                style={{
                  padding: '12px 12px',
                  background: t.bgPanel,
                  border: `0.5px solid ${t.border}`,
                  borderRadius: 6, cursor: 'pointer', textAlign: 'left',
                  fontFamily: 'inherit',
                  display: 'flex', flexDirection: 'column', gap: 4,
                  transition: 'all 80ms',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.background = t.accentSoft; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.background = t.bgPanel; }}>
                <div style={{
                  height: 56, marginBottom: 6,
                  background: `repeating-linear-gradient(45deg, ${t.bgSubtle}, ${t.bgSubtle} 6px, ${t.borderSoft} 6px, ${t.borderSoft} 7px)`,
                  borderRadius: 4,
                  display: 'grid', placeItems: 'center',
                  color: t.textMuted, fontSize: 9.5, ...MONO, letterSpacing: '0.05em',
                }}>{p.categoria.toUpperCase()}</div>
                <span style={{ fontSize: 12, fontWeight: 500, color: t.text, lineHeight: 1.25 }}>{p.nome}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: t.accentText, ...MONO }}>{FMT_BRL(p.preco)}</span>
              </button>
            ))}
          </div>
        </div>
      </Panel>

      <Panel t={t} padding={false} style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div style={{ padding: '14px 16px 12px', borderBottom: `0.5px solid ${t.borderSoft}` }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: t.text }}>
            Novo pedido · {tipoLabel(tab)}
          </div>
          <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>
            {cart.length === 0 ? 'Adicione produtos para começar' : `${cart.reduce((s,c)=>s+c.quantidade,0)} ${cart.reduce((s,c)=>s+c.quantidade,0)===1 ? 'item' : 'itens'}`}
          </div>
        </div>

        {tab === 'delivery' && (
          <div style={{ padding: '12px 16px', borderBottom: `0.5px solid ${t.borderSoft}` }}>
            <div style={{ fontSize: 10.5, color: t.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 4 }}>
              Endereço
            </div>
            <input value={endereco} onChange={(e) => setEndereco(e.target.value)}
              placeholder="R., nº, complemento" style={{
                width: '100%', height: 30, padding: '0 8px',
                background: t.bgSubtle, border: `0.5px solid ${t.border}`,
                borderRadius: 5, color: t.text, fontSize: 12, fontFamily: 'inherit', outline: 'none',
                boxSizing: 'border-box',
              }}/>
          </div>
        )}

        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 8px' }}>
          {cart.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: t.textMuted, fontSize: 12 }}>
              <Icon name="bag" size={20} stroke={t.textMuted} style={{ marginBottom: 6 }}/>
              <div>Carrinho vazio</div>
            </div>
          ) : cart.map(it => (
            <div key={it.id} style={{
              padding: '10px 10px', display: 'flex', alignItems: 'center', gap: 8,
              borderBottom: `0.5px solid ${t.borderSoft}`,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 500, color: t.text, lineHeight: 1.3 }}>{it.nome}</div>
                <div style={{ fontSize: 11, color: t.textMuted, ...MONO, marginTop: 1 }}>{FMT_BRL(it.preco)} cada</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: `0.5px solid ${t.border}`, borderRadius: 5 }}>
                <button onClick={() => inc(it.id, -1)} style={{ width: 24, height: 24, border: 0, background: 'transparent', cursor: 'pointer', display: 'grid', placeItems: 'center', color: t.textDim }}>
                  <Icon name="minus" size={11}/>
                </button>
                <span style={{ fontSize: 12, fontWeight: 600, color: t.text, ...MONO, minWidth: 22, textAlign: 'center' }}>{it.quantidade}</span>
                <button onClick={() => inc(it.id, 1)} style={{ width: 24, height: 24, border: 0, background: 'transparent', cursor: 'pointer', display: 'grid', placeItems: 'center', color: t.textDim }}>
                  <Icon name="plus" size={11}/>
                </button>
              </div>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: t.text, ...MONO, minWidth: 64, textAlign: 'right' }}>
                {FMT_BRL(it.preco * it.quantidade)}
              </span>
              <button onClick={() => rm(it.id)} style={{ width: 22, height: 22, border: 0, background: 'transparent', cursor: 'pointer', display: 'grid', placeItems: 'center', color: t.textMuted }}>
                <Icon name="trash" size={12}/>
              </button>
            </div>
          ))}
        </div>

        <div style={{ padding: '14px 16px', borderTop: `0.5px solid ${t.borderSoft}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: t.textDim, marginBottom: 8 }}>
            <span>Subtotal · {cart.reduce((s,c)=>s+c.quantidade,0)} itens</span>
            <span style={MONO}>{FMT_BRL(total)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 12 }}>
            <span>Total</span>
            <span style={MONO}>{FMT_BRL(total)}</span>
          </div>
          <Btn t={t} kind="primary" size="lg" icon="check" onClick={submit}
            disabled={submitting || cart.length === 0 || (tab === 'delivery' && !endereco.trim())}
            style={{ width: '100%' }}>
            {submitting ? 'Enviando…' : 'Confirmar pedido'}
          </Btn>
        </div>
      </Panel>
    </div>
  );
}
