#!/usr/bin/env python3
"""Extrai texto dos PDFs em docs/byst-end-materiais para data/knowledge-sources/."""
from __future__ import annotations

import re
import zipfile
from pathlib import Path

from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
MATERIAIS = ROOT / "docs" / "byst-end-materiais"
OUT = ROOT / "data" / "knowledge-sources"

PDF_MAP = {
    "nr1.txt": "Cópia de NR1 ATUALIZADA.pdf",
    "oit-c190.txt": "Cópia de Convenção sobre a eliminação da violência e do assédio no mundo do trabalho - C190 – Convenção (nº 190) sobre Violência e Assédio, 2019 (1).pdf",
    "oit-relatorio-2018.txt": "Cópia de OIT_Violencia_Assedio_Relatorio_V1_OIT_2018.pdf",
    "oit-ambientes-seguros.txt": "Cópia de OIT_Violência e assédio no trabalho_wcms_783092.pdf",
}


def extract_pdf(src: Path) -> str:
    reader = PdfReader(str(src))
    return "\n".join((page.extract_text() or "") for page in reader.pages)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for out_name, pdf_name in PDF_MAP.items():
        src = MATERIAIS / pdf_name
        if not src.exists():
            print(f"SKIP missing: {src}")
            continue
        text = extract_pdf(src)
        (OUT / out_name).write_text(text, encoding="utf-8")
        print(f"OK {out_name} ({len(text)} chars)")
    print("Think Eva: use data/knowledge-sources/think-eva.txt (PDF é predominantemente imagem).")


if __name__ == "__main__":
    main()
