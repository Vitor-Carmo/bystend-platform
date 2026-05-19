# Análise dos Packages

## Inventário

O monorepo possui **um** package compartilhado: `@bystend/shared` em `packages/shared/`.

```
packages/shared/
├── package.json
├── tsconfig.json
└── src/
    └── index.ts    # Único arquivo fonte
```

## Objetivo

Fornecer **contratos TypeScript** e **constantes de domínio** reutilizáveis entre API e Web, evitando divergência nas respostas JSON de chat, busca e quiz.

## Classificação arquitetural

| Critério | Classificação |
|----------|---------------|
| Shared Kernel? | **Parcial** — só tipos + disclaimer + camadas |
| Domain layer? | **Não** — sem entidades com comportamento |
| Infra layer? | **Não** |
| Core business? | **Definições estáticas** das 8 camadas Byst.end |

É um **pacote de contratos**, não uma biblioteca de domínio rica.

## APIs exportadas (`src/index.ts`)

### Tipos

| Export | Uso |
|--------|-----|
| `ContentType` | Union de tipos de conteúdo |
| `ContentSummary` | Shape resumido de conteúdo |
| `SearchResult` | Resultado de busca com `score`, `snippet` |
| `ChatSource` | Fonte citada no chat |
| `ChatResponse` | Payload completo do POST `/chat` |
| `QuizAnswerResponse` | Resposta do POST `/quiz/answer` |

### Constantes

| Export | Uso |
|--------|-----|
| `CHAT_DISCLAIMER` | Texto legal retornado em todo chat |
| `LAYER_DEFINITIONS` | 8 camadas (number, slug, name, description) |

## Quem consome

| Consumidor | Importa | Observação |
|------------|---------|------------|
| `apps/api` | `CHAT_DISCLAIMER`, tipos Chat/Search | Uso ativo |
| `apps/api/seed/layers.ts` | `LAYER_DEFINITIONS` | Seed das camadas |
| `apps/web` | Transpilado via Next | **Pouco ou nenhum import direto** nas pages atuais — tipos duplicados inline |

**Risco:** web redefine interfaces localmente (`ContentItem`, `SearchResult`) em vez de importar shared → drift de contrato.

## Build

```json
"main": "./dist/index.js",
"types": "./dist/index.d.ts",
"scripts": { "build": "tsc -p tsconfig.json" }
```

- Estende `tsconfig.base.json`
- `outDir: dist`, `declaration: true`
- Ordem no build raiz: **shared primeiro**

## Padrões compartilhados

- `ContentType` alinhado ao campo string `Content.type` no Prisma (não enum Prisma)
- Disclaimer único para consistência legal entre API e potencial UI

## Riscos de acoplamento

| Risco | Mitigação sugerida |
|-------|---------------------|
| Tipos shared desatualizados vs Prisma | Gerar tipos a partir de Prisma ou Zod schemas compartilhados |
| Web não usa shared | Importar tipos nas pages e `api.ts` |
| `LAYER_DEFINITIONS` duplicado no DB após seed | Fonte única já é shared; seed apenas persiste |

## Evolução provável

Novos packages candidatos (não existem hoje):

- `@bystend/validation` — schemas Zod compartilhados
- `@bystend/api-client` — client tipado para o web
- `@bystend/content-domain` — se a lógica de normalização sair da API

## Dependências externas do package

Apenas `typescript` (dev). **Zero** runtime deps — ideal para shared types.
