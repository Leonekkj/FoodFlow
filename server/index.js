import express from 'express'
import cors from 'cors'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { existsSync } from 'fs'
import { createDb } from './database.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const db = createDb()

app.use(cors(process.env.NODE_ENV === 'production' ? {} : { origin: 'http://localhost:5173' }))
app.use(express.json())

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function minutesAgo(isoStr) {
  const mins = Math.round((Date.now() - new Date(isoStr).getTime()) / 60_000)
  return mins <= 1 ? '01 min' : `${String(mins).padStart(2, '0')} min`
}

function ordersWithItems(rows) {
  const orderMap = new Map()
  for (const row of rows) {
    if (!orderMap.has(row.id)) {
      orderMap.set(row.id, {
        id: row.id, tipo: row.tipo, mesa_id: row.mesa_id,
        endereco: row.endereco, status: row.status,
        total: row.total, criado_em: row.criado_em,
        criado: minutesAgo(row.criado_em),
        items: [],
      })
    }
    if (row.item_id) {
      orderMap.get(row.id).items.push({
        id: row.item_id, produto_id: row.produto_id,
        nome: row.produto_nome, quantidade: row.quantidade,
        preco_unit: row.preco_unit,
      })
    }
  }
  return [...orderMap.values()]
}

// ─────────────────────────────────────────────────────────────────────────────
// Produtos
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/produtos', (_req, res) => {
  res.json(db.prepare('SELECT * FROM produtos WHERE ativo = 1 ORDER BY categoria, nome').all())
})

// ─────────────────────────────────────────────────────────────────────────────
// Mesas
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/mesas', (_req, res) => {
  const mesas = db.prepare(`
    SELECT m.*,
      COALESCE(SUM(CASE WHEN p.status != 'fechado' THEN p.total ELSE 0 END), 0) AS total_aberto
    FROM mesas m
    LEFT JOIN pedidos p ON p.mesa_id = m.id
    GROUP BY m.id
    ORDER BY m.numero
  `).all()
  res.json(mesas)
})

app.patch('/api/mesas/:id', (req, res) => {
  const { status } = req.body
  db.prepare('UPDATE mesas SET status = ? WHERE id = ?').run(status, req.params.id)
  res.json({ ok: true })
})

// ─────────────────────────────────────────────────────────────────────────────
// Pedidos
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/pedidos', (req, res) => {
  const where = req.query.status
    ? `WHERE p.status = '${req.query.status}'`
    : "WHERE p.status != 'fechado'"
  const rows = db.prepare(`
    SELECT p.id, p.tipo, p.mesa_id, p.endereco, p.status, p.total, p.criado_em,
      ip.id AS item_id, ip.produto_id, ip.quantidade, ip.preco_unit,
      pr.nome AS produto_nome
    FROM pedidos p
    LEFT JOIN itens_pedido ip ON ip.pedido_id = p.id
    LEFT JOIN produtos pr ON pr.id = ip.produto_id
    ${where}
    ORDER BY p.criado_em DESC, ip.id
  `).all()
  res.json(ordersWithItems(rows))
})

app.get('/api/pedidos/:id', (req, res) => {
  const rows = db.prepare(`
    SELECT p.id, p.tipo, p.mesa_id, p.endereco, p.status, p.total, p.criado_em,
      ip.id AS item_id, ip.produto_id, ip.quantidade, ip.preco_unit,
      pr.nome AS produto_nome
    FROM pedidos p
    LEFT JOIN itens_pedido ip ON ip.pedido_id = p.id
    LEFT JOIN produtos pr ON pr.id = ip.produto_id
    WHERE p.id = ?
    ORDER BY ip.id
  `).all(req.params.id)
  const orders = ordersWithItems(rows)
  if (!orders.length) return res.status(404).json({ error: 'Pedido não encontrado' })
  res.json(orders[0])
})

app.post('/api/pedidos', (req, res) => {
  const { tipo, mesa_id, endereco, items } = req.body
  if (!tipo || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'tipo e items são obrigatórios' })
  }

  const total = items.reduce((s, it) => s + it.quantidade * it.preco_unit, 0)

  const create = db.transaction(() => {
    const { lastInsertRowid: pedidoId } = db.prepare(
      `INSERT INTO pedidos (tipo, mesa_id, endereco, status, total) VALUES (?, ?, ?, 'aberto', ?)`
    ).run(tipo, mesa_id || null, endereco || null, total)

    const insertItem = db.prepare(
      'INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unit) VALUES (?, ?, ?, ?)'
    )
    for (const it of items) {
      insertItem.run(pedidoId, it.produto_id, it.quantidade, it.preco_unit)
    }

    if (mesa_id) {
      db.prepare("UPDATE mesas SET status = 'ocupada' WHERE id = ?").run(mesa_id)
    }

    return pedidoId
  })

  const pedidoId = create()

  // Return the newly created order with items
  const rows = db.prepare(`
    SELECT p.id, p.tipo, p.mesa_id, p.endereco, p.status, p.total, p.criado_em,
      ip.id AS item_id, ip.produto_id, ip.quantidade, ip.preco_unit,
      pr.nome AS produto_nome
    FROM pedidos p
    LEFT JOIN itens_pedido ip ON ip.pedido_id = p.id
    LEFT JOIN produtos pr ON pr.id = ip.produto_id
    WHERE p.id = ?
    ORDER BY ip.id
  `).all(pedidoId)

  res.status(201).json(ordersWithItems(rows)[0])
})

app.patch('/api/pedidos/:id', (req, res) => {
  const { status } = req.body
  db.prepare('UPDATE pedidos SET status = ? WHERE id = ?').run(status, req.params.id)
  res.json({ ok: true })
})

// ─────────────────────────────────────────────────────────────────────────────
// Caixa
// ─────────────────────────────────────────────────────────────────────────────

app.post('/api/caixa', (req, res) => {
  const { pedido_id, forma_pagto, valor } = req.body
  if (!pedido_id) return res.status(400).json({ error: 'pedido_id é obrigatório' })

  const pedido = db.prepare('SELECT * FROM pedidos WHERE id = ?').get(pedido_id)
  if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado' })

  db.transaction(() => {
    db.prepare('INSERT INTO caixa (pedido_id, forma_pagto, valor) VALUES (?, ?, ?)').run(pedido_id, forma_pagto, valor || pedido.total)
    db.prepare("UPDATE pedidos SET status = 'fechado' WHERE id = ?").run(pedido_id)
    if (pedido.mesa_id) {
      db.prepare("UPDATE mesas SET status = 'livre' WHERE id = ?").run(pedido.mesa_id)
    }
  })()

  res.json({ ok: true })
})

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard (full data bundle)
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/dashboard', (_req, res) => {
  const today = "date('now','localtime')"

  // Metrics
  const metricsRow = db.prepare(`
    SELECT
      COALESCE(SUM(total), 0) AS receita,
      COUNT(*) AS pedidos
    FROM pedidos
    WHERE date(criado_em, 'localtime') = ${today}
  `).get()
  const mesasAbertas = db.prepare("SELECT COUNT(*) AS n FROM mesas WHERE status != 'livre'").get().n
  const receita = metricsRow.receita
  const numPedidos = metricsRow.pedidos
  const ticketMedio = numPedidos > 0 ? receita / numPedidos : 0

  // Hourly revenue (10:00 → 22:00)
  const hourlyRows = db.prepare(`
    SELECT strftime('%H:00', criado_em, 'localtime') AS hora, SUM(total) AS valor
    FROM pedidos
    WHERE date(criado_em, 'localtime') = ${today}
    GROUP BY strftime('%H', criado_em, 'localtime')
    ORDER BY hora
  `).all()
  const hourlyMap = {}
  for (const r of hourlyRows) hourlyMap[r.hora] = r.valor
  const hourly = Array.from({ length: 13 }, (_, i) => {
    const hora = `${String(10 + i).padStart(2, '0')}:00`
    return { hora, valor: hourlyMap[hora] || 0 }
  })

  // Top produtos
  const topProdutos = db.prepare(`
    SELECT p.id, p.nome,
      SUM(ip.quantidade) AS qtd,
      SUM(ip.quantidade * ip.preco_unit) AS receita
    FROM itens_pedido ip
    JOIN produtos p ON p.id = ip.produto_id
    JOIN pedidos pd ON pd.id = ip.pedido_id
    WHERE date(pd.criado_em, 'localtime') = ${today}
    GROUP BY p.id
    ORDER BY qtd DESC
    LIMIT 5
  `).all()

  // Por canal
  const canalRows = db.prepare(`
    SELECT tipo, SUM(total) AS total
    FROM pedidos
    WHERE date(criado_em, 'localtime') = ${today}
    GROUP BY tipo
  `).all()
  const porCanal = { mesa: 0, balcao: 0, delivery: 0 }
  for (const r of canalRows) if (r.tipo in porCanal) porCanal[r.tipo] = r.total

  // Histórico 7 dias
  const diasPT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  const historicoRows = db.prepare(`
    SELECT date(criado_em, 'localtime') AS dia, SUM(total) AS valor
    FROM pedidos
    WHERE date(criado_em, 'localtime') >= date('now', 'localtime', '-6 days')
    GROUP BY date(criado_em, 'localtime')
    ORDER BY dia
  `).all()
  const histMap = {}
  for (const r of historicoRows) histMap[r.dia] = r.valor
  const historico = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const key = d.toISOString().slice(0, 10)
    const dow = d.getDay()
    return { dia: diasPT[dow], valor: histMap[key] || 0 }
  })

  // Open orders with items
  const pedidoRows = db.prepare(`
    SELECT p.id, p.tipo, p.mesa_id, p.endereco, p.status, p.total, p.criado_em,
      ip.id AS item_id, ip.produto_id, ip.quantidade, ip.preco_unit,
      pr.nome AS produto_nome
    FROM pedidos p
    LEFT JOIN itens_pedido ip ON ip.pedido_id = p.id
    LEFT JOIN produtos pr ON pr.id = ip.produto_id
    WHERE p.status != 'fechado'
    ORDER BY p.criado_em DESC, ip.id
  `).all()
  const pedidos = ordersWithItems(pedidoRows)

  // Mesas
  const mesas = db.prepare(`
    SELECT m.*,
      COALESCE(SUM(CASE WHEN p.status != 'fechado' THEN p.total ELSE 0 END), 0) AS total_aberto
    FROM mesas m
    LEFT JOIN pedidos p ON p.mesa_id = m.id
    GROUP BY m.id
    ORDER BY m.numero
  `).all()

  // Produtos
  const produtos = db.prepare('SELECT * FROM produtos WHERE ativo = 1 ORDER BY categoria, nome').all()

  // Unidades (stats globais — schema não tem unidade_id em mesas/pedidos)
  const unidades = db.prepare(`
    SELECT u.*,
      (SELECT COALESCE(SUM(total), 0) FROM pedidos WHERE date(criado_em,'localtime') = ${today}) AS receita,
      (SELECT COUNT(*) FROM mesas WHERE status != 'livre') AS mesasAbertas,
      (SELECT COUNT(*) FROM pedidos WHERE status != 'fechado') AS pedidosAtivos
    FROM unidades u
    ORDER BY u.id
  `).all()

  // Caixa hoje
  const caixaHoje = db.prepare(`
    SELECT COUNT(*) AS fechadas, COALESCE(SUM(valor), 0) AS valorRecebido
    FROM caixa
    WHERE date(fechado_em, 'localtime') = ${today}
  `).get()

  res.json({
    produtos,
    mesas,
    pedidos,
    unidades,
    hourly,
    topProdutos,
    porCanal,
    historico,
    metrics: { receita, pedidos: numPedidos, ticketMedio, mesasAbertas },
    caixaHoje: { fechadas: caixaHoje.fechadas, valorRecebido: caixaHoje.valorRecebido },
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Relatórios
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/relatorios', (_req, res) => {
  // Delegates to dashboard for now — extend with ?periodo support later
  res.redirect('/api/dashboard')
})

// ─────────────────────────────────────────────────────────────────────────────
// Unidades
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/unidades', (_req, res) => {
  const unidades = db.prepare(`
    SELECT u.*,
      COALESCE(SUM(CASE WHEN p.status != 'fechado' THEN p.total ELSE 0 END), 0) AS receita,
      COUNT(DISTINCT CASE WHEN m.status != 'livre' THEN m.id END) AS mesasAbertas,
      COUNT(DISTINCT CASE WHEN p.status != 'fechado' THEN p.id END) AS pedidosAtivos
    FROM unidades u
    LEFT JOIN mesas m ON 1=1
    LEFT JOIN pedidos p ON p.status != 'fechado'
    GROUP BY u.id
    ORDER BY u.id
  `).all()
  res.json(unidades)
})

// ─────────────────────────────────────────────────────────────────────────────
// Error handler
// ─────────────────────────────────────────────────────────────────────────────

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: err.message })
})

// Serve built React client in production
const distPath = join(__dirname, '../client/dist')
if (existsSync(distPath)) {
  app.use(express.static(distPath))
  app.get('*', (_req, res) => res.sendFile(join(distPath, 'index.html')))
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`FoodFlow API :${PORT}`))
