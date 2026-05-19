---
name: bystend-architecture-context
description: >-
  Loads full Byst.end platform architecture documentation before coding or
  answering questions. Use at the start of every task in bystend-platform,
  when exploring the monorepo, implementing features, fixing bugs, refactoring,
  reviewing PRs, or when the user mentions architecture, docs, context, onboarding,
  API, Prisma, chat, RAG, or monorepo structure.
---

# Byst.end — Contexto de arquitetura

## Quando aplicar

**Sempre** que entrar neste repositório (`bystend-platform`) para trabalho não trivial (implementar, corrigir, refatorar, revisar, explicar o sistema).

Não pule a leitura assumindo que já conhece o projeto — a documentação em `docs/architecture/` é a fonte de verdade.

## O que fazer primeiro (obrigatório)

Use a ferramenta **Read** e carregue os arquivos abaixo **antes** de editar código ou responder com detalhes arquiteturais.

### Lote 1 — contexto essencial (ler em paralelo)

| Arquivo | Motivo |
|---------|--------|
| `docs/architecture/llm-context.md` | Mapa completo para agentes |
| `docs/architecture/README.md` | Índice da documentação |
| `docs/architecture/architecture-overview.md` | Visão geral e domínios |
| `.cursor/rules/bystend.mdc` | Regras de produto e código |

### Lote 2 — monorepo e apps (ler em paralelo)

| Arquivo |
|---------|
| `docs/architecture/monorepo-analysis.md` |
| `docs/architecture/apps-analysis.md` |
| `docs/architecture/packages-analysis.md` |
| `docs/architecture/typescript-architecture.md` |

### Lote 3 — dados e fluxos (ler em paralelo)

| Arquivo |
|---------|
| `docs/architecture/prisma-architecture.md` |
| `docs/architecture/database-analysis.md` |
| `docs/architecture/request-lifecycle.md` |
| `docs/architecture/authentication-flow.md` |

### Lote 4 — integrações e operação (ler em paralelo)

| Arquivo |
|---------|
| `docs/architecture/integrations.md` |
| `docs/architecture/env-analysis.md` |
| `docs/architecture/dependency-graph.md` |

### Lote 5 — qualidade e riscos (ler em paralelo)

| Arquivo |
|---------|
| `docs/architecture/technical-patterns.md` |
| `docs/architecture/architectural-decisions.md` |
| `docs/architecture/technical-debt.md` |
| `docs/architecture/anti-patterns.md` |
| `docs/architecture/risks.md` |

## Leitura focada (atalho)

Se a tarefa for **muito pequena** (typo, comentário, rename local), leia apenas o **Lote 1**.

Se a tarefa tocar um domínio específico, após o Lote 1 leia o doc correspondente:

| Tarefa | Doc extra |
|--------|-----------|
| API / rotas / services | `apps-analysis.md`, `request-lifecycle.md` |
| Prisma / seed / CSV | `prisma-architecture.md`, `database-analysis.md`, `integrations.md` |
| Chat / Gemini / RAG | `integrations.md`, `authentication-flow.md` |
| Next.js / UI | `apps-analysis.md`, `technical-patterns.md` |
| Env / deploy | `env-analysis.md` |
| Refactor grande | Lotes 2–5 completos |

## Checklist pós-leitura

Antes de codar, confirme mentalmente:

- [ ] Monorepo: `apps/web`, `apps/api`, `packages/shared`, `prisma/` na raiz
- [ ] API em `/api/*`, web chama `NEXT_PUBLIC_API_URL`
- [ ] **Sem autenticação** — sessão anônima `localStorage`
- [ ] Chat: Gemini + RAG textual; fallback se falhar
- [ ] Tom Byst.end: educativo, sem veredito legal definitivo, disclaimer + fontes
- [ ] API imports com sufixo `.js` (NodeNext)

## Snapshot mínimo (se Read falhar)

```
bystend-platform = Next 15 (3000) + Express 5 (4000) + SQLite/Prisma + @bystend/shared
Entry API: apps/api/src/index.ts → routes/index.ts → services/* → prisma
Entry Web: apps/web/src/app/**/page.tsx, lib/api.ts
Contexto IA: apps/api/src/services/chat.ts + rag-context.ts + search.ts
Seed: apps/api/src/seed/index.ts (destrutivo, CSVs)
```

## Após carregar contexto

1. Siga `.cursor/rules/bystend.mdc` em toda mudança
2. Novos endpoints → Zod + `{ error, details? }` + README
3. Não inventar auth, políticas RH ou parecer jurídico
4. Para dúvidas profundas, cite caminhos reais dos arquivos lidos

## Referência rápida

Lista completa de paths: [docs-index.md](docs-index.md)
