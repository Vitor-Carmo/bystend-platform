# Análise do Banco de Dados

## SGBD

**SQLite** — arquivo local definido por `DATABASE_URL`.

Exemplo `.env.example`:

```
DATABASE_URL="file:./dev.db"
```

Arquivo criado na **raiz do monorepo** ao rodar `db:push` (cwd = raiz). Git ignora `*.db`.

## Entidades principais

### `Content` (núcleo)

Armazena todo material educacional unificado.

| Campo | Significado |
|-------|-------------|
| `type` | `video`, `nano`, `micro`, `seasonal`, `slogan`, `theme_bundle` |
| `title`, `summary`, `body` | Textos |
| `url`, `mediaUrl` | Links externos |
| `audience` | Público/trilha (default `GERAL`) |
| `violenceType` | ASSÉDIO MORAL, MICROAGRESSÕES, etc. |
| `theme` | Tema educacional |
| `sensitivity`, `legalRisk` | Classificação dos CSVs |
| `layerId`, `categoryId` | FKs metodológicas |
| `weekSchedule`, `seasonalDate`, `seasonalPeriod` | Programação |
| `searchText` | Campo denormalizado para busca |
| `metadata` | JSON string com origem seed |
| `externalId` | ID do CSV original |

### `EducationLayer`

8 registros fixos (seed de `LAYER_DEFINITIONS`):

1. Conhecimento Básico → 8. Prevenção Contínua

Unique: `number`, `slug`.

### `Category`

8 categorias padrão (microagressões, discriminação, assédios, etc.).

### `NanoCard`

Até 7 textos curtos por conteúdo nano/micro; `order` sequencial.

### `Slogan`

Textos curtos; pode linkar `categoryId`; **não** aparece como `Content.type=slogan` necessariamente — ver seed `slogans.ts`.

### `LearningPath` + `LearningPathItem`

Trilha default: slug `reconhecer-e-agir`. Itens: 2 conteúdos micro/nano por camada + 3 vídeos.

### `QuizQuestion`

6 perguntas hardcoded em `seed/quiz.ts`; `options` serializado; link opcional a `content` e `layer`.

### `UserProgress`

| Campo | Uso atual |
|-------|-----------|
| `sessionId` | UUID do localStorage |
| `quizScore`, `quizTotal` | Incrementados em POST `/quiz/answer` |
| `pathId`, `completedIds` | **Pouco usados** — trilha não persiste progresso |

### `ChatSession` / `ChatMessage`

Persistem histórico server-side; UI **não lista** histórico ao reabrir chat.

## Relacionamentos e cardinalidade

| De | Para | Cardinalidade |
|----|------|---------------|
| Category | Content | 1:N opcional |
| EducationLayer | Content | 1:N opcional |
| Content | NanoCard | 1:N cascade delete |
| LearningPath | LearningPathItem | 1:N cascade |
| Content | LearningPathItem | N:M via junction |
| ChatSession | ChatMessage | 1:N cascade |

## Fluxo de persistência

### Leitura (hot path)

1. **Biblioteca:** `content.findMany` + filtros + include
2. **Busca:** `findMany` limit 200 → score em JS
3. **Chat RAG:** search + `findUnique` por id (N+1 queries)
4. **Detalhe:** `findUnique` + nanoCards

### Escrita

1. **Seed:** mass `create` / `upsert` (dev only)
2. **Quiz answer:** `userProgress.upsert`
3. **Chat:** `chatSession` + 2× `chatMessage.create`

## Performance — gargalos prováveis

| Gargalo | Causa | Severidade MVP |
|---------|-------|----------------|
| Busca in-memory | Até 200 rows + scoring JS | Média com milhares de contents |
| RAG N+1 | 1 query por hit de busca | Média |
| Sem FTS SQLite | `searchText` não indexado para full-text | Alta em escala |
| Chat sem limite de histórico | Mensagens crescem por sessão | Baixa no MVP |
| `seasonal` filter | Filtra mês em JS após fetch all `type=seasonal` | Baixa |

## Estimativa de volume (seed)

Dependente dos CSVs; plano MVP cita ~15 vídeos + centenas de linhas nano. Ordem de grandeza: **centenas** de `Content`, **milhares** de `NanoCard`.

## Integridade

- `LearningPathItem`: `@@unique([pathId, contentId])`
- FKs com `onDelete: Cascade` em filhos
- Quiz `correctIndex` int — sem constraint 0..n-1 no DB

## Dados sensíveis

Por design, **não** há campos PII (nome, email). `sessionId` é pseudônimo. Mensagens de chat podem conter relatos do usuário — **dado sensível volátil** armazenado em SQLite local.

## Backup e ambientes

Não há script de backup. `.gitignore` exclui `*.db`. Para staging/prod seria necessário pipeline de migrate + volume persistente.
