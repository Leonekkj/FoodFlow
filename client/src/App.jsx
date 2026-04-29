import React from 'react'
import { makeTheme, Btn } from './atoms.jsx'
import { Sidebar, Topbar } from './shell.jsx'
import { DashboardPage, MesasPage, PedidosPage } from './pages-a.jsx'
import { CaixaPage, RelatoriosPage, UnidadesPage } from './pages-b.jsx'
import { CardapioPage, FuncionariosPage, IntegracoesPage, EstoquePage, FinanceiroPage, FidelidadePage } from './pages-c.jsx'
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
  const [toast, setToast] = React.useState(null)
  const showToast = React.useCallback((msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3200)
  }, [])

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
    dashboard:    { title: 'Dashboard',     subtitle: `${unidade?.nome || ''} · Terça, 29 de Abril 2026` },
    mesas:        { title: 'Mesas',         subtitle: `${(data.mesas || []).length} mesas · ${(data.mesas || []).filter(m => m.status !== 'livre').length} em uso` },
    pedidos:      { title: 'Pedidos',       subtitle: 'Criar novo pedido (Balcão / Delivery)' },
    caixa:        { title: 'Caixa',         subtitle: `${(data.pedidos || []).filter(p => p.status !== 'fechado').length} contas em aberto` },
    relatorios:   { title: 'Relatórios',    subtitle: 'Análise de vendas e desempenho' },
    unidades:     { title: 'Unidades',      subtitle: `${(data.unidades || []).length} unidades · ${(data.unidades || []).filter(u => u.ativo).length} ativas` },
    cardapio:     { title: 'Cardápio',      subtitle: `${(data.produtos || []).length} produtos cadastrados` },
    funcionarios: { title: 'Funcionários',  subtitle: 'Gerencie a equipe e os níveis de acesso' },
    integracoes:  { title: 'Integrações',   subtitle: 'Impressora, maquininha, delivery e fiscal' },
    estoque:      { title: 'Estoque',       subtitle: 'Controle de estoque com baixa automática' },
    financeiro:   { title: 'Financeiro',    subtitle: 'Fluxo de caixa, DRE e contas a receber' },
    fidelidade:   { title: 'Fidelidade',    subtitle: 'Programa de pontos e ranking de clientes' },
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
    return <MobileApp t={t} data={data} setData={setData} refresh={load} showToast={showToast}/>
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
          {page === 'pedidos'    && <PedidosPage    t={t} data={data} setData={setData} refresh={load} onToast={showToast}/>}
          {page === 'caixa'      && <CaixaPage      t={t} data={data} setData={setData} refresh={load}/>}
          {page === 'relatorios'   && <RelatoriosPage  t={t} data={data}/>}
          {page === 'unidades'     && <UnidadesPage    t={t} data={data}/>}
          {page === 'cardapio'     && <CardapioPage    t={t} data={data} setData={setData}/>}
          {page === 'funcionarios' && <FuncionariosPage t={t}/>}
          {page === 'integracoes'  && <IntegracoesPage  t={t}/>}
          {page === 'estoque'      && <EstoquePage      t={t} data={data}/>}
          {page === 'financeiro'   && <FinanceiroPage   t={t} data={data}/>}
          {page === 'fidelidade'   && <FidelidadePage   t={t}/>}
        </div>
      </main>
      {toast && (
        <div style={{
          position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 999,
          background: '#1a1a2e', color: '#fff', padding: '10px 20px', borderRadius: 8,
          fontSize: 13, fontWeight: 500, boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
          animation: 'ff-pop 180ms cubic-bezier(0.2,0.9,0.2,1)',
          whiteSpace: 'nowrap',
        }}>{toast}</div>
      )}
    </div>
  )
}
