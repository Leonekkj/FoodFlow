// data.jsx — mock data fallback (used when API is unavailable)

const PRODUTOS = [
  { id: 1,  nome: 'Pizza Margherita',    preco: 48.0,  categoria: 'Pizzas' },
  { id: 2,  nome: 'Pizza Pepperoni',     preco: 54.0,  categoria: 'Pizzas' },
  { id: 3,  nome: 'Pizza Quatro Queijos',preco: 56.0,  categoria: 'Pizzas' },
  { id: 4,  nome: 'Hambúrguer Clássico', preco: 32.0,  categoria: 'Lanches' },
  { id: 5,  nome: 'Hambúrguer Cheddar',  preco: 36.0,  categoria: 'Lanches' },
  { id: 6,  nome: 'Frango Grelhado',     preco: 42.0,  categoria: 'Pratos' },
  { id: 7,  nome: 'Filé à Parmegiana',   preco: 58.0,  categoria: 'Pratos' },
  { id: 8,  nome: 'Batata Frita',        preco: 22.0,  categoria: 'Acompanhamentos' },
  { id: 9,  nome: 'Onion Rings',         preco: 24.0,  categoria: 'Acompanhamentos' },
  { id: 10, nome: 'Refrigerante Lata',   preco: 8.0,   categoria: 'Bebidas' },
  { id: 11, nome: 'Suco Natural',        preco: 12.0,  categoria: 'Bebidas' },
  { id: 12, nome: 'Água Mineral',        preco: 6.0,   categoria: 'Bebidas' },
  { id: 13, nome: 'Cerveja Long Neck',   preco: 14.0,  categoria: 'Bebidas' },
  { id: 14, nome: 'Sorvete',             preco: 16.0,  categoria: 'Sobremesas' },
  { id: 15, nome: 'Pudim',               preco: 14.0,  categoria: 'Sobremesas' },
  { id: 16, nome: 'Brownie c/ Sorvete',  preco: 22.0,  categoria: 'Sobremesas' },
];

const UNIDADES = [
  { id: 1, nome: 'Centro',        endereco: 'R. XV de Novembro, 1240', ativo: true,  receita: 0, mesasAbertas: 0, pedidosAtivos: 0 },
];

function buildMesas() {
  return Array.from({ length: 12 }, (_, i) => ({ id: i + 1, numero: i + 1, status: 'livre' }));
}

export function getMockData() {
  const mesas = buildMesas();
  const pedidos = [];
  return {
    produtos: PRODUTOS,
    unidades: UNIDADES,
    mesas,
    pedidos,
    hourly: Array.from({ length: 13 }, (_, i) => ({ hora: `${10 + i}:00`, valor: 0 })),
    topProdutos: [],
    porCanal: { mesa: 0, balcao: 0, delivery: 0 },
    historico: [
      { dia: 'Seg', valor: 0 }, { dia: 'Ter', valor: 0 }, { dia: 'Qua', valor: 0 },
      { dia: 'Qui', valor: 0 }, { dia: 'Sex', valor: 0 }, { dia: 'Sáb', valor: 0 }, { dia: 'Dom', valor: 0 },
    ],
    metrics: { receita: 0, pedidos: 0, ticketMedio: 0, mesasAbertas: 0 },
  };
}

export const FMT_BRL = (n) => 'R$ ' + Number(n || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const FMT_INT = (n) => Number(n || 0).toLocaleString('pt-BR');
