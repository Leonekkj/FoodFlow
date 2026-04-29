# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FoodFlow is a restaurant management system (POS + ordering) built as a monorepo with an Express/SQLite backend and a Vite/React frontend. The language in use is **Brazilian Portuguese** (UI labels, DB fields, seed data).

## Commands

From the repo root:

```bash
npm run dev          # starts both server and client concurrently
npm run dev:server   # server only (node --watch server/index.js)
npm run dev:client   # client only (cd client && npm run dev)
```

From `server/`:

```bash
npm test             # vitest run (all server tests)
```

## Architecture

### Monorepo layout

```
/               ← root package.json manages concurrently
server/         ← Express API (ESM, better-sqlite3)
client/         ← Vite + React frontend
```

### Server (`server/`)

- **`database.js`** — single export `createDb(path?)`. Opens (or creates) the SQLite file, enables WAL + foreign keys, runs `CREATE TABLE IF NOT EXISTS` migrations, then seeds once on first run.
- **`index.js`** — Express entry point; imports `createDb` and mounts route handlers.
- DB schema: `produtos`, `mesas`, `pedidos`, `itens_pedido`, `caixa`, `unidades`.
- `pedidos.tipo` is either `'mesa'` or `'delivery'`; delivery orders store `endereco`, mesa orders store `mesa_id`.
- Tests use vitest + supertest against an in-memory DB (`createDb(':memory:')`).

### Client (`client/`)

- Vite 5 + React 18, plain JavaScript (no TypeScript). `npm run dev` starts on port 5173.
- All styling is CSS-in-JS inline styles using theme tokens from `src/atoms.jsx` — no CSS framework.
- Design: **Option A — Claro & Limpo** — white background, blue (`#185FA5`) only for the highlight card. Primary brand color: `#185FA5`.
- File structure:
  - `src/atoms.jsx` — `makeTheme()`, `Icon`, `Btn`, `Badge`, `StatusDot`, `MONO` + status helpers
  - `src/data.jsx` — `getMockData()` fallback + `FMT_BRL` / `FMT_INT` formatters
  - `src/shell.jsx` — `Sidebar`, `Topbar`, `Panel`, `PanelHeader`, `NAV`
  - `src/pages-a.jsx` — `DashboardPage`, `MesasPage`, `PedidosPage`
  - `src/pages-b.jsx` — `CaixaPage`, `RelatoriosPage`, `UnidadesPage`
  - `src/api.js` — thin fetch wrapper (`api.get/post/patch`)
  - `src/App.jsx` — root component; loads `/api/dashboard` on mount, falls back to mock data
  - `src/main.jsx` — Vite entry point
- Vite proxy: all `/api` requests forwarded to `http://localhost:3001`.

### API routes (`server/index.js`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/dashboard` | Full data bundle (metrics, mesas, pedidos, produtos, hourly, topProdutos, porCanal, historico, unidades) |
| GET | `/api/produtos` | Active products |
| GET | `/api/mesas` | All tables with `total_aberto` |
| PATCH | `/api/mesas/:id` | Update table status |
| GET | `/api/pedidos` | Open orders with items (`?status=` filter) |
| GET | `/api/pedidos/:id` | Single order with items |
| POST | `/api/pedidos` | Create order + items in transaction |
| PATCH | `/api/pedidos/:id` | Update order status |
| POST | `/api/caixa` | Close account (inserts caixa, sets pedido fechado, frees mesa) |
| GET | `/api/unidades` | Units with live stats |
