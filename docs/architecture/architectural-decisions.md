# Decisões Arquiteturais (ADRs implícitos)

Registro reverso das decisões inferidas do código e documentação existente.

---

## ADR-001: Monorepo npm workspaces

**Status:** Aceito  
**Contexto:** MVP hackathon com frontend e backend separados + tipos compartilhados.  
**Decisão:** `apps/web`, `apps/api`, `packages/shared` sob workspaces npm.  
**Consequências:** Um `npm install`; build manual ordenado; sem cache turbo.

---

## ADR-002: API Express separada do Next

**Status:** Aceito  
**Contexto:** Requisito de API REST documentada independente do frontend.  
**Decisão:** Express 5 em `apps/api`, não Next Route Handlers.  
**Consequências:** CORS necessário; dois processos em dev; deploy dual.

**Alternativa rejeitada (implícita):** Next API routes only — reduziria separação.

---

## ADR-003: SQLite + Prisma na raiz

**Status:** Aceito  
**Contexto:** Zero infra, demo local rápida.  
**Decisão:** SQLite, schema em `prisma/`, `db push` sem migrations.  
**Consequências:** Escala limitada; path DB deve ser consistente.

---

## ADR-004: Conteúdo unificado em `Content`

**Status:** Aceito  
**Contexto:** Múltiplos formatos (vídeo, nano, micro, seasonal) com metadados comuns.  
**Decisão:** Single table `Content` com discriminação `type` string.  
**Consequências:** Queries simples; campos opcionais nullable; tipo não enforced no DB.

**Alternativa:** Tabelas por tipo — mais normalizado, mais joins.

---

## ADR-005: Busca textual no MVP, embeddings depois

**Status:** Aceito (fase 1)  
**Decisão:** Score em memória sobre `searchText` + campos texto.  
**Consequências:** Implementação rápida; recall limitado em linguagem natural longa.

---

## ADR-006: RAG por concatenação de chunks

**Status:** Aceito  
**Decisão:** Top-N da busca → montar texto → prompt Gemini.  
**Consequências:** Sem vector DB; budget 12k chars; possível N+1 queries.

---

## ADR-007: Gemini com fallback template

**Status:** Aceito  
**Decisão:** Tentar modelos Gemini; em falha, resposta estática empática.  
**Consequências:** Demo funciona offline de LLM; qualidade inferior sem API key.

---

## ADR-008: Sessão anônima localStorage

**Status:** Aceito  
**Contexto:** Privacidade, sem cadastro no MVP.  
**Decisão:** UUID em `bystend_session`; progresso quiz opcional no servidor.  
**Consequências:** Sem auth; progresso trilha não integrado; chat history não exibido.

---

## ADR-009: Seed destrutivo a partir de CSVs

**Status:** Aceito  
**Decisão:** `deleteMany` em cascata + reimport completo.  
**Consequências:** Não usar em produção com dados editados; dependência de filenames fixos.

---

## ADR-010: Shared package só para tipos/constantes

**Status:** Aceito  
**Decisão:** `@bystend/shared` sem runtime logic.  
**Consequências:** Web subutiliza; validação Zod não compartilhada.

---

## ADR-011: Guardrails no prompt, não em pós-processamento

**Status:** Aceito  
**Decisão:** `systemInstruction` + contexto RAG; sem filtro de saída estruturado.  
**Consequências:** Possível violação ocasional de tom; depende do modelo.

---

## ADR-012: UI sem framework CSS utility

**Status:** Aceito  
**Decisão:** CSS custom properties em `globals.css`.  
**Consequências:** Menos deps; estilização manual.

---

## Trade-offs resumidos

| Decisão | Ganho | Custo |
|---------|-------|-------|
| SQLite | Simplicidade | Escala / concorrência |
| API separada | Clareza REST | Ops dupla |
| String types no DB | Flexibilidade seed | Integridade fraca |
| Sem auth | Time-to-market | Segurança / abuse |
| db push | Velocidade dev | Migrações prod |
