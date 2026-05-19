# Dados para seed (Docker e local)

Coloque aqui os CSVs exportados da base Byst.end. O seed procura arquivos com nomes como:

- `VÍDEOS, NANO E MICRO CONTEÚDOS EDUCATIVOS.xlsx - 1. VÍDEOS (PALESTRAS, WEBINARES.csv`
- `VÍDEOS, NANO E MICRO CONTEÚDOS EDUCATIVOS.xlsx - 2.3. NANO CONTEÚDOS.csv`
- (demais arquivos listados em `apps/api/src/seed/csv.ts`)

No Docker, esta pasta é montada em `/app/data/csvs` dentro do container da API.
