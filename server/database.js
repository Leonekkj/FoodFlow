import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function createDb(path = join(__dirname, 'foodflow.db')) {
  const db = new Database(path);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      preco REAL NOT NULL,
      categoria TEXT,
      ativo INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS mesas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      numero INTEGER NOT NULL,
      status TEXT DEFAULT 'livre'
    );

    CREATE TABLE IF NOT EXISTS pedidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo TEXT NOT NULL,
      mesa_id INTEGER REFERENCES mesas(id),
      endereco TEXT,
      status TEXT DEFAULT 'aberto',
      total REAL DEFAULT 0,
      criado_em TEXT DEFAULT (datetime('now','localtime'))
    );

    CREATE TABLE IF NOT EXISTS itens_pedido (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pedido_id INTEGER REFERENCES pedidos(id) ON DELETE CASCADE,
      produto_id INTEGER REFERENCES produtos(id),
      quantidade INTEGER NOT NULL,
      preco_unit REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS caixa (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pedido_id INTEGER REFERENCES pedidos(id),
      forma_pagto TEXT,
      valor REAL,
      fechado_em TEXT DEFAULT (datetime('now','localtime'))
    );

    CREATE TABLE IF NOT EXISTS unidades (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      endereco TEXT,
      ativo INTEGER DEFAULT 1
    );
  `);

  seed(db);
  return db;
}

function seed(db) {
  const hasProdutos = db.prepare('SELECT COUNT(*) as n FROM produtos').get().n;
  if (hasProdutos > 0) return;

  // ── Produtos ──────────────────────────────────────────────────────────────
  const insertProduto = db.prepare('INSERT INTO produtos (nome, preco, categoria) VALUES (?, ?, ?)');
  const PRODS = [
    [1,  'Pizza Margherita',     48.0,  'Pizzas'],
    [2,  'Pizza Pepperoni',      54.0,  'Pizzas'],
    [3,  'Pizza Quatro Queijos', 56.0,  'Pizzas'],
    [4,  'Hambúrguer Clássico',  32.0,  'Lanches'],
    [5,  'Hambúrguer Cheddar',   36.0,  'Lanches'],
    [6,  'Frango Grelhado',      42.0,  'Pratos'],
    [7,  'Filé à Parmegiana',    58.0,  'Pratos'],
    [8,  'Batata Frita',         22.0,  'Acompanhamentos'],
    [9,  'Onion Rings',          24.0,  'Acompanhamentos'],
    [10, 'Refrigerante Lata',     8.0,  'Bebidas'],
    [11, 'Suco Natural',         12.0,  'Bebidas'],
    [12, 'Água Mineral',          6.0,  'Bebidas'],
    [13, 'Cerveja Long Neck',    14.0,  'Bebidas'],
    [14, 'Sorvete',              16.0,  'Sobremesas'],
    [15, 'Pudim',                14.0,  'Sobremesas'],
    [16, 'Brownie c/ Sorvete',   22.0,  'Sobremesas'],
  ];
  for (const [, nome, preco, categoria] of PRODS) insertProduto.run(nome, preco, categoria);

  // Lookup by original index for seed convenience
  const p = (id) => PRODS[id - 1];
  const preco = (id) => p(id)[2];

  // ── Mesas ─────────────────────────────────────────────────────────────────
  const insertMesa = db.prepare('INSERT INTO mesas (numero, status) VALUES (?, ?)');
  const mesaStatus = [
    'ocupada', 'ocupada', 'livre',   'ocupada',
    'aguardando', 'livre', 'ocupada', 'ocupada',
    'aguardando', 'livre', 'ocupada', 'ocupada',
  ];
  for (let i = 0; i < 12; i++) insertMesa.run(i + 1, mesaStatus[i]);

  // ── Unidade ───────────────────────────────────────────────────────────────
  db.prepare('INSERT INTO unidades (nome, endereco) VALUES (?, ?)').run('Centro', 'R. XV de Novembro, 1240');

  // ── Helpers ───────────────────────────────────────────────────────────────
  const insertPedido = db.prepare(
    `INSERT INTO pedidos (tipo, mesa_id, endereco, status, total) VALUES (?, ?, ?, ?, ?)`
  );
  const insertItem = db.prepare(
    'INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unit) VALUES (?, ?, ?, ?)'
  );
  const updateMesa = db.prepare("UPDATE mesas SET status = ? WHERE id = ?");

  function criarPedido(tipo, mesa_id, endereco, status, itens) {
    const total = itens.reduce((s, [pid, qtd]) => s + preco(pid) * qtd, 0);
    const { lastInsertRowid: pedidoId } = insertPedido.run(tipo, mesa_id, endereco, status, total);
    for (const [pid, qtd] of itens) insertItem.run(pedidoId, pid, qtd, preco(pid));
    if (mesa_id && status !== 'fechado') updateMesa.run(status === 'aberto' ? 'ocupada' : 'ocupada', mesa_id);
    return { id: pedidoId, total };
  }

  // ── Pedidos FECHADOS (histórico do dia — geram receita no caixa) ──────────
  const insertCaixa = db.prepare('INSERT INTO caixa (pedido_id, forma_pagto, valor) VALUES (?, ?, ?)');
  const formas = ['pix', 'cartao_credito', 'cartao_debito', 'dinheiro', 'pix', 'cartao_credito'];

  const fechados = [
    criarPedido('mesa',    1,    null, 'fechado', [[1,1],[10,1],[8,1]]),   // 48+8+22 = 78
    criarPedido('mesa',    3,    null, 'fechado', [[5,1],[13,1],[9,1]]),   // 36+14+24 = 74
    criarPedido('mesa',    6,    null, 'fechado', [[7,1],[10,2]]),         // 58+16 = 74
    criarPedido('balcao',  null, null, 'fechado', [[2,1]]),                // 54
    criarPedido('delivery',null, 'R. Augusta, 1842 — Ap. 71', 'fechado', [[6,1],[11,1]]), // 42+12 = 54
    criarPedido('mesa',    8,    null, 'fechado', [[4,2],[13,2]]),         // 64+28 = 92
  ];
  fechados.forEach((pd, i) => {
    db.prepare("UPDATE pedidos SET status = 'fechado' WHERE id = ?").run(pd.id);
    insertCaixa.run(pd.id, formas[i], pd.total);
  });

  // ── Pedidos ABERTOS (movimento atual) ─────────────────────────────────────
  criarPedido('mesa',     2,    null, 'aberto',     [[3,1],[10,2],[13,1]]); // 56+16+14 = 86
  criarPedido('mesa',     4,    null, 'aberto',     [[7,1],[11,1]]);         // 58+12 = 70
  criarPedido('mesa',     5,    null, 'aberto',     [[6,1],[9,1]]);          // 42+24 = 66
  criarPedido('mesa',     7,    null, 'aberto',     [[5,2],[8,1],[13,1]]);   // 72+22+14 = 108
  criarPedido('mesa',     9,    null, 'aberto',     [[1,2],[10,2]]);         // 96+16 = 112
  criarPedido('mesa',     11,   null, 'aberto',     [[2,1],[14,1],[15,1]]); // 54+16+14 = 84
  criarPedido('mesa',     12,   null, 'aberto',     [[16,2],[13,2]]);        // 44+28 = 72
  criarPedido('balcao',   null, null, 'aberto',     [[4,1],[8,1],[10,1]]);   // 32+22+8 = 62
  criarPedido('delivery', null, 'Av. Paulista, 904 — Sl. 12', 'aberto', [[2,1],[13,1],[10,1]]); // 54+14+8 = 76
  criarPedido('delivery', null, 'R. Oscar Freire, 580', 'aberto', [[6,1],[11,1],[16,1]]); // 42+12+22 = 76
}
