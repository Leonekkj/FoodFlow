import React from 'react'
import { makeTheme, Btn } from './atoms.jsx'
import { Sidebar, Topbar } from './shell.jsx'
import { DashboardPage, MesasPage, PedidosPage } from './pages-a.jsx'
import { CaixaPage, RelatoriosPage, UnidadesPage } from './pages-b.jsx'
import { MobileApp } from './mobile.jsx'
import { getMockData } from './data.jsx'
import { api } from './api.js'

const DENSITY = 'regular'

export default function App() {
  const t = makeTheme({ dark: false, density: DENSITY })

  const [page, setPage] = React.useState('dashboard')
  const [openMesa, setOpenMesa] = React.useState(null)
  const [data, setData] = React.useState(() => getMockData())
  const [unidade, setUnidade] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [isMobile, setIsMobile] = React.useState(() => window.innerWidth < 768)

  React.useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const load = React.useCallback(async () => {
    try {
      const d = await api.get('/dashboard')
      setData(d)
      if (!unidade && d.unidades?.length) setUnidade(d.unidades[0])
    } catch {
      const mock = getMockData()
      setData(mock)
      if (!unidade && mock.unidades?.length) setUnidade(mock.unidades[0])
    } finally {
      setLoading(false)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => { load() }, [load])

  const titles = {
    dashboard:  { title: 'Dashboard',  subtitle: `${unidade?.nome || ''} · Terça, 29 de Abril 2026` },
    mesas:      { title: 'Mesas',      subtitle: `${(data.mesas || []).length} mesas · ${(data.mesas || []).filter(m => m.status !== 'livre').length} em uso` },
    pedidos:    { title: 'Pedidos',    subtitle: 'Criar novo pedido (Balcão / Delivery)' },
    caixa:      { title: 'Caixa',      subtitle: `${(data.pedidos || []).filter(p => p.status !== 'fechado').length} contas em aberto` },
    relatorios: { title: 'Relatórios', subtitle: 'Análise de vendas e desempenho' },
    unidades:   { title: 'Unidades',   subtitle: `${(data.unidades || []).length} unidades · ${(data.unidades || []).filter(u => u.ativo).length} ativas` },
  }

  const navigateTo = (p) => { setPage(p); setOpenMesa(null) }

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', background: t.bg }}>
        <div style={{ fontSize: 13, color: t.textMuted }}>Carregando…</div>
      </div>
    )
  }

  if (isMobile) {
    return <MobileApp t={t} data={data} setData={setData} refresh={load}/>
  }

  return (
    <div style={{ display: 'flex', height: '100%', background: t.bg, color: t.text, fontSize: 13, fontFamily: 'inherit' }}>
      <Sidebar
        t={t}
        page={page}
        setPage={navigateTo}
        collapsed={false}
        unidade={unidade || (data.unidades || [])[0] || { nome: '—', id: 0, ativo: true }}
        setUnidade={setUnidade}
        unidades={data.unidades || []}
      />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative' }}>
        <Topbar
          t={t}
          {...titles[page]}
          right={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Btn t={t} size="sm" icon="plus" kind="primary" onClick={() => navigateTo('pedidos')}>
                Novo pedido
              </Btn>
            </div>
          }
        />
        <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
          {page === 'dashboard'  && <DashboardPage  t={t} data={data} setPage={navigateTo}/>}
          {page === 'mesas'      && <MesasPage      t={t} data={data} setData={setData} openMesa={openMesa} setOpenMesa={setOpenMesa} setPage={navigateTo} refresh={load}/>}
          {page === 'pedidos'    && <PedidosPage    t={t} data={data} setData={setData} refresh={load}/>}
          {page === 'caixa'      && <CaixaPage      t={t} data={data} setData={setData} refresh={load}/>}
          {page === 'relatorios' && <RelatoriosPage t={t} data={data}/>}
          {page === 'unidades'   && <UnidadesPage   t={t} data={data}/>}
        </div>
      </main>
    </div>
  )
}
