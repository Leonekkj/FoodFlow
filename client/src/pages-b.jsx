// pages-b.jsx — Caixa, Relatórios, Unidades pages.

import React from 'react'
import { Icon, Badge, Btn, MONO, statusToTone, tipoLabel, tipoIcon } from './atoms.jsx'
import { Panel, PanelHeader } from './shell.jsx'
import { FMT_BRL, FMT_INT } from './data.jsx'
import { MetricCard } from './pages-a.jsx'

// ─────────────────────────────────────────────────────────────────────────────
// Caixa
// ─────────────────────────────────────────────────────────────────────────────

export function CaixaPage({ t, data, setData, refresh }) {
  const [openId, setOpenId] = React.useState(null);
  const [pagto, setPagto] = React.useState('pix');
  const [pessoas, setPessoas] = React.useState(1);
  const [submitting, setSubmitting] = React.useState(false);

  const ativos = (data.pedidos || []).filter(p => p.status !== 'fechado');
  const open = ativos.find(p => p.id === openId);
  const totalReceita = ativos.reduce((s, p) => s + p.total, 0);

  const fechar = async () => {
    if (!open) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/caixa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pedido_id: open.id, forma_pagto: pagto, valor: open.total }),
      });
      if (res.ok && refresh) {
        await refresh();
      }
    } catch {
      // fallback: update locally
      setData(d => ({
        ...d,
        pedidos: (d.pedidos || []).filter(p => p.id !== open.id),
        mesas: (d.mesas || []).map(m => m.id === open.mesa_id ? { ...m, status: 'livre' } : m),
      }));
    } finally {
      setOpenId(null);
      setPessoas(1);
      setSubmitting(false);
    }
  };

  const PAYS = [
    { k: 'pix',            label: 'Pix',      icon: 'pix' },
    { k: 'cartao_credito', label: 'Crédito',  icon: 'cardCC' },
    { k: 'cartao_debito',  label: 'Débito',   icon: 'cardCC' },
    { k: 'dinheiro',       label: 'Dinheiro', icon: 'cash' },
  ];

  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <MetricCard t={t} label="Em aberto" value={`${ativos.length}`} sub="contas ativas"/>
        <MetricCard t={t} label="A receber" value={FMT_BRL(totalReceita)} sub="todas as contas"/>
        <MetricCard t={t} label="Fechadas hoje" value={String(data.caixaHoje?.fechadas ?? 0)} sub={`${FMT_BRL(data.caixaHoje?.valorRecebido ?? 0)} recebidos`}/>
        <MetricCard t={t} label="Tempo médio" value="—" sub="da abertura ao fechamento"/>
      </div>

      <Panel t={t} padding={false}>
        <div style={{
          display: 'grid', gridTemplateColumns: '40px 1fr 110px 1fr 90px 100px 80px',
          padding: '10px 14px', gap: 12,
          borderBottom: `0.5px solid ${t.border}`,
          fontSize: 10.5, fontWeight: 500, color: t.textMuted,
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          <span>#</span><span>Pedido</span><span>Tipo</span><span>Itens</span><span>Aberto</span><span style={{ textAlign: 'right' }}>Total</span><span/>
        </div>
        {ativos.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: t.textMuted, fontSize: 12.5 }}>
            Nenhuma conta em aberto.
          </div>
        ) : ativos.map(p => (
          <div key={p.id} onClick={() => setOpenId(p.id)} style={{
            display: 'grid', gridTemplateColumns: '40px 1fr 110px 1fr 90px 100px 80px',
            padding: '10px 14px', gap: 12,
            borderBottom: `0.5px solid ${t.borderSoft}`,
            fontSize: 12, color: t.text,
            cursor: 'pointer', alignItems: 'center',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = t.bgHover}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            <span style={{ ...MONO, color: t.textMuted, fontSize: 11 }}>#{p.id}</span>
            <span style={{ fontWeight: 500 }}>
              {p.tipo === 'mesa' ? `Mesa ${p.mesa_id}` : p.tipo === 'delivery' ? p.endereco : 'Balcão'}
            </span>
            <Badge t={t} tone={statusToTone(p.tipo === 'mesa' ? 'ocupada' : 'aberto')}>
              <Icon name={tipoIcon(p.tipo)} size={11}/>{tipoLabel(p.tipo)}
            </Badge>
            <span style={{ color: t.textDim, fontSize: 11.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {(p.items || []).map(it => `${it.quantidade}× ${it.nome}`).join(', ')}
            </span>
            <span style={{ ...MONO, fontSize: 11, color: t.textMuted }}>{p.criado}</span>
            <span style={{ ...MONO, fontWeight: 600, textAlign: 'right' }}>{FMT_BRL(p.total)}</span>
            <Btn t={t} size="sm" kind="default" style={{ justifySelf: 'end' }}>Fechar</Btn>
          </div>
        ))}
      </Panel>

      {open && (
        <div onClick={() => setOpenId(null)} style={{
          position: 'absolute', inset: 0, zIndex: 40,
          background: 'rgba(0,0,0,0.32)',
          display: 'grid', placeItems: 'center',
          animation: 'ff-fade 120ms',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            width: 520, maxHeight: '90%',
            background: t.bgPanel,
            border: `0.5px solid ${t.border}`,
            borderRadius: 10, boxShadow: t.shadow,
            display: 'flex', flexDirection: 'column',
            animation: 'ff-pop 160ms cubic-bezier(0.2,0.9,0.2,1)',
          }}>
            <div style={{ padding: '16px 20px', borderBottom: `0.5px solid ${t.borderSoft}`, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>Fechar conta · #{open.id}</div>
                <div style={{ fontSize: 11.5, color: t.textMuted, marginTop: 2 }}>
                  {open.tipo === 'mesa' ? `Mesa ${open.mesa_id}` : tipoLabel(open.tipo)} · aberto há {open.criado}
                </div>
              </div>
              <button onClick={() => setOpenId(null)} style={{
                width: 28, height: 28, borderRadius: 5, border: 0, background: 'transparent', cursor: 'pointer',
              }}><Icon name="close" size={14} stroke={t.textDim}/></button>
            </div>

            <div style={{ padding: '14px 20px', maxHeight: 220, overflowY: 'auto' }}>
              {(open.items || []).map((it, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 0',
                  borderBottom: i < open.items.length - 1 ? `0.5px solid ${t.borderSoft}` : 'none',
                }}>
                  <span style={{ ...MONO, fontSize: 11, color: t.textMuted, width: 28 }}>{it.quantidade}×</span>
                  <span style={{ flex: 1, fontSize: 12.5, color: t.text }}>{it.nome}</span>
                  <span style={{ ...MONO, fontSize: 12, color: t.textDim }}>{FMT_BRL(it.quantidade * it.preco_unit)}</span>
                </div>
              ))}
            </div>

            <div style={{ padding: '12px 20px', background: t.bgSubtle, borderTop: `0.5px solid ${t.borderSoft}`, borderBottom: `0.5px solid ${t.borderSoft}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 600, color: t.text }}>
                <span>Total</span>
                <span style={MONO}>{FMT_BRL(open.total)}</span>
              </div>
            </div>

            <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <div style={{ fontSize: 10.5, color: t.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 6 }}>
                  Forma de pagamento
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                  {PAYS.map(pay => {
                    const active = pagto === pay.k;
                    return (
                      <button key={pay.k} onClick={() => setPagto(pay.k)} style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                        padding: '10px 6px',
                        background: active ? t.accentBg : t.bgPanel,
                        border: `0.5px solid ${active ? t.accent : t.border}`,
                        borderRadius: 6, cursor: 'pointer',
                        fontFamily: 'inherit', fontSize: 11.5, fontWeight: 500,
                        color: active ? t.accentText : t.text,
                      }}>
                        <Icon name={pay.icon} size={16} stroke={active ? t.accentText : t.textDim} sw={1.6}/>
                        {pay.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 10.5, color: t.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500 }}>
                    Dividir conta
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: `0.5px solid ${t.border}`, borderRadius: 5 }}>
                    <button onClick={() => setPessoas(Math.max(1, pessoas - 1))} style={{ width: 26, height: 26, border: 0, background: 'transparent', cursor: 'pointer', color: t.textDim }}>
                      <Icon name="minus" size={11}/>
                    </button>
                    <span style={{ ...MONO, fontSize: 12, fontWeight: 600, color: t.text, minWidth: 32, textAlign: 'center' }}>
                      {pessoas} {pessoas === 1 ? 'pessoa' : 'pessoas'}
                    </span>
                    <button onClick={() => setPessoas(pessoas + 1)} style={{ width: 26, height: 26, border: 0, background: 'transparent', cursor: 'pointer', color: t.textDim }}>
                      <Icon name="plus" size={11}/>
                    </button>
                  </div>
                </div>
                {pessoas > 1 && (
                  <div style={{
                    padding: '8px 12px', background: t.accentSoft, borderRadius: 5,
                    fontSize: 11.5, color: t.accentText,
                    display: 'flex', justifyContent: 'space-between',
                  }}>
                    <span>Por pessoa</span>
                    <span style={{ ...MONO, fontWeight: 600 }}>{FMT_BRL(open.total / pessoas)}</span>
                  </div>
                )}
              </div>
            </div>

            <div style={{ padding: 14, borderTop: `0.5px solid ${t.borderSoft}`, display: 'flex', gap: 8 }}>
              <Btn t={t} kind="ghost" onClick={() => setOpenId(null)}>Cancelar</Btn>
              <div style={{ flex: 1 }}/>
              <Btn t={t} kind="primary" icon="check" onClick={fechar} disabled={submitting}>
                {submitting ? 'Processando…' : `Receber ${FMT_BRL(open.total)}`}
              </Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Relatórios
// ─────────────────────────────────────────────────────────────────────────────

export function LineChart({ t, data, h = 180 }) {
  const max = Math.max(...data.map(d => d.valor), 1);
  const min = Math.min(...data.map(d => d.valor));
  const W = 600, H = h, P = 24;
  const xs = (i) => P + (i / Math.max(1, data.length - 1)) * (W - 2 * P);
  const ys = (v) => H - P - ((v - min) / Math.max(1, max - min)) * (H - 2 * P);

  const pts = data.map((d, i) => `${xs(i)},${ys(d.valor)}`).join(' ');
  const area = `M ${xs(0)},${H - P} L ${pts.split(' ').join(' L ')} L ${xs(data.length - 1)},${H - P} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: h, display: 'block' }}>
      {[0, 0.25, 0.5, 0.75, 1].map(f => (
        <line key={f} x1={P} x2={W - P} y1={P + f * (H - 2 * P)} y2={P + f * (H - 2 * P)} stroke={t.borderSoft} strokeWidth={0.5}/>
      ))}
      <path d={area} fill={t.accentBg}/>
      <polyline points={pts} fill="none" stroke={t.accent} strokeWidth={1.5}/>
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={xs(i)} cy={ys(d.valor)} r={3} fill={t.bgPanel} stroke={t.accent} strokeWidth={1.5}/>
          <text x={xs(i)} y={H - 6} textAnchor="middle" fontSize={10} fill={t.textMuted}
            fontFamily="ui-monospace, Menlo, monospace">{d.dia}</text>
        </g>
      ))}
    </svg>
  );
}

function PieChart({ t, items }) {
  const total = items.reduce((s, i) => s + i.val, 0) || 1;
  let acc = 0;
  const R = 50, S = 22, C = 60;
  const arc = (start, end, r) => {
    const a0 = (start - 0.25) * 2 * Math.PI;
    const a1 = (end - 0.25) * 2 * Math.PI;
    const x0 = C + r * Math.cos(a0), y0 = C + r * Math.sin(a0);
    const x1 = C + r * Math.cos(a1), y1 = C + r * Math.sin(a1);
    const large = end - start > 0.5 ? 1 : 0;
    return `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`;
  };
  return (
    <svg viewBox="0 0 120 120" style={{ width: 120, height: 120 }}>
      {items.map((it, i) => {
        const start = acc / total;
        acc += it.val;
        const end = acc / total;
        return <path key={i} d={arc(start, end, R)} fill="none" stroke={it.color} strokeWidth={S} strokeLinecap="butt"/>;
      })}
    </svg>
  );
}

export function RelatoriosPage({ t, data }) {
  const [period, setPeriod] = React.useState('hoje');
  const PERIODS = ['Hoje', '7 dias', 'Mês', 'Personalizado'];
  const MESES_PT = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  const today = new Date();
  const weekAgo = new Date(today); weekAgo.setDate(weekAgo.getDate() - 6);
  const fmtD = (d) => `${d.getDate()} ${MESES_PT[d.getMonth()]}`;
  const dateRange = `${fmtD(weekAgo)} — ${fmtD(today)} ${today.getFullYear()}`;

  const channelItems = [
    { label: 'Mesa',     val: (data.porCanal || {}).mesa     || 0, color: t.accent },
    { label: 'Balcão',   val: (data.porCanal || {}).balcao   || 0, color: t.warning },
    { label: 'Delivery', val: (data.porCanal || {}).delivery || 0, color: t.success },
  ];
  const totalCanal = channelItems.reduce((s, i) => s + i.val, 0);
  const melhorCanal = channelItems.reduce((a, b) => a.val >= b.val ? a : b, channelItems[0]);

  const topByReceita = [...(data.topProdutos || [])].sort((a, b) => b.receita - a.receita);
  const maxReceita = Math.max(1, ...topByReceita.map(p => p.receita));

  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          display: 'flex', padding: 2, background: t.bgPanel,
          border: `0.5px solid ${t.border}`, borderRadius: 6,
        }}>
          {PERIODS.map((p, i) => {
            const k = ['hoje', 'semana', 'mes', 'custom'][i];
            const active = period === k;
            return (
              <button key={k} onClick={() => setPeriod(k)} style={{
                padding: '5px 12px', borderRadius: 4, border: 0, background: active ? t.bgHover : 'transparent',
                fontFamily: 'inherit', fontSize: 11.5, fontWeight: active ? 600 : 450,
                color: active ? t.text : t.textDim, cursor: 'pointer',
              }}>{p}</button>
            );
          })}
        </div>
        <Btn t={t} icon="calendar" size="sm">{dateRange}</Btn>
        <div style={{ flex: 1 }}/>
        <Btn t={t} icon="filter" size="sm" kind="ghost">Filtros</Btn>
        <Btn t={t} size="sm">Exportar CSV</Btn>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <MetricCard t={t} hero label="Receita" value={FMT_BRL(data.metrics?.receita || 0)} trend={14.2} sub="vs. semana anterior"/>
        <MetricCard t={t} label="Pedidos" value={FMT_INT(data.metrics?.pedidos || 0)} trend={9.4} sub={`ticket médio ${FMT_BRL(data.metrics?.ticketMedio || 0)}`}/>
        <MetricCard t={t} label="Ticket médio" value={FMT_BRL(data.metrics?.ticketMedio || 0)} trend={4.8} sub="por pedido"/>
        <MetricCard t={t} label="Melhor canal" value={melhorCanal.label} sub={`${Math.round((melhorCanal.val / Math.max(1, totalCanal)) * 100)}% da receita`}/>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 12 }}>
        <Panel t={t}>
          <PanelHeader t={t} title="Receita no período" sub="Últimos 7 dias"/>
          <LineChart t={t} data={data.historico || []}/>
        </Panel>
        <Panel t={t}>
          <PanelHeader t={t} title="Pedidos por canal" sub="Distribuição absoluta"/>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, paddingTop: 4 }}>
            <PieChart t={t} items={channelItems}/>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {channelItems.map(i => (
                <div key={i.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: i.color }}/>
                  <span style={{ flex: 1, fontSize: 12, color: t.text }}>{i.label}</span>
                  <span style={{ fontSize: 11, color: t.textMuted, ...MONO }}>
                    {totalCanal > 0 ? Math.round((i.val / totalCanal) * 100) : 0}%
                  </span>
                  <span style={{ fontSize: 11.5, color: t.text, ...MONO, minWidth: 64, textAlign: 'right' }}>{FMT_BRL(i.val)}</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      <Panel t={t} padding={false}>
        <PanelHeader t={t} title="Top produtos por receita" sub="Ranking do período" style={{ padding: '14px 16px 12px', margin: 0 }}/>
        <div style={{ padding: 4 }}>
          {topByReceita.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', color: t.textMuted, fontSize: 12 }}>Sem dados</div>
          ) : topByReceita.map((p, i) => {
            const pct = (p.receita / maxReceita) * 100;
            return (
              <div key={p.id} style={{
                display: 'grid', gridTemplateColumns: '32px 1fr 80px 80px',
                alignItems: 'center', gap: 12, padding: '10px 16px',
                borderTop: i > 0 ? `0.5px solid ${t.borderSoft}` : 'none',
              }}>
                <span style={{ ...MONO, fontSize: 11, color: t.textMuted }}>{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <div style={{ fontSize: 12.5, color: t.text, fontWeight: 500, marginBottom: 4 }}>{p.nome}</div>
                  <div style={{ height: 3, background: t.bgSubtle, borderRadius: 2, overflow: 'hidden', maxWidth: 320 }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: t.accent }}/>
                  </div>
                </div>
                <span style={{ ...MONO, fontSize: 11.5, color: t.textDim, textAlign: 'right' }}>{p.qtd} un</span>
                <span style={{ ...MONO, fontSize: 12, fontWeight: 600, color: t.text, textAlign: 'right' }}>{FMT_BRL(p.receita)}</span>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Unidades
// ─────────────────────────────────────────────────────────────────────────────

export function UnidadesPage({ t, data }) {
  const totalReceita = (data.unidades || []).reduce((s, u) => s + (u.receita || 0), 0);

  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <MetricCard t={t} hero label="Receita consolidada" value={FMT_BRL(totalReceita)} trend={11.8} sub={`hoje · ${(data.unidades || []).length} unidades`}/>
        <MetricCard t={t} label="Unidades ativas" value={`${(data.unidades || []).filter(u=>u.ativo).length}/${(data.unidades || []).length}`} sub="1 inativa"/>
        <MetricCard t={t} label="Mesas em operação" value={FMT_INT((data.unidades || []).reduce((s,u)=>s+(u.mesasAbertas||0),0))} sub="agora"/>
        <MetricCard t={t} label="Pedidos ativos" value={FMT_INT((data.unidades || []).reduce((s,u)=>s+(u.pedidosAtivos||0),0))} sub="todos os canais"/>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        {(data.unidades || []).map(u => (
          <Panel t={t} key={u.id} padding={false}>
            <div style={{ padding: 16, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 8,
                background: u.ativo ? t.accentBg : t.bgSubtle,
                display: 'grid', placeItems: 'center', flexShrink: 0,
              }}>
                <Icon name="building" size={20} stroke={u.ativo ? t.accentText : t.textMuted} sw={1.5}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{u.nome}</span>
                  {u.ativo ? <Badge t={t} tone="success">Ativa</Badge> : <Badge t={t} tone="neutral">Inativa</Badge>}
                </div>
                <div style={{ fontSize: 11.5, color: t.textMuted, marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Icon name="pin" size={11} stroke={t.textMuted}/>{u.endereco}
                </div>
              </div>
              <Btn t={t} size="sm" kind="ghost" icon="more"></Btn>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: `0.5px solid ${t.borderSoft}` }}>
              {[
                { label: 'Receita',        val: FMT_BRL(u.receita || 0),       main: true },
                { label: 'Mesas abertas',  val: u.mesasAbertas  || 0 },
                { label: 'Pedidos ativos', val: u.pedidosAtivos || 0 },
              ].map((m, i) => (
                <div key={i} style={{ padding: '12px 16px', borderRight: i < 2 ? `0.5px solid ${t.borderSoft}` : 'none' }}>
                  <div style={{ fontSize: 10.5, color: t.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500 }}>
                    {m.label}
                  </div>
                  <div style={{ fontSize: m.main ? 16 : 14, fontWeight: 600, color: u.ativo ? t.text : t.textMuted, marginTop: 3, ...MONO, letterSpacing: '-0.01em' }}>
                    {m.val}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
