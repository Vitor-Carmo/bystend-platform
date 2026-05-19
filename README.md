# Byst.end — Plataforma Educacional MVP

Plataforma digital para prevenção de assédio, transformando os materiais da Byst.end em uma experiência educativa, segura e interativa para colaboradores, lideranças e áreas de apoio.

## Problema

Organizações precisam de uma forma acessível de educar sobre prevenção de assédio sem reduzir o tema a uma biblioteca estática de arquivos. Colaboradores precisam aprender, buscar orientação inicial e refletir sobre situações sensíveis com responsabilidade.

## Funcionalidades

- **Biblioteca**: vídeos, nano/microconteúdos, slogans e conteúdos sazonais com filtros por tema, camada, tipo e risco
- **Busca inteligente**: busca textual com ranking e snippets (preparada para embeddings)
- **Trilha educativa**: progressão pelas 8 camadas metodológicas
- **Quiz**: perguntas com feedback educativo sem julgamento definitivo
- **Chat orientativo**: respostas baseadas na base com fontes e disclaimers
- **API documentada**: endpoints REST separados do frontend

## Stack

- Frontend: Next.js 15, React 19, TypeScript
- Backend: Express 5, TypeScript
- Banco: SQLite + Prisma
- Monorepo: npm workspaces (`apps/web`, `apps/api`, `packages/shared`)

## Como rodar com Docker

Stack completa (API + Web + SQLite persistente) via Docker Compose.

### Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) e Docker Compose v2
- CSVs da Byst.end na pasta `data/` (veja [`data/README.md`](data/README.md))

### Subir os containers

```bash
cd bystend-platform
cp .env.docker.example .env
# Ajuste GEMINI_API_KEY e confira CSV_HOST_PATH=./data com os CSVs dentro de data/
docker compose --env-file .env up --build
```

Na **primeira** execução, use `SEED_ON_START=true` no `.env` para popular o banco. Nas próximas, defina `SEED_ON_START=false` (o seed é destrutivo).

| Serviço | URL |
|---------|-----|
| Web | http://localhost:3000 |
| API health | http://localhost:4000/api/health |

### Comandos úteis

```bash
npm run docker:up      # equivalente a docker compose up --build
npm run docker:down    # para os containers
npm run docker:logs    # acompanha logs
```

### Variáveis Docker (`.env.docker.example`)

| Variável | Descrição |
|----------|-----------|
| `API_PORT` / `WEB_PORT` | Portas expostas no host |
| `NEXT_PUBLIC_API_URL` | URL da API **vista pelo navegador** (padrão `http://localhost:4000`) |
| `CSV_HOST_PATH` | Pasta local dos CSVs montada no container |
| `SEED_ON_START` | `true` para rodar seed na subida da API |
| `GEMINI_API_KEY` | Chat com Gemini (opcional) |

Arquivos Docker: [`docker-compose.yml`](docker-compose.yml), [`docker/Dockerfile.api`](docker/Dockerfile.api), [`docker/Dockerfile.web`](docker/Dockerfile.web).

## Como rodar localmente

### Pré-requisitos

- Node.js 20+
- CSVs da Byst.end (pasta `Downloads` ou `data/`)

### Instalação

```bash
cd bystend-platform
cp .env.example .env
npm install
npm run db:push
npm run db:seed
npm run dev
```

- Web: http://localhost:3000
- API: http://localhost:4000/api/health

### Variáveis de ambiente

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | SQLite (`file:./prisma/dev.db`) |
| `CSV_DATA_DIR` | Pasta com os CSVs exportados |
| `API_PORT` | Porta da API (padrão 4000) |
| `NEXT_PUBLIC_API_URL` | URL da API para o frontend |
| `GEMINI_API_KEY` | Chave do Google Gemini para o chat com RAG |
| `OPENAI_API_KEY` | Reservado para uso futuro |

## Documentação de arquitetura

Documentação técnica detalhada em [`docs/architecture/`](docs/architecture/README.md).

Para agentes Cursor neste repositório, a skill **`bystend-architecture-context`** (`.cursor/skills/bystend-architecture-context/`) orienta a leitura ordenada de todos os documentos antes de codar.

## Decisões técnicas

- **Seed estruturado** a partir de 6 CSVs preservando camadas, sensibilidade e risco jurídico
- **Chat com RAG + Google Gemini** (`gemini-1.5-flash`): recuperação textual no SQLite e resposta baseada exclusivamente no contexto recuperado
- **Guardrails** por nível de risco jurídico e linguagem não conclusiva
- **Sessão anônima** via `localStorage` para progresso de quiz

## Limitações conhecidas

- Busca semântica por embeddings não implementada (busca textual ponderada)
- Chat não usa LLM externo por padrão
- Admin de conteúdos não incluído no MVP
- Progresso da trilha é demonstrativo (não persiste todas as etapas)

## Próximos passos

- Embeddings para busca semântica
- Integração OpenAI com prompts e fontes obrigatórias
- Painel admin para cadastro de conteúdos
- Trilhas por público (líderes, RH, colaboradores)
- Modo anônimo reforçado e auditoria de uso

## Apresentação (5–7 min)

1. Problema e proposta Byst.end (1 min)
2. Demo: Home → Biblioteca → Busca por situação (2 min)
3. Trilha + Quiz com feedback responsável (1 min)
4. Chat com fontes e disclaimer (1 min)
5. Arquitetura, IA responsável e próximos passos (1 min)
