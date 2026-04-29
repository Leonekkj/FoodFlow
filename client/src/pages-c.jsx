// pages-c.jsx — Demo pages: Cardápio, Funcionários, Integrações, Estoque, Financeiro, Fidelidade.

import React from 'react'
import { Icon, Badge, Btn, MONO, StatusDot } from './atoms.jsx'
import { Panel, PanelHeader } from './shell.jsx'
import { FMT_BRL, FMT_INT } from './data.jsx'
import { LineChart } from './pages-b.jsx'
import { MetricCard } from './pages-a.jsx'

// ─── Shared helpers ───────────────────────────────────────────────────────────

function SidePanel({ t, title, onClose, children }) {
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 40,
      background: 'rgba(0,0,0,0.22)',
      display: 'flex', justifyContent: 'flex-end',
      animation: 'ff-fade 120ms ease-out',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 380, background: t.bgPanel,
        borderLeft: `0.5px solid ${t.border}`,
        boxShadow: t.shadow,
        display: 'flex', flexDirection: 'column',
        animation: 'ff-slide 200ms cubic-bezier(0.2,0.8,0.2,1)',
      }}>
        <div style={{ padding: '14px 18px', borderBottom: `0.5px solid ${t.borderSoft}`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: t.text }}>{title}</span>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 5, border: 0, background: 'transparent', cursor: 'pointer' }}>
            <Icon name="close" size={14} stroke={t.textDim}/>
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 18 }}>
          {children}
        </div>
      </div>
    </div>
  )
}

function FormField({ t, label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: t.textMuted, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 5 }}>{label}</label>
      {children}
    </div>
  )
}

function Input({ t, ...props }) {
  return (
    <input {...props} style={{
      width: '100%', padding: '7px 10px', borderRadius: 6,
      border: `0.5px solid ${t.border}`, background: t.bgSubtle,
      fontSize: 12.5, fontFamily: 'inherit', color: t.text,
      boxSizing: 'border-box', outline: 'none',
      ...props.style,
    }}/>
  )
}

function Select({ t, children, ...props }) {
  return (
    <select {...props} style={{
      width: '100%', padding: '7px 10px', borderRadius: 6,
      border: `0.5px solid ${t.border}`, background: t.bgSubtle,
      fontSize: 12.5, fontFamily: 'inherit', color: t.text,
      boxSizing: 'border-box', outline: 'none', cursor: 'pointer',
    }}>
      {children}
    </select>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Cardápio
// ─────────────────────────────────────────────────────────────────────────────

export function CardapioPage({ t, data }) {
  const [tab, setTab] = React.useState('produtos')
  const [produtos, setProdutos] = React.useState(() => data.produtos || [])
  const [editItem, setEditItem] = React.useState(null) // null = closed, {} = new, {...} = edit
  const [form, setForm] = React.useState({})
  const [newCat, setNewCat] = React.useState('')

  const cats = [...new Set(produtos.map(p => p.categoria))]

  const openEdit = (p) => { setEditItem(p || {}); setForm(p ? { nome: p.nome, preco: p.preco, categoria: p.categoria } : { nome: '', preco: '', categoria: cats[0] || '' }) }

  const saveForm = () => {
    if (editItem.id) {
      setProdutos(ps => ps.map(p => p.id === editItem.id ? { ...p, ...form, preco: parseFloat(form.preco) || p.preco } : p))
    } else {
      const newId = Math.max(0, ...produtos.map(p => p.id)) + 1
      setProdutos(ps => [...ps, { id: newId, nome: form.nome, preco: parseFloat(form.preco) || 0, categoria: form.categoria, ativo: 1 }])
    }
    setEditItem(null)
  }

  const toggle = (id) => setProdutos(ps => ps.map(p => p.id === id ? { ...p, ativo: p.ativo ? 0 : 1 } : p))
  const remove = (id) => setProdutos(ps => ps.filter(p => p.id !== id))
  const addCat = () => { if (newCat.trim()) { setNewCat(''); } }

  const TABS = ['Produtos', 'Categorias', 'Combos', 'Adicionais']

  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex', padding: 2, background: t.bgPanel, border: `0.5px solid ${t.border}`, borderRadius: 6 }}>
          {TABS.map(tb => {
            const k = tb.toLowerCase()
            const active = tab === k
            return (
              <button key={k} onClick={() => setTab(k)} style={{
                padding: '5px 14px', borderRadius: 4, border: 0,
                background: active ? t.bgHover : 'transparent',
                fontFamily: 'inherit', fontSize: 12, fontWeight: active ? 600 : 450,
                color: active ? t.text : t.textDim, cursor: 'pointer',
              }}>{tb}</button>
            )
          })}
        </div>
        <div style={{ flex: 1 }}/>
        {(tab === 'produtos' || tab === 'categorias') && (
          <Btn t={t} kind="primary" icon="plus" size="sm" onClick={() => tab === 'produtos' ? openEdit(null) : setNewCat('nova')}>
            {tab === 'produtos' ? 'Novo produto' : 'Nova categoria'}
          </Btn>
        )}
      </div>

      {tab === 'produtos' && (
        <Panel t={t} padding={false}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 120px 90px 70px 80px',
            padding: '10px 14px', gap: 12,
            borderBottom: `0.5px solid ${t.border}`,
            fontSize: 10.5, fontWeight: 500, color: t.textMuted,
            letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            <span>Produto</span><span>Categoria</span><span style={{ textAlign: 'right' }}>Preço</span><span style={{ textAlign: 'center' }}>Status</span><span/>
          </div>
          {produtos.map(p => (
            <div key={p.id} style={{
              display: 'grid', gridTemplateColumns: '1fr 120px 90px 70px 80px',
              padding: '10px 14px', gap: 12,
              borderBottom: `0.5px solid ${t.borderSoft}`,
              alignItems: 'center', fontSize: 12.5,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 6,
                  background: `repeating-linear-gradient(45deg,${t.bgSubtle},${t.bgSubtle} 4px,${t.borderSoft} 4px,${t.borderSoft} 5px)`,
                  flexShrink: 0,
                }}/>
                <span style={{ fontWeight: 500, color: t.text }}>{p.nome}</span>
              </div>
              <span style={{ fontSize: 11.5, color: t.textDim }}>{p.categoria}</span>
              <span style={{ textAlign: 'right', ...MONO, fontWeight: 600, color: t.text }}>{FMT_BRL(p.preco)}</span>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button onClick={() => toggle(p.id)} style={{
                  width: 34, height: 18, borderRadius: 9, border: 0, cursor: 'pointer',
                  background: p.ativo ? t.accent : t.bgSubtle,
                  position: 'relative', transition: 'background 150ms',
                }}>
                  <div style={{
                    position: 'absolute', top: 2, left: p.ativo ? 18 : 2,
                    width: 14, height: 14, borderRadius: '50%',
                    background: p.ativo ? '#fff' : t.textMuted,
                    transition: 'left 150ms',
                  }}/>
                </button>
              </div>
              <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                <button onClick={() => openEdit(p)} style={{ width: 26, height: 26, borderRadius: 5, border: `0.5px solid ${t.border}`, background: 'transparent', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
                  <Icon name="settings" size={12} stroke={t.textDim}/>
                </button>
                <button onClick={() => remove(p.id)} style={{ width: 26, height: 26, borderRadius: 5, border: `0.5px solid ${t.border}`, background: 'transparent', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
                  <Icon name="trash" size={12} stroke={t.danger}/>
                </button>
              </div>
            </div>
          ))}
        </Panel>
      )}

      {tab === 'categorias' && (
        <Panel t={t} padding={false}>
          {newCat !== '' && (
            <div style={{ padding: '10px 14px', borderBottom: `0.5px solid ${t.border}`, display: 'flex', gap: 8, alignItems: 'center' }}>
              <Input t={t} value={newCat} onChange={e => setNewCat(e.target.value)} placeholder="Nome da categoria" style={{ flex: 1 }}/>
              <Btn t={t} kind="primary" size="sm" onClick={addCat}>Salvar</Btn>
              <Btn t={t} kind="ghost" size="sm" onClick={() => setNewCat('')}>Cancelar</Btn>
            </div>
          )}
          {cats.map(c => (
            <div key={c} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px', borderBottom: `0.5px solid ${t.borderSoft}`,
            }}>
              <div style={{ width: 32, height: 32, borderRadius: 6, background: t.accentBg, display: 'grid', placeItems: 'center' }}>
                <Icon name="bag" size={14} stroke={t.accentText}/>
              </div>
              <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: t.text }}>{c}</span>
              <span style={{ fontSize: 11.5, color: t.textMuted }}>{produtos.filter(p => p.categoria === c).length} produtos</span>
              <button style={{ width: 26, height: 26, borderRadius: 5, border: `0.5px solid ${t.border}`, background: 'transparent', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
                <Icon name="settings" size={12} stroke={t.textDim}/>
              </button>
            </div>
          ))}
        </Panel>
      )}

      {(tab === 'combos' || tab === 'adicionais') && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: t.bgSubtle, display: 'grid', placeItems: 'center' }}>
            <Icon name="bag" size={22} stroke={t.textMuted}/>
          </div>
          <span style={{ fontSize: 14, fontWeight: 500, color: t.text }}>{tab === 'combos' ? 'Combos' : 'Adicionais'}</span>
          <Badge t={t} tone="muted">Em desenvolvimento — MVP v1.1</Badge>
          <span style={{ fontSize: 12, color: t.textMuted, textAlign: 'center', maxWidth: 280 }}>
            {tab === 'combos' ? 'Monte combos com múltiplos produtos e defina preços especiais.' : 'Crie adicionais e opcionais para personalizar pedidos.'}
          </span>
        </div>
      )}

      {editItem !== null && (
        <SidePanel t={t} title={editItem.id ? 'Editar produto' : 'Novo produto'} onClose={() => setEditItem(null)}>
          <FormField t={t} label="Nome">
            <Input t={t} value={form.nome || ''} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Ex: Pizza Margherita"/>
          </FormField>
          <FormField t={t} label="Categoria">
            <Select t={t} value={form.categoria || ''} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}>
              {cats.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
          </FormField>
          <FormField t={t} label="Preço (R$)">
            <Input t={t} type="number" step="0.01" value={form.preco || ''} onChange={e => setForm(f => ({ ...f, preco: e.target.value }))} placeholder="0,00"/>
          </FormField>
          <FormField t={t} label="Descrição (opcional)">
            <textarea style={{
              width: '100%', padding: '7px 10px', borderRadius: 6,
              border: `0.5px solid ${t.border}`, background: t.bgSubtle,
              fontSize: 12.5, fontFamily: 'inherit', color: t.text,
              boxSizing: 'border-box', outline: 'none', resize: 'vertical', minHeight: 72,
            }} placeholder="Descrição do produto..."/>
          </FormField>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <Btn t={t} kind="ghost" onClick={() => setEditItem(null)} style={{ flex: 1 }}>Cancelar</Btn>
            <Btn t={t} kind="primary" onClick={saveForm} style={{ flex: 1 }}>Salvar</Btn>
          </div>
        </SidePanel>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Funcionários
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_FUNCIONARIOS = [
  { id: 1, nome: 'Rafael Souza',    cargo: 'admin',   email: 'rafael@foodflow.app',  status: 'ativo',   acesso: '2 min atrás' },
  { id: 2, nome: 'Ana Lima',        cargo: 'caixa',   email: 'ana@foodflow.app',     status: 'ativo',   acesso: '1h atrás' },
  { id: 3, nome: 'Carlos Mota',     cargo: 'garçom',  email: 'carlos@foodflow.app',  status: 'ativo',   acesso: '23 min atrás' },
  { id: 4, nome: 'Julia Farias',    cargo: 'garçom',  email: 'julia@foodflow.app',   status: 'ativo',   acesso: '5 min atrás' },
  { id: 5, nome: 'Pedro Costa',     cargo: 'cozinha', email: 'pedro@foodflow.app',   status: 'ativo',   acesso: '8 min atrás' },
  { id: 6, nome: 'Mariana Silva',   cargo: 'cozinha', email: 'mariana@foodflow.app', status: 'inativo', acesso: '3 dias atrás' },
]

const CARGO_CONFIG = {
  admin:   { label: 'Admin',   color: '#185FA5', bg: '#e8f0fb' },
  caixa:   { label: 'Caixa',   color: '#16a34a', bg: '#dcfce7' },
  garçom:  { label: 'Garçom',  color: '#d97706', bg: '#fef3c7' },
  cozinha: { label: 'Cozinha', color: '#dc2626', bg: '#fee2e2' },
}

const PERMISSOES = [
  { label: 'Dashboard', admin: true, caixa: true,  garçom: false, cozinha: false },
  { label: 'Mesas',     admin: true, caixa: true,  garçom: true,  cozinha: false },
  { label: 'Pedidos',   admin: true, caixa: true,  garçom: true,  cozinha: false },
  { label: 'Caixa',     admin: true, caixa: true,  garçom: false, cozinha: false },
  { label: 'Cardápio',  admin: true, caixa: false, garçom: false, cozinha: false },
  { label: 'Estoque',   admin: true, caixa: false, garçom: false, cozinha: true  },
  { label: 'Relatórios',admin: true, caixa: false, garçom: false, cozinha: false },
  { label: 'Funcionários',admin:true,caixa: false, garçom: false, cozinha: false },
]

export function FuncionariosPage({ t }) {
  const [funcs, setFuncs] = React.useState(MOCK_FUNCIONARIOS)
  const [panel, setPanel] = React.useState(null)
  const [form, setForm] = React.useState({ nome: '', cargo: 'garçom', email: '', senha: '' })

  const initials = (nome) => nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()

  const addFunc = () => {
    if (!form.nome.trim()) return
    const newId = Math.max(...funcs.map(f => f.id)) + 1
    setFuncs(fs => [...fs, { id: newId, nome: form.nome, cargo: form.cargo, email: form.email, status: 'ativo', acesso: 'agora' }])
    setPanel(null)
    setForm({ nome: '', cargo: 'garçom', email: '', senha: '' })
  }

  const remove = (id) => setFuncs(fs => fs.filter(f => f.id !== id))

  const counts = { admin: 0, caixa: 0, garçom: 0, cozinha: 0 }
  funcs.forEach(f => { if (counts[f.cargo] !== undefined) counts[f.cargo]++ })

  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {Object.entries(counts).map(([k, n]) => {
          const cfg = CARGO_CONFIG[k]
          return (
            <div key={k} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 10px', borderRadius: 6,
              background: cfg.bg, color: cfg.color,
              fontSize: 11.5, fontWeight: 500,
            }}>
              {cfg.label} <span style={{ fontWeight: 700, ...MONO }}>{n}</span>
            </div>
          )
        })}
        <div style={{ flex: 1 }}/>
        <Btn t={t} kind="primary" icon="plus" size="sm" onClick={() => setPanel('new')}>Novo funcionário</Btn>
      </div>

      <Panel t={t} padding={false}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 100px 130px 80px 80px',
          padding: '10px 14px', gap: 12,
          borderBottom: `0.5px solid ${t.border}`,
          fontSize: 10.5, fontWeight: 500, color: t.textMuted,
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          <span>Funcionário</span><span>Cargo</span><span>Último acesso</span><span style={{ textAlign: 'center' }}>Status</span><span/>
        </div>
        {funcs.map(f => {
          const cfg = CARGO_CONFIG[f.cargo] || CARGO_CONFIG.garçom
          return (
            <div key={f.id} style={{
              display: 'grid', gridTemplateColumns: '1fr 100px 130px 80px 80px',
              padding: '10px 14px', gap: 12,
              borderBottom: `0.5px solid ${t.borderSoft}`,
              alignItems: 'center', fontSize: 12.5,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: cfg.bg, color: cfg.color,
                  display: 'grid', placeItems: 'center',
                  fontSize: 11, fontWeight: 700, flexShrink: 0,
                }}>{initials(f.nome)}</div>
                <div>
                  <div style={{ fontWeight: 500, color: t.text }}>{f.nome}</div>
                  <div style={{ fontSize: 11, color: t.textMuted }}>{f.email}</div>
                </div>
              </div>
              <div>
                <span style={{ fontSize: 10.5, fontWeight: 600, padding: '2px 7px', borderRadius: 4, background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
              </div>
              <span style={{ fontSize: 11.5, color: t.textDim }}>{f.acesso}</span>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <StatusDot color={f.status === 'ativo' ? t.success : t.textMuted}/>
              </div>
              <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                <button onClick={() => remove(f.id)} style={{ width: 26, height: 26, borderRadius: 5, border: `0.5px solid ${t.border}`, background: 'transparent', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
                  <Icon name="trash" size={12} stroke={t.danger}/>
                </button>
              </div>
            </div>
          )
        })}
      </Panel>

      <Panel t={t} padding={false}>
        <PanelHeader t={t} title="Permissões por cargo" sub="O que cada nível de acesso pode fazer" style={{ padding: '14px 16px 12px', margin: 0 }}/>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontWeight: 500, color: t.textMuted, borderBottom: `0.5px solid ${t.border}` }}>Funcionalidade</th>
                {['admin','caixa','garçom','cozinha'].map(c => (
                  <th key={c} style={{ padding: '8px 14px', textAlign: 'center', fontWeight: 600, color: CARGO_CONFIG[c].color, borderBottom: `0.5px solid ${t.border}` }}>{CARGO_CONFIG[c].label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERMISSOES.map((p, i) => (
                <tr key={p.label} style={{ background: i % 2 === 0 ? 'transparent' : t.bgSubtle }}>
                  <td style={{ padding: '8px 14px', color: t.text }}>{p.label}</td>
                  {['admin','caixa','garçom','cozinha'].map(c => (
                    <td key={c} style={{ padding: '8px 14px', textAlign: 'center' }}>
                      {p[c]
                        ? <Icon name="check" size={14} stroke={t.success}/>
                        : <span style={{ color: t.borderSoft, fontSize: 16 }}>—</span>
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {panel === 'new' && (
        <SidePanel t={t} title="Novo funcionário" onClose={() => setPanel(null)}>
          <FormField t={t} label="Nome completo">
            <Input t={t} value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Ex: João da Silva"/>
          </FormField>
          <FormField t={t} label="E-mail">
            <Input t={t} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="joao@restaurante.com"/>
          </FormField>
          <FormField t={t} label="Cargo">
            <Select t={t} value={form.cargo} onChange={e => setForm(f => ({ ...f, cargo: e.target.value }))}>
              <option value="garçom">Garçom</option>
              <option value="cozinha">Cozinha</option>
              <option value="caixa">Caixa</option>
              <option value="admin">Admin</option>
            </Select>
          </FormField>
          <FormField t={t} label="Senha inicial">
            <Input t={t} type="password" value={form.senha} onChange={e => setForm(f => ({ ...f, senha: e.target.value }))} placeholder="Mínimo 6 caracteres"/>
          </FormField>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <Btn t={t} kind="ghost" onClick={() => setPanel(null)} style={{ flex: 1 }}>Cancelar</Btn>
            <Btn t={t} kind="primary" onClick={addFunc} style={{ flex: 1 }}>Criar funcionário</Btn>
          </div>
        </SidePanel>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Integrações
// ─────────────────────────────────────────────────────────────────────────────

function IntegCard({ t, emoji, name, description, status, statusColor, action }) {
  return (
    <Panel t={t} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 10, background: t.bgSubtle,
          border: `0.5px solid ${t.border}`,
          display: 'grid', placeItems: 'center', fontSize: 20, flexShrink: 0,
        }}>{emoji}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: t.text }}>{name}</div>
          <div style={{ fontSize: 11.5, color: t.textMuted, lineHeight: 1.4, marginTop: 2 }}>{description}</div>
        </div>
        <span style={{
          fontSize: 10.5, fontWeight: 600, padding: '2px 7px', borderRadius: 4,
          background: statusColor + '22', color: statusColor, whiteSpace: 'nowrap',
        }}>{status}</span>
      </div>
      {action}
    </Panel>
  )
}

export function IntegracoesPage({ t }) {
  const [stoneStatus, setStoneStatus] = React.useState('disconnected')
  const [cieloStatus, setCieloStatus] = React.useState('disconnected')
  const [ifoodStatus, setIfoodStatus] = React.useState('idle')
  const [printerIp, setPrinterIp] = React.useState('192.168.1.100')
  const [printerTest, setPrinterTest] = React.useState(false)
  const [exported, setExported] = React.useState(false)
  const [cnpj, setCnpj] = React.useState('')

  const connect = (setter) => {
    setter('loading')
    setTimeout(() => setter('connected'), 1600)
  }

  const testPrinter = () => {
    setPrinterTest(true)
    setTimeout(() => setPrinterTest(false), 2000)
  }

  const slug = 'centro-foodflow'

  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

        <IntegCard t={t} emoji="🖨️" name="Impressora Térmica" description="Envio automático de comanda para a cozinha ao confirmar pedido."
          status="Configurada" statusColor={t.success}
          action={
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Input t={t} value={printerIp} onChange={e => setPrinterIp(e.target.value)} placeholder="IP da impressora" style={{ flex: 1, fontSize: 12 }}/>
              <Btn t={t} size="sm" kind={printerTest ? 'primary' : 'default'} onClick={testPrinter}>
                {printerTest ? '✓ Imprimindo…' : 'Testar'}
              </Btn>
            </div>
          }
        />

        <IntegCard t={t} emoji="🍽️" name="Cardápio Público" description="Link próprio do restaurante para receber pedidos online, sem depender do iFood."
          status="Ativo" statusColor={t.success}
          action={
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{
                flex: 1, padding: '6px 10px', borderRadius: 6,
                background: t.bgSubtle, border: `0.5px solid ${t.border}`,
                fontSize: 11.5, color: t.accentText, ...MONO,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>foodflow.app/{slug}</div>
              <Btn t={t} size="sm" kind="default" onClick={() => { navigator.clipboard?.writeText(`https://foodflow.app/${slug}`) }}>Copiar</Btn>
              <Btn t={t} size="sm" kind="primary">Ver</Btn>
            </div>
          }
        />

        <IntegCard t={t} emoji="💳" name="Stone Terminal" description="Fechamento direto via maquininha Stone sem digitar o valor manualmente."
          status={stoneStatus === 'connected' ? '✓ Conectada' : stoneStatus === 'loading' ? 'Conectando…' : 'Não conectada'}
          statusColor={stoneStatus === 'connected' ? t.success : stoneStatus === 'loading' ? t.warning : t.textMuted}
          action={
            stoneStatus === 'connected'
              ? <span style={{ fontSize: 12, color: t.success }}>✓ Stone integrada com sucesso</span>
              : <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Input t={t} placeholder="Número de série do terminal" style={{ flex: 1, fontSize: 12 }}/>
                  <Btn t={t} size="sm" kind="primary" onClick={() => connect(setStoneStatus)} disabled={stoneStatus === 'loading'}>
                    {stoneStatus === 'loading' ? '…' : 'Conectar'}
                  </Btn>
                </div>
          }
        />

        <IntegCard t={t} emoji="💳" name="Cielo" description="Integração com terminais Cielo LIO para fechamento de conta direto na mesa."
          status={cieloStatus === 'connected' ? '✓ Conectada' : cieloStatus === 'loading' ? 'Conectando…' : 'Não conectada'}
          statusColor={cieloStatus === 'connected' ? t.success : cieloStatus === 'loading' ? t.warning : t.textMuted}
          action={
            cieloStatus === 'connected'
              ? <span style={{ fontSize: 12, color: t.success }}>✓ Cielo integrada com sucesso</span>
              : <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Input t={t} placeholder="Merchant Key" style={{ flex: 1, fontSize: 12 }}/>
                  <Btn t={t} size="sm" kind="primary" onClick={() => connect(setCieloStatus)} disabled={cieloStatus === 'loading'}>
                    {cieloStatus === 'loading' ? '…' : 'Conectar'}
                  </Btn>
                </div>
          }
        />

        <IntegCard t={t} emoji="🛵" name="iFood" description="Receba pedidos do iFood direto no FoodFlow, sem precisar digitar duas vezes."
          status="Beta" statusColor={t.warning}
          action={
            ifoodStatus === 'requested'
              ? <span style={{ fontSize: 12, color: t.success }}>✓ Solicitação enviada! Retornaremos em até 2 dias úteis.</span>
              : <Btn t={t} size="sm" kind="default" onClick={() => setIfoodStatus('requested')}>Solicitar acesso beta</Btn>
          }
        />

        <IntegCard t={t} emoji="🛵" name="Rappi" description="Integração com Rappi para centralizar pedidos de delivery no FoodFlow."
          status="Em breve" statusColor={t.textMuted}
          action={<Btn t={t} size="sm" kind="default" disabled>Disponível em v1.5</Btn>}
        />

        <IntegCard t={t} emoji="🧾" name="NFC-e / SAT" description="Emissão de nota fiscal eletrônica integrada ao fechamento de caixa."
          status={cnpj ? 'Configurado' : 'Não configurado'} statusColor={cnpj ? t.success : t.textMuted}
          action={
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Input t={t} value={cnpj} onChange={e => setCnpj(e.target.value)} placeholder="CNPJ do estabelecimento" style={{ flex: 1, fontSize: 12 }}/>
              <Btn t={t} size="sm" kind={cnpj ? 'primary' : 'default'} onClick={() => {}}>Salvar</Btn>
            </div>
          }
        />

        <IntegCard t={t} emoji="📱" name="App Garçom & Cozinha" description="App nativo para anotar pedidos na mesa e gerenciar a fila da cozinha em tempo real."
          status="v2.0" statusColor={t.success}
          action={<Btn t={t} size="sm" kind="default" disabled>Disponível em v2.0</Btn>}
        />

      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Estoque
// ─────────────────────────────────────────────────────────────────────────────

const stockFor = (id) => {
  const atual = ((id * 37 + 11) % 76) + 5
  const minimo = 15
  return { atual, minimo }
}

export function EstoquePage({ t, data }) {
  const produtos = data.produtos || []
  const stocks = produtos.map(p => ({ ...p, ...stockFor(p.id) }))

  const total    = stocks.length
  const alertas  = stocks.filter(s => s.atual <= s.minimo * 2 && s.atual > s.minimo).length
  const criticos = stocks.filter(s => s.atual <= s.minimo).length

  const statusOf = (s) => {
    if (s.atual <= s.minimo) return { label: 'Crítico', color: t.danger, bg: t.dangerBg }
    if (s.atual <= s.minimo * 2) return { label: 'Baixo',  color: t.warning, bg: t.warningBg }
    return { label: 'OK', color: t.success, bg: t.successBg }
  }

  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <MetricCard t={t} label="Total de produtos" value={FMT_INT(total)} sub="no cardápio ativo"/>
        <MetricCard t={t} label="Em alerta" value={FMT_INT(alertas)} sub="estoque abaixo do dobro do mínimo" badge={<span style={{ fontSize: 10, fontWeight: 600, padding: '1px 5px', borderRadius: 3, background: t.warningBg, color: t.warning }}>{alertas}</span>}/>
        <MetricCard t={t} label="Crítico" value={FMT_INT(criticos)} sub="estoque no mínimo ou abaixo" badge={criticos > 0 ? <span style={{ fontSize: 10, fontWeight: 600, padding: '1px 5px', borderRadius: 3, background: t.dangerBg, color: t.danger }}>{criticos}</span> : null}/>
        <MetricCard t={t} label="Baixa automática" value="Ativa" sub="vinculada ao fechamento de pedidos"/>
      </div>

      <Panel t={t} padding={false}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 120px 1fr 80px 80px',
          padding: '10px 14px', gap: 12,
          borderBottom: `0.5px solid ${t.border}`,
          fontSize: 10.5, fontWeight: 500, color: t.textMuted,
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          <span>Produto</span><span>Categoria</span><span>Estoque atual</span><span style={{ textAlign: 'center' }}>Mínimo</span><span style={{ textAlign: 'center' }}>Status</span>
        </div>
        {stocks.map(s => {
          const st = statusOf(s)
          const pct = Math.min(100, (s.atual / (s.minimo * 4)) * 100)
          return (
            <div key={s.id} style={{
              display: 'grid', gridTemplateColumns: '1fr 120px 1fr 80px 80px',
              padding: '10px 14px', gap: 12,
              borderBottom: `0.5px solid ${t.borderSoft}`,
              alignItems: 'center', fontSize: 12.5,
            }}>
              <span style={{ fontWeight: 500, color: t.text }}>{s.nome}</span>
              <span style={{ fontSize: 11.5, color: t.textDim }}>{s.categoria}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1, height: 6, background: t.bgSubtle, borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: st.color, borderRadius: 3, transition: 'width 400ms' }}/>
                </div>
                <span style={{ fontSize: 11.5, ...MONO, color: t.text, minWidth: 32, textAlign: 'right' }}>{s.atual}</span>
              </div>
              <span style={{ textAlign: 'center', fontSize: 11.5, color: t.textMuted, ...MONO }}>{s.minimo}</span>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <span style={{ fontSize: 10.5, fontWeight: 600, padding: '2px 7px', borderRadius: 4, background: st.bg, color: st.color }}>{st.label}</span>
              </div>
            </div>
          )
        })}
      </Panel>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Financeiro
// ─────────────────────────────────────────────────────────────────────────────

export function FinanceiroPage({ t, data }) {
  const [exporting, setExporting] = React.useState(false)
  const [exported, setExported] = React.useState(false)

  const receita  = data.metrics?.receita || 0
  const despesas = 820
  const lucro    = receita - despesas
  const margem   = receita > 0 ? (lucro / receita * 100).toFixed(1) : '0.0'

  const doExport = () => {
    setExporting(true)
    setTimeout(() => { setExporting(false); setExported(true); setTimeout(() => setExported(false), 3000) }, 1400)
  }

  const DRE = [
    { label: 'Receita bruta',    valor: receita,                bold: false, indent: 0 },
    { label: 'Impostos (8%)',    valor: -(receita * 0.08),      bold: false, indent: 1, color: 'danger' },
    { label: 'Receita líquida',  valor: receita * 0.92,         bold: true,  indent: 0 },
    { label: 'CMV (28%)',        valor: -(receita * 0.28),      bold: false, indent: 1, color: 'danger' },
    { label: 'Lucro bruto',      valor: receita * 0.64,         bold: true,  indent: 0 },
    { label: 'Despesas fixas',   valor: -despesas,              bold: false, indent: 1, color: 'danger' },
    { label: 'EBITDA',           valor: receita * 0.64 - despesas, bold: true, indent: 0, color: lucro > 0 ? 'success' : 'danger' },
  ]

  const CONTAS = [
    { desc: 'iFood — repasse quinzenal', venc: '05/05/2026', valor: 312.0 },
    { desc: 'Rappi — repasse semanal',   venc: '03/05/2026', valor: 96.0  },
    { desc: 'Cartão — liquidação D+2',   venc: '01/05/2026', valor: 148.5 },
  ]

  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
        <Btn t={t} size="sm" icon="filter" kind="ghost">Período</Btn>
        <Btn t={t} size="sm" onClick={doExport} disabled={exporting}>
          {exported ? '✓ Planilha gerada' : exporting ? 'Gerando…' : 'Exportar Excel'}
        </Btn>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <MetricCard t={t} hero label="Receita" value={FMT_BRL(receita)} sub="vendas de hoje"/>
        <MetricCard t={t} label="Despesas" value={FMT_BRL(despesas)} sub="custos fixos e variáveis"/>
        <MetricCard t={t} label="Lucro" value={FMT_BRL(lucro)} sub="receita menos despesas" trend={lucro > 0 ? 8.3 : -8.3}/>
        <MetricCard t={t} label="Margem" value={`${margem}%`} sub="sobre receita bruta" mono={false}/>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 12 }}>
        <Panel t={t}>
          <PanelHeader t={t} title="Fluxo de caixa" sub="Receita por hora hoje"/>
          <LineChart t={t} data={data.hourly || []} h={160}/>
        </Panel>

        <Panel t={t} padding={false}>
          <PanelHeader t={t} title="DRE simplificado" sub="Demonstrativo de resultado" style={{ padding: '14px 16px 12px', margin: 0 }}/>
          {DRE.map((row, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: `${row.bold ? 10 : 7}px ${16 + row.indent * 12}px ${row.bold ? 10 : 7}px 16px`,
              borderTop: row.bold ? `0.5px solid ${t.borderSoft}` : 'none',
              background: row.bold ? t.bgSubtle : 'transparent',
            }}>
              <span style={{ fontSize: 12, color: t.text, fontWeight: row.bold ? 600 : 400 }}>{row.label}</span>
              <span style={{
                fontSize: 12.5, fontWeight: row.bold ? 700 : 400, ...MONO,
                color: row.color === 'danger' ? t.danger : row.color === 'success' ? t.success : t.text,
              }}>{FMT_BRL(Math.abs(row.valor))}</span>
            </div>
          ))}
        </Panel>
      </div>

      <Panel t={t} padding={false}>
        <PanelHeader t={t} title="Contas a receber" sub="Repasses pendentes" style={{ padding: '14px 16px 12px', margin: 0 }}/>
        {CONTAS.map((c, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 16px', borderTop: `0.5px solid ${t.borderSoft}`,
          }}>
            <span style={{ flex: 1, fontSize: 12.5, color: t.text }}>{c.desc}</span>
            <span style={{ fontSize: 11.5, color: t.textMuted }}>Venc. {c.venc}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: t.success, ...MONO }}>{FMT_BRL(c.valor)}</span>
          </div>
        ))}
      </Panel>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Fidelidade
// ─────────────────────────────────────────────────────────────────────────────

const CLIENTES = [
  { id: 1, nome: 'Fernanda Torres',   pontos: 3420, gasto: 1240.0, visita: 'hoje' },
  { id: 2, nome: 'Rodrigo Almeida',   pontos: 2180, gasto: 890.0,  visita: 'ontem' },
  { id: 3, nome: 'Beatriz Cunha',     pontos: 1750, gasto: 720.0,  visita: '2 dias' },
  { id: 4, nome: 'Lucas Martins',     pontos: 1430, gasto: 610.0,  visita: '3 dias' },
  { id: 5, nome: 'Camila Rocha',      pontos: 980,  gasto: 420.0,  visita: '1 semana' },
  { id: 6, nome: 'Diego Ferreira',    pontos: 640,  gasto: 310.0,  visita: '1 semana' },
  { id: 7, nome: 'Sofia Lima',        pontos: 310,  gasto: 180.0,  visita: '2 semanas' },
  { id: 8, nome: 'Mateus Oliveira',   pontos: 95,   gasto: 72.0,   visita: '1 mês' },
]

const tierOf = (pontos) => {
  if (pontos >= 2000) return { label: 'Ouro',  color: '#b45309', bg: '#fef3c7', icon: '⭐' }
  if (pontos >= 500)  return { label: 'Prata', color: '#475569', bg: '#f1f5f9', icon: '🥈' }
  return                     { label: 'Bronze',color: '#92400e', bg: '#fef9ee', icon: '🥉' }
}

export function FidelidadePage({ t }) {
  const [config, setConfig] = React.useState({ nome: 'FoodClub', pontosReais: 1, resgate: 500 })
  const [panel, setPanel] = React.useState(false)

  const totalPontos  = CLIENTES.reduce((s, c) => s + c.pontos, 0)
  const resgatesHoje = 3

  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: t.text, display: 'flex', alignItems: 'center', gap: 8 }}>
            ⭐ {config.nome}
          </div>
          <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>
            {config.pontosReais} ponto por R$ 1,00 · Resgate a partir de {config.resgate} pts
          </div>
        </div>
        <Btn t={t} size="sm" onClick={() => setPanel(true)}>Configurar programa</Btn>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <MetricCard t={t} label="Clientes" value={FMT_INT(CLIENTES.length)} sub="cadastrados no programa"/>
        <MetricCard t={t} label="Pontos ativos" value={FMT_INT(totalPontos)} sub="no saldo dos clientes"/>
        <MetricCard t={t} label="Resgates hoje" value={FMT_INT(resgatesHoje)} sub="cupons utilizados"/>
        <MetricCard t={t} hero label="Ouro" value={FMT_INT(CLIENTES.filter(c => c.pontos >= 2000).length)} sub="clientes no nível mais alto" mono={false}/>
      </div>

      <Panel t={t} padding={false}>
        <PanelHeader t={t} title="Ranking de clientes" sub="Ordenado por pontos" style={{ padding: '14px 16px 12px', margin: 0 }}/>
        <div style={{
          display: 'grid', gridTemplateColumns: '32px 1fr 80px 80px 110px 100px',
          padding: '8px 14px', gap: 12,
          borderBottom: `0.5px solid ${t.border}`,
          fontSize: 10.5, fontWeight: 500, color: t.textMuted,
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          <span>#</span><span>Cliente</span><span>Tier</span><span style={{ textAlign: 'right' }}>Pontos</span><span>Última visita</span><span style={{ textAlign: 'right' }}>Total gasto</span>
        </div>
        {CLIENTES.map((c, i) => {
          const tier = tierOf(c.pontos)
          return (
            <div key={c.id} style={{
              display: 'grid', gridTemplateColumns: '32px 1fr 80px 80px 110px 100px',
              padding: '10px 14px', gap: 12,
              borderBottom: `0.5px solid ${t.borderSoft}`,
              alignItems: 'center', fontSize: 12.5,
            }}>
              <span style={{ fontSize: 11, color: t.textMuted, ...MONO }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ fontWeight: 500, color: t.text }}>{c.nome}</span>
              <span style={{ fontSize: 10.5, fontWeight: 600, padding: '2px 7px', borderRadius: 4, background: tier.bg, color: tier.color }}>
                {tier.icon} {tier.label}
              </span>
              <span style={{ textAlign: 'right', fontWeight: 600, color: t.text, ...MONO }}>{FMT_INT(c.pontos)}</span>
              <span style={{ fontSize: 11.5, color: t.textDim }}>{c.visita}</span>
              <span style={{ textAlign: 'right', fontWeight: 500, color: t.text, ...MONO }}>{FMT_BRL(c.gasto)}</span>
            </div>
          )
        })}
      </Panel>

      {panel && (
        <SidePanel t={t} title="Configurar FoodClub" onClose={() => setPanel(false)}>
          <FormField t={t} label="Nome do programa">
            <Input t={t} value={config.nome} onChange={e => setConfig(c => ({ ...c, nome: e.target.value }))}/>
          </FormField>
          <FormField t={t} label="Pontos por R$ 1,00 gasto">
            <Input t={t} type="number" min="1" value={config.pontosReais} onChange={e => setConfig(c => ({ ...c, pontosReais: Number(e.target.value) }))}/>
          </FormField>
          <FormField t={t} label="Pontos mínimos para resgate">
            <Input t={t} type="number" min="100" value={config.resgate} onChange={e => setConfig(c => ({ ...c, resgate: Number(e.target.value) }))}/>
          </FormField>
          <div style={{ padding: '12px 14px', background: t.bgSubtle, borderRadius: 8, marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 6 }}>Tiers automáticos</div>
            {[{ label: 'Bronze', range: '0 – 499 pts', icon: '🥉' }, { label: 'Prata', range: '500 – 1.999 pts', icon: '🥈' }, { label: 'Ouro', range: '2.000+ pts', icon: '⭐' }].map(tier => (
              <div key={tier.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span>{tier.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: t.text }}>{tier.label}</span>
                <span style={{ fontSize: 11.5, color: t.textMuted }}>{tier.range}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn t={t} kind="ghost" onClick={() => setPanel(false)} style={{ flex: 1 }}>Cancelar</Btn>
            <Btn t={t} kind="primary" onClick={() => setPanel(false)} style={{ flex: 1 }}>Salvar configurações</Btn>
          </div>
        </SidePanel>
      )}
    </div>
  )
}
