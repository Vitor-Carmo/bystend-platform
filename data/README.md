# Dados para seed

Coloque aqui **um** dos formatos:

1. **Planilha Excel (recomendado):** `VÍDEOS, NANO E MICRO CONTEÚDOS EDUCATIVOS.xlsx`
2. **CSVs exportados** do Google Sheets (um arquivo por aba, nomes longos com prefixo `...xlsx -`)

O seed lê o `.xlsx` diretamente (abas 1. VÍDEOS, 2.3. NANO CONTEÚDOS, etc.).

No Docker, esta pasta é montada em `/app/data/csvs`.

## Fontes de conhecimento (PDF → RAG)

Textos extraídos de `docs/byst-end-materiais/` ficam em `data/knowledge-sources/`:

| Arquivo | Categoria no seed |
|---------|-------------------|
| `nr1.txt` | Fontes Oficiais e Marco Legal |
| `oit-c190.txt` | Fontes Oficiais e Marco Legal |
| `oit-relatorio-2018.txt` | Fontes Oficiais e Marco Legal |
| `oit-ambientes-seguros.txt` | Fontes Oficiais e Marco Legal |
| `think-eva.txt` | Visão de Mercado (curado; PDF original é imagem) |

Reextrair PDFs: `py scripts/extract-knowledge-sources.py`

## Violentômetro (frontend)

Escala estruturada em `data/violentometro.ts` (20 níveis, frio → quente).
