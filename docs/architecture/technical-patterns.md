# Padrões Técnicos

## Padrões arquiteturais identificados

| Padrão | Evidência |
|--------|-----------|
| **Monorepo workspaces** | `package.json` raiz |
| **Layered API** | routes → services → prisma |
| **BFF ausente** | Web chama API diretamente |
| **Repository implícito** | Prisma usado diretamente (sem camada repo) |
| **RAG leve** | search + prompt stuffing |
| **Graceful degradation** | Gemini → template fallback; API offline → UI vazia |
| **Anemic domain** | Lógica em services/functions, modelos Prisma passivos |

## Convenções de código

### Nomenclatura (`.cursor/rules/bystend.mdc`)

| Artefato | Convenção |
|----------|-----------|
| Componentes React | PascalCase |
| Funções | camelCase |
| Rotas URL | kebab-case (`/biblioteca`, `/conteudo/[id]`) |
| Pacotes npm | `@bystend/*` |

### API

- Prefixo `/api` no Express; web adiciona `/api` no helper
- Validação Zod inline nas rotas (não em arquivos separados)
- `try/catch` + `next(e)` em cada handler async
- Respostas JSON diretas do Prisma (sem mapper DTO)

### TypeScript

- `strict: true`
- API: ESM + extensão `.js` nos imports relativos
- Evitar `any` (regra; casts pontuais existem)

### React / Next

- App Router (`app/`)
- Server Components por padrão nas páginas de listagem
- `"use client"` apenas onde há interatividade
- CSS global único (`globals.css`) — sem Tailwind no repo
- Componentes em `src/components/`

### Prisma

- Singleton com cache em `globalThis` (dev)
- `include` explícito para relações necessárias
- JSON em campos `String` com `JSON.parse`/`stringify`

### Seed

- Wipe total antes de reimportar
- Módulos por fonte CSV (`videos.ts`, `nano-contents.ts`, ...)
- `console.log` / `console.warn` para diagnóstico

## Padrões de conteúdo sensível

Centralizados em rules + código:

| Regra | Implementação |
|-------|---------------|
| Não afirmar "é assédio" | SYSTEM_PROMPT Gemini + fallback copy |
| Disclaimer | `Disclaimer.tsx` + `CHAT_DISCLAIMER` |
| Alto risco jurídico | `isHighLegalRisk`, UI warning no chat |
| Tom educativo | Textos seed quiz, explanations |

## Estrutura de erro

```typescript
// Zod
res.status(400).json({ error: "Dados inválidos", details: err.errors });
// 404 manual
res.status(404).json({ error: "..." });
// default
res.status(500).json({ error: "Erro interno do servidor" });
```

## Padrões de busca

1. Tokenização simples (split espaços, len > 2)
2. Strip emojis (`normalize.ts`)
3. Score por substring (+2 match, +1 prefix)
4. Sem stemming PT-BR, sem sinônimos

## Padrões de UI

- Cards clicáveis (`ContentCard` → Link)
- Badges para type, violenceType, layer
- `Disclaimer` em páginas sensíveis
- Progress bar trilha estática (CSS `.progress-bar`)

## Anti-padrões evitados intencionalmente

- Gamificação agressiva (regra de produto)
- Diagnóstico jurídico automático
- Inventar canais RH específicos

## Gaps de padronização

| Gap | Onde |
|-----|------|
| Tipos duplicados web vs shared | pages/*.tsx |
| Um único `routes/index.ts` grande | 250+ linhas |
| Sem testes | repo inteiro |
| Sem logger estruturado | `console.error` |
