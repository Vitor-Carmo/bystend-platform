# Documentação de Arquitetura — Byst.end Platform

Documentação técnica gerada por engenharia reversa do monorepo `bystend-platform`. Objetivo: onboarding, evolução arquitetural e **contexto persistente para LLMs**.

## Índice

| Documento | Conteúdo |
|-----------|----------|
| [architecture-overview.md](./architecture-overview.md) | Visão geral, domínios, diagramas |
| [monorepo-analysis.md](./monorepo-analysis.md) | Workspaces, pastas, acoplamentos |
| [apps-analysis.md](./apps-analysis.md) | `apps/web` e `apps/api` em profundidade |
| [packages-analysis.md](./packages-analysis.md) | `@bystend/shared` |
| [dependency-graph.md](./dependency-graph.md) | Grafo de dependências internas/externas |
| [typescript-architecture.md](./typescript-architecture.md) | TSConfig, builds, tipos |
| [prisma-architecture.md](./prisma-architecture.md) | ORM, schema, acesso a dados |
| [database-analysis.md](./database-analysis.md) | Entidades, relações, performance |
| [authentication-flow.md](./authentication-flow.md) | Sessões anônimas (sem auth tradicional) |
| [request-lifecycle.md](./request-lifecycle.md) | HTTP, rotas, erros |
| [integrations.md](./integrations.md) | Gemini, CSVs, externos |
| [env-analysis.md](./env-analysis.md) | Variáveis de ambiente |
| [technical-patterns.md](./technical-patterns.md) | Padrões e convenções |
| [architectural-decisions.md](./architectural-decisions.md) | ADRs implícitos |
| [technical-debt.md](./technical-debt.md) | Débitos conhecidos |
| [anti-patterns.md](./anti-patterns.md) | Riscos de design |
| [risks.md](./risks.md) | Riscos operacionais e de produto |
| **[llm-context.md](./llm-context.md)** | **Arquivo principal para futuras LLMs** |

## Leitura recomendada

1. **Humanos novos no projeto:** `architecture-overview.md` → `monorepo-analysis.md` → `apps-analysis.md`
2. **LLMs / automação:** começar por **`llm-context.md`**
3. **Agentes Cursor neste repo:** usar a skill `bystend-architecture-context` em `.cursor/skills/bystend-architecture-context/SKILL.md` (carrega esta pasta de forma ordenada)
3. **Dados e persistência:** `prisma-architecture.md` + `database-analysis.md`
4. **Chat e IA:** `integrations.md` + `authentication-flow.md` (sessão)

## Escopo do sistema

- **Produto:** plataforma educativa MVP sobre prevenção de assédio (base Byst.end)
- **Apps:** Next.js 15 (web) + Express 5 (API REST)
- **Dados:** SQLite via Prisma na raiz do monorepo
- **Shared:** tipos e constantes em `@bystend/shared`

## Manutenção desta documentação

Atualizar quando:

- Novos workspaces (`apps/*`, `packages/*`)
- Mudanças em `prisma/schema.prisma`
- Novos endpoints em `apps/api/src/routes/`
- Novas rotas em `apps/web/src/app/`
- Integrações externas (LLM, auth, filas)

Última revisão baseada no código em: **maio/2026**.
