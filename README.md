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
| `OPENAI_API_KEY` | Opcional para IA avançada futura |

## Decisões técnicas

- **Seed estruturado** a partir de 6 CSVs preservando camadas, sensibilidade e risco jurídico
- **Chat rule-based + RAG textual** no MVP para reduzir alucinação sem depender de API externa
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
