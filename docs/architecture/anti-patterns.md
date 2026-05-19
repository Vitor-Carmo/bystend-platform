# Anti-patterns

Padrões problemáticos presentes ou evitados no projeto — útil para LLMs não replicarem erros.

## Presentes (evitar replicar)

### 1. God router

**Onde:** `apps/api/src/routes/index.ts` — todas as rotas + error handler em um arquivo.

**Problema:** Dificulta navegação e code review; alto risco de conflitos merge.

**Correção:** `routes/contents.ts`, `routes/chat.ts`, etc.

---

### 2. Fetch-then-filter em escala

**Onde:** `search.ts` carrega até 200 registros e pontua em JS.

**Problema:** O(n) por request; não usa índices SQL para texto.

**Correção:** FTS5, `LIKE` indexado, ou vector search.

---

### 3. N+1 no RAG

**Onde:** `rag-context.ts` — `findUnique` por cada hit.

**Problema:** Latência linear com `limit`.

**Correção:** `findMany({ where: { id: { in: ids } } })`.

---

### 4. Contrato API duplicado no frontend

**Onde:** Interfaces locais em cada `page.tsx`.

**Problema:** Drift quando API muda; shared package subutilizado.

**Correção:** Import types from `@bystend/shared` ou gerar OpenAPI client.

---

### 5. Silenciar erros SSR

**Onde:** `try { api() } catch { /* offline */ }` sem log.

**Problema:** Build/deploy com API down parece "sem conteúdo" sem diagnóstico.

**Correção:** Log server-side ou banner "API indisponível".

---

### 6. Progresso de UI mentiroso

**Onde:** `trilha/page.tsx` — `completed = 0` sempre.

**Problema:** UX enganosa ("progresso demonstrativo" só no texto pequeno).

**Correção:** Integrar `UserProgress` ou remover barra.

---

### 7. CORS permissivo

**Onde:** `cors({ origin: true })`.

**Problema:** Qualquer site pode chamar API do browser do usuário (com caveats).

**Correção:** Whitelist de origens em produção.

---

### 8. Seed com path absoluto de dev

**Onde:** `seed/index.ts` → `C:\Users\lrzezak\Downloads`.

**Problema:** Não portável; surpresa em CI/outras máquinas.

**Correção:** Apenas `CSV_DATA_DIR` + `data/`.

---

### 9. JSON em string sem schema

**Onde:** `QuizQuestion.options`, `ChatMessage.sources`.

**Problema:** `JSON.parse` pode throw fora do handler (quiz GET).

**Correção:** Zod parse na leitura; coluna Json nativa se mudar provider.

---

### 10. Inconsistência documentação vs comportamento

**Onde:** README diz chat sem LLM; código usa Gemini.

**Problema:** Onboarding incorreto.

**Correção:** Atualizar README.

---

## Evitados com sucesso (manter)

| Anti-pattern | Como evitamos |
|--------------|---------------|
| Lógica de negócio pesada em React | Estado UI only (regra) |
| Afirmar assédio categoricamente | Prompts + copy |
| Inventar políticas RH | Guardrails explícitos |
| Gamificação inadequada | Regras de tom |
| Acoplar web ao Prisma | API boundary respeitada |

## Anti-patterns arquiteturais **não** cometidos

- Microserviços prematuros
- Over-engineering com DDD completo
- Dependência circular web→api npm (só HTTP)

## Para code review de LLM

Antes de merge, verificar:

- [ ] Nova rota tem Zod + error format padrão?
- [ ] Conteúdo sensível respeita tom Byst.end?
- [ ] Chat cita fontes e disclaimer?
- [ ] Não adicionou auth parcial inconsistente?
- [ ] Não moveu Prisma para o Next client-side?
