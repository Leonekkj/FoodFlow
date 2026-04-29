// mobile.jsx — Compact mobile layout for FoodFlow (bottom tab bar, simplified pages).

import React from 'react'
import { Icon, Badge, StatusDot, MONO, tipoIcon, tipoLabel, statusToTone, statusLabel } from './atoms.jsx'
import { Panel, PanelHeader } from './shell.jsx'
import { FMT_BRL } from './data.jsx'
import { MesaCard } from './pages-a.jsx'
import { LineChart } from './pages-b.jsx'

const DIAS_PT  = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
const MESES_PT = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
function todayLabel() {
  const d = new Date()
  return `${DIAS_PT[d.getDay()]}, ${d.getDate()} de ${MESES_PT[d.getMonth()]}`
}

// ─── Bottom sheet wrapper ─────────────────────────────────────────────────────
function BottomSheet({ t, onClose, children }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(0,0,0,0.38)',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: t.bgPanel, borderTop: `0.5px solid ${t.border}`,
          borderRadius: '12px 12px 0 0',
          maxHeight: '85vh', overflowY: 'auto',
          paddingBottom: 'env(safe-area-inset-bottom, 16px)',
        }}
      >
        <div style={{ width: 36, height: 4, borderRadius: 2, background: t.border, margin: '10px auto 0' }}/>
        {children}
      </div>
    </div>
  )
}

// ─── Tab bar ─────────────────────────────────────────────────────────────────
function MobileTabbar({ t, page, setPage }) {
  const items = [
    { id: 'dashboard',  label: 'Início', icon: 'home' },
    { id: 'mesas',      label: 'Mesas',  icon: 'grid' },
    { id: 'pedidos',    label: 'Pedido', icon: 'plus', primary: true },
    { id: 'caixa',      label: 'Caixa',  icon: 'cash' },
    { id: 'relatorios', label: 'Relat.', icon: 'chart' },
  ]
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      paddingBottom: 'env(safe-area-inset-bottom, 12px)',
      paddingTop: 8,
      background: t.bgPanel, borderTop: `0.5px solid ${t.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
    }}>
      {items.map(i => {
        const active = page === i.id
        if (i.primary) return (
          <button key={i.id} onClick={() => setPage(i.id)} style={{
            width: 44, height: 44, borderRadius: 22,
            background: t.accent, border: 0, cursor: 'pointer',
            display: 'grid', placeItems: 'center',
            boxShadow: '0 4px 12px rgba(24,95,165,0.32)',
          }}>
            <Icon name={i.icon} size={20} stroke="#fff" sw={2}/>
          </button>
        )
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
        )
      })}
    </div>
  )
}

// ─── Header ──────────────────────────────────────────────────────────────────
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
  )
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
function MobileDash({ t, data }) {
  const m = data.metrics || {}
  return (
    <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ background: t.accent, color: '#fff', borderRadius: 10, padding: '14px 16px' }}>
        <div style={{ fontSize: 10.5, letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.78 }}>Receita do dia</div>
        <div style={{ fontSize: 24, fontWeight: 600, ...MONO, letterSpacing: '-0.02em', marginTop: 2 }}>{FMT_BRL(m.receita || 0)}</div>
        <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Icon name="arrowUp" size={11} sw={2}/>Ticket médio {FMT_BRL(m.ticketMedio || 0)}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <Panel t={t} style={{ padding: 12 }}>
          <div style={{ fontSize: 10, color: t.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500 }}>Pedidos</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: t.text, ...MONO, marginTop: 2 }}>{m.pedidos || 0}</div>
        </Panel>
        <Panel t={t} style={{ padding: 12 }}>
          <div style={{ fontSize: 10, color: t.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500 }}>Mesas abertas</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: t.text, ...MONO, marginTop: 2 }}>{m.mesasAbertas || 0}/{(data.mesas || []).length}</div>
        </Panel>
      </div>
      <Panel t={t} padding={false}>
        <div style={{ padding: '12px 14px 8px', display: 'flex', alignItems: 'center' }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: t.text, flex: 1 }}>Pedidos ativos</div>
        </div>
        {(data.pedidos || []).slice(0, 4).map(o => (
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
  )
}

// ─── Mesas ───────────────────────────────────────────────────────────────────
function MobileMesas({ t, data, refresh, setPage }) {
  const [openMesa, setOpenMesa] = React.useState(null)
  const [closing, setClosing] = React.useState(false)

  const totals = {}
  ;(data.pedidos || []).forEach(p => { if (p.mesa_id) totals[p.mesa_id] = (totals[p.mesa_id] || 0) + p.total })

  const pedido = openMesa ? (data.pedidos || []).find(p => p.mesa_id === openMesa.id && p.status !== 'fechado') : null

  const fecharConta = async () => {
    if (!pedido) return
    setClosing(true)
    try {
      await fetch('/api/caixa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pedido_id: pedido.id, forma_pagto: 'dinheiro', valor: pedido.total }),
      })
      if (refresh) await refresh()
      setOpenMesa(null)
    } finally {
      setClosing(false)
    }
  }

  return (
    <div style={{ padding: 14 }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        {[
          { k: 'ocupada',    label: 'Ocupadas', color: t.accent },
          { k: 'aguardando', label: 'Aguard.',  color: t.warning },
          { k: 'livre',      label: 'Livres',   color: t.textMuted },
        ].map(s => {
          const n = (data.mesas || []).filter(m => m.status === s.k).length
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
          )
        })}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {(data.mesas || []).map(m => (
          <MesaCard key={m.id} t={t} mesa={m} total={totals[m.id]} onClick={() => setOpenMesa(m)}/>
        ))}
      </div>

      {openMesa && (
        <BottomSheet t={t} onClose={() => setOpenMesa(null)}>
          <div style={{ padding: '12px 16px', borderBottom: `0.5px solid ${t.borderSoft}`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8, background: t.accentBg,
              display: 'grid', placeItems: 'center',
            }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: t.accentText, ...MONO }}>{String(openMesa.numero).padStart(2,'0')}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>Mesa {openMesa.numero}</div>
              <div style={{ fontSize: 11.5, color: t.textMuted }}>{statusLabel(openMesa.status)}{pedido ? ` · #${pedido.id} · ${pedido.criado} atrás` : ''}</div>
            </div>
          </div>

          <div style={{ padding: 16 }}>
            {pedido ? (
              <>
                <div style={{ fontSize: 10.5, color: t.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 8 }}>
                  Itens · {(pedido.items || []).length}
                </div>
                {(pedido.items || []).map((it, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '9px 0', borderBottom: i < pedido.items.length - 1 ? `0.5px solid ${t.borderSoft}` : 'none',
                  }}>
                    <span style={{ fontSize: 11, color: t.textMuted, ...MONO, width: 24 }}>{it.quantidade}×</span>
                    <span style={{ flex: 1, fontSize: 12.5, color: t.text }}>{it.nome}</span>
                    <span style={{ fontSize: 12, color: t.textDim, ...MONO }}>{FMT_BRL(it.quantidade * it.preco_unit)}</span>
                  </div>
                ))}
                <div style={{ marginTop: 14, padding: '10px 12px', background: t.bgSubtle, borderRadius: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: t.textDim, marginBottom: 4 }}>
                    <span>Subtotal</span><span style={MONO}>{FMT_BRL(pedido.total)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: t.textDim, paddingTop: 6, borderTop: `0.5px solid ${t.border}`, fontWeight: 600 }}>
                    <span>Total</span><span style={{ ...MONO, color: t.text }}>{FMT_BRL(pedido.total * 1.1)}</span>
                  </div>
                </div>
                <button
                  onClick={fecharConta}
                  disabled={closing}
                  style={{
                    marginTop: 14, width: '100%', padding: '12px 0',
                    background: t.accent, color: '#fff', border: 0, borderRadius: 8,
                    fontSize: 13.5, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
                    opacity: closing ? 0.6 : 1,
                  }}
                >
                  {closing ? 'Processando…' : `Fechar conta · ${FMT_BRL(pedido.total * 1.1)}`}
                </button>
              </>
            ) : (
              <>
                <div style={{ textAlign: 'center', color: t.textMuted, fontSize: 13, padding: '20px 0' }}>Mesa livre</div>
                <button
                  onClick={() => { setOpenMesa(null); setPage('pedidos') }}
                  style={{
                    width: '100%', padding: '12px 0',
                    background: t.accent, color: '#fff', border: 0, borderRadius: 8,
                    fontSize: 13.5, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
                  }}
                >
                  Abrir novo pedido
                </button>
              </>
            )}
          </div>
        </BottomSheet>
      )}
    </div>
  )
}

// ─── Pedidos ─────────────────────────────────────────────────────────────────
function MobilePedidos({ t, data, refresh, showToast }) {
  const cats = [...new Set((data.produtos || []).map(p => p.categoria))]
  const [cat, setCat] = React.useState(cats[0] || '')
  const [tab, setTab] = React.useState('balcao')
  const [cart, setCart] = React.useState([])
  const [endereco, setEndereco] = React.useState('')
  const [submitting, setSubmitting] = React.useState(false)
  const [success, setSuccess] = React.useState(false)

  const addToCart = (prod) => {
    setCart(c => {
      const ex = c.find(x => x.id === prod.id)
      if (ex) return c.map(x => x.id === prod.id ? { ...x, quantidade: x.quantidade + 1 } : x)
      return [...c, { id: prod.id, nome: prod.nome, preco: prod.preco, quantidade: 1 }]
    })
  }
  const incCart = (id, delta) => setCart(c =>
    c.map(x => x.id === id ? { ...x, quantidade: Math.max(0, x.quantidade + delta) } : x).filter(x => x.quantidade > 0)
  )

  const total = cart.reduce((s, it) => s + it.quantidade * it.preco, 0)
  const count = cart.reduce((s, it) => s + it.quantidade, 0)

  const submit = async () => {
    if (cart.length === 0) return
    if (tab === 'delivery' && !endereco.trim()) return
    setSubmitting(true)
    try {
      await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: tab,
          endereco: tab === 'delivery' ? endereco : null,
          items: cart.map(it => ({ produto_id: it.id, quantidade: it.quantidade, preco_unit: it.preco })),
        }),
      })
      setCart([])
      setEndereco('')
      setSuccess(true)
      if (showToast) showToast('🖨️ Comanda enviada para a cozinha')
      if (refresh) await refresh()
      setTimeout(() => setSuccess(false), 2000)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {/* Tab switcher */}
      <div style={{ padding: '8px 12px 0', display: 'flex', gap: 6, borderBottom: `0.5px solid ${t.borderSoft}` }}>
        {[{ k: 'balcao', label: 'Balcão' }, { k: 'delivery', label: 'Delivery' }].map(({ k, label }) => (
          <button key={k} onClick={() => setTab(k)} style={{
            padding: '5px 14px', borderRadius: 4, border: 0, fontFamily: 'inherit',
            fontSize: 11.5, fontWeight: tab === k ? 600 : 450, cursor: 'pointer',
            background: tab === k ? t.bgHover : 'transparent',
            color: tab === k ? t.text : t.textDim,
          }}>{label}</button>
        ))}
      </div>

      {/* Delivery address */}
      {tab === 'delivery' && (
        <div style={{ padding: '8px 12px', borderBottom: `0.5px solid ${t.borderSoft}` }}>
          <input
            value={endereco}
            onChange={e => setEndereco(e.target.value)}
            placeholder="Endereço de entrega…"
            style={{
              width: '100%', padding: '8px 10px', borderRadius: 6,
              border: `0.5px solid ${t.border}`, background: t.bgSubtle,
              fontSize: 12.5, fontFamily: 'inherit', color: t.text,
              boxSizing: 'border-box', outline: 'none',
            }}
          />
        </div>
      )}

      {/* Category filter */}
      <div style={{ padding: '6px 12px', display: 'flex', gap: 6, overflowX: 'auto', borderBottom: `0.5px solid ${t.borderSoft}` }}>
        {cats.map(c => {
          const active = cat === c
          return (
            <button key={c} onClick={() => setCat(c)} style={{
              padding: '5px 10px', borderRadius: 4, whiteSpace: 'nowrap',
              background: active ? t.accentBg : 'transparent',
              color: active ? t.accentText : t.textDim,
              border: `0.5px solid ${active ? 'transparent' : t.border}`,
              fontSize: 11, fontFamily: 'inherit', fontWeight: 500, cursor: 'pointer',
            }}>{c}</button>
          )
        })}
      </div>

      {/* Products */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 12, paddingBottom: cart.length > 0 ? 80 : 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {(data.produtos || []).filter(p => p.categoria === cat).map(p => {
            const qty = (cart.find(x => x.id === p.id) || {}).quantidade || 0
            return (
              <div key={p.id} style={{
                padding: 10, background: t.bgPanel,
                border: `0.5px solid ${qty > 0 ? t.accent : t.border}`, borderRadius: 7,
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
                  {qty === 0 ? (
                    <button onClick={() => addToCart(p)} style={{
                      width: 22, height: 22, borderRadius: 5, background: t.accent, border: 0, cursor: 'pointer',
                      display: 'grid', placeItems: 'center',
                    }}><Icon name="plus" size={12} stroke="#fff" sw={2}/></button>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <button onClick={() => incCart(p.id, -1)} style={{
                        width: 20, height: 20, borderRadius: 4, background: t.bgSubtle,
                        border: `0.5px solid ${t.border}`, cursor: 'pointer', display: 'grid', placeItems: 'center',
                      }}><Icon name="minus" size={10} stroke={t.textDim} sw={2}/></button>
                      <span style={{ fontSize: 11, fontWeight: 600, color: t.text, ...MONO, minWidth: 12, textAlign: 'center' }}>{qty}</span>
                      <button onClick={() => addToCart(p)} style={{
                        width: 20, height: 20, borderRadius: 4, background: t.accent, border: 0, cursor: 'pointer',
                        display: 'grid', placeItems: 'center',
                      }}><Icon name="plus" size={10} stroke="#fff" sw={2}/></button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Cart footer */}
      {cart.length > 0 && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '10px 12px',
          background: t.bgPanel, borderTop: `0.5px solid ${t.border}`,
        }}>
          <button
            onClick={submit}
            disabled={submitting || success}
            style={{
              width: '100%', padding: '12px 0',
              background: success ? t.success : t.accent, color: '#fff', border: 0, borderRadius: 8,
              fontSize: 13.5, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              opacity: submitting ? 0.7 : 1,
            }}
          >
            <span style={{
              background: 'rgba(255,255,255,0.25)', borderRadius: 10,
              padding: '1px 7px', fontSize: 11, fontWeight: 700,
            }}>{count}</span>
            <span>{success ? 'Pedido enviado!' : submitting ? 'Enviando…' : `Confirmar · ${FMT_BRL(total)}`}</span>
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Caixa ───────────────────────────────────────────────────────────────────
const PAYS = [
  { k: 'pix',            label: 'Pix' },
  { k: 'cartao_credito', label: 'Crédito' },
  { k: 'cartao_debito',  label: 'Débito' },
  { k: 'dinheiro',       label: 'Dinheiro' },
]

function MobileCaixa({ t, data, refresh }) {
  const [openId, setOpenId] = React.useState(null)
  const [pagto, setPagto] = React.useState('pix')
  const [submitting, setSubmitting] = React.useState(false)

  const ativos = (data.pedidos || []).filter(p => p.status !== 'fechado')
  const open = ativos.find(p => p.id === openId)

  const fechar = async () => {
    if (!open) return
    setSubmitting(true)
    try {
      await fetch('/api/caixa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pedido_id: open.id, forma_pagto: pagto, valor: open.total }),
      })
      if (refresh) await refresh()
      setOpenId(null)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {ativos.length === 0 && (
        <div style={{ padding: 40, textAlign: 'center', color: t.textMuted, fontSize: 12.5 }}>
          Nenhuma conta em aberto.
        </div>
      )}
      {ativos.map(p => (
        <div key={p.id} onClick={() => { setOpenId(p.id); setPagto('pix') }} style={{
          padding: 12, background: t.bgPanel,
          border: `0.5px solid ${t.border}`, borderRadius: 8,
          display: 'flex', flexDirection: 'column', gap: 8,
          cursor: 'pointer',
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

      {open && (
        <BottomSheet t={t} onClose={() => setOpenId(null)}>
          <div style={{ padding: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: t.text, marginBottom: 4 }}>
              {open.tipo === 'mesa' ? `Mesa ${open.mesa_id}` : tipoLabel(open.tipo)} · #{open.id}
            </div>
            <div style={{ fontSize: 11.5, color: t.textMuted, marginBottom: 14 }}>{open.criado} atrás</div>

            {(open.items || []).map((it, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 0', borderBottom: `0.5px solid ${t.borderSoft}`,
              }}>
                <span style={{ fontSize: 11, color: t.textMuted, ...MONO, width: 24 }}>{it.quantidade}×</span>
                <span style={{ flex: 1, fontSize: 12.5, color: t.text }}>{it.nome}</span>
                <span style={{ fontSize: 12, color: t.textDim, ...MONO }}>{FMT_BRL(it.quantidade * it.preco_unit)}</span>
              </div>
            ))}

            <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700, color: t.text }}>
              <span>Total</span>
              <span style={MONO}>{FMT_BRL(open.total)}</span>
            </div>

            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 10.5, color: t.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 8 }}>Forma de pagamento</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {PAYS.map(({ k, label }) => (
                  <button key={k} onClick={() => setPagto(k)} style={{
                    padding: '8px 0', borderRadius: 6, border: `0.5px solid ${pagto === k ? t.accent : t.border}`,
                    background: pagto === k ? t.accentBg : t.bgSubtle,
                    color: pagto === k ? t.accentText : t.textDim,
                    fontSize: 12.5, fontWeight: pagto === k ? 600 : 450,
                    fontFamily: 'inherit', cursor: 'pointer',
                  }}>{label}</button>
                ))}
              </div>
            </div>

            <button
              onClick={fechar}
              disabled={submitting}
              style={{
                marginTop: 14, width: '100%', padding: '13px 0',
                background: t.accent, color: '#fff', border: 0, borderRadius: 8,
                fontSize: 14, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
                opacity: submitting ? 0.6 : 1,
              }}
            >
              {submitting ? 'Processando…' : `Receber ${FMT_BRL(open.total)}`}
            </button>
          </div>
        </BottomSheet>
      )}
    </div>
  )
}

// ─── Relatórios ───────────────────────────────────────────────────────────────
function MobileRelat({ t, data }) {
  const [period, setPeriod] = React.useState('hoje')
  const m = data.metrics || {}
  const porCanal = data.porCanal || {}
  const topProdutos = [...(data.topProdutos || [])].sort((a, b) => b.receita - a.receita).slice(0, 5)
  const canalItems = [
    { label: 'Mesa',     val: porCanal.mesa     || 0, color: t.accent },
    { label: 'Balcão',   val: porCanal.balcao   || 0, color: t.warning },
    { label: 'Delivery', val: porCanal.delivery || 0, color: t.success },
  ]
  const totalCanal = canalItems.reduce((s, i) => s + i.val, 0)

  return (
    <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Period selector */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[{ k: 'hoje', label: 'Hoje' }, { k: 'semana', label: '7 dias' }, { k: 'mes', label: 'Mês' }].map(({ k, label }) => (
          <button key={k} onClick={() => setPeriod(k)} style={{
            flex: 1, padding: '7px 0', borderRadius: 6,
            background: period === k ? t.accentBg : t.bgPanel,
            border: `0.5px solid ${period === k ? t.accent : t.border}`,
            color: period === k ? t.accentText : t.textDim,
            fontSize: 12, fontWeight: period === k ? 600 : 450,
            fontFamily: 'inherit', cursor: 'pointer',
          }}>{label}</button>
        ))}
      </div>

      {/* Key metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        {[
          { label: 'Receita', value: FMT_BRL(m.receita || 0) },
          { label: 'Pedidos', value: String(m.pedidos || 0) },
          { label: 'Ticket',  value: FMT_BRL(m.ticketMedio || 0) },
        ].map(({ label, value }) => (
          <Panel key={label} t={t} style={{ padding: '10px 10px' }}>
            <div style={{ fontSize: 9.5, color: t.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500 }}>{label}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: t.text, ...MONO, marginTop: 2, lineHeight: 1.2 }}>{value}</div>
          </Panel>
        ))}
      </div>

      {/* Line chart */}
      <Panel t={t}>
        <PanelHeader t={t} title="Receita — últimos 7 dias" sub="Histórico diário"/>
        <LineChart t={t} data={data.historico || []} h={130}/>
      </Panel>

      {/* Por canal */}
      <Panel t={t}>
        <PanelHeader t={t} title="Por canal" sub="Distribuição de receita"/>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 4 }}>
          {canalItems.map(i => (
            <div key={i.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: i.color, flexShrink: 0 }}/>
              <span style={{ flex: 1, fontSize: 12, color: t.text }}>{i.label}</span>
              <span style={{ fontSize: 11, color: t.textMuted, ...MONO }}>
                {totalCanal > 0 ? Math.round((i.val / totalCanal) * 100) : 0}%
              </span>
              <span style={{ fontSize: 12, fontWeight: 600, color: t.text, ...MONO, minWidth: 64, textAlign: 'right' }}>{FMT_BRL(i.val)}</span>
            </div>
          ))}
        </div>
      </Panel>

      {/* Top produtos */}
      {topProdutos.length > 0 && (
        <Panel t={t} padding={false}>
          <PanelHeader t={t} title="Top produtos" sub="Por receita hoje" style={{ padding: '12px 14px 8px', margin: 0 }}/>
          {topProdutos.map((p, i) => (
            <div key={p.id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 14px', borderTop: `0.5px solid ${t.borderSoft}`,
            }}>
              <span style={{ fontSize: 10.5, color: t.textMuted, ...MONO, width: 18 }}>{i + 1}</span>
              <span style={{ flex: 1, fontSize: 12.5, color: t.text, fontWeight: 500 }}>{p.nome}</span>
              <span style={{ fontSize: 11, color: t.textMuted, ...MONO }}>{p.qtd} un</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: t.text, ...MONO }}>{FMT_BRL(p.receita)}</span>
            </div>
          ))}
        </Panel>
      )}
    </div>
  )
}

// ─── App root ─────────────────────────────────────────────────────────────────
export function MobileApp({ t, data, setData, refresh, showToast: showToastProp }) {
  const [page, setPage] = React.useState('dashboard')
  const [toast, setToast] = React.useState(null)
  const showToast = React.useCallback((msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3200)
  }, [])
  const dateLabel = todayLabel()
  const titles = {
    dashboard:  { title: 'FoodFlow',       sub: `Centro · ${dateLabel}` },
    mesas:      { title: 'Mesas',          sub: `${(data.mesas || []).length} totais · ${(data.mesas || []).filter(m => m.status !== 'livre').length} ocupadas` },
    pedidos:    { title: 'Novo pedido',    sub: 'Selecione produtos' },
    caixa:      { title: 'Caixa',          sub: `${(data.pedidos || []).filter(p => p.status !== 'fechado').length} contas em aberto` },
    relatorios: { title: 'Relatórios',     sub: dateLabel },
  }
  const T = titles[page] || titles.dashboard
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      background: t.bg, color: t.text,
      width: '100%', height: '100%',
      fontFamily: 'inherit',
      position: 'relative',
    }}>
      <MobileHeader t={t} title={T.title} sub={T.sub}/>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: page === 'pedidos' ? 0 : 80, position: 'relative' }}>
        {page === 'dashboard'  && <MobileDash    t={t} data={data}/>}
        {page === 'mesas'      && <MobileMesas   t={t} data={data} setData={setData} refresh={refresh} setPage={setPage}/>}
        {page === 'pedidos'    && <MobilePedidos t={t} data={data} setData={setData} refresh={refresh} showToast={showToast}/>}
        {page === 'caixa'      && <MobileCaixa   t={t} data={data} setData={setData} refresh={refresh}/>}
        {page === 'relatorios' && <MobileRelat   t={t} data={data}/>}
      </div>
      <MobileTabbar t={t} page={page} setPage={setPage}/>
      {toast && (
        <div style={{
          position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)', zIndex: 999,
          background: '#1a1a2e', color: '#fff', padding: '10px 20px', borderRadius: 8,
          fontSize: 13, fontWeight: 500, boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
          animation: 'ff-pop 180ms cubic-bezier(0.2,0.9,0.2,1)',
          whiteSpace: 'nowrap',
        }}>{toast}</div>
      )}
    </div>
  )
}
