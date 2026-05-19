"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Início" },
  { href: "/biblioteca", label: "Biblioteca" },
  { href: "/busca", label: "Busca" },
  { href: "/trilha", label: "Trilha" },
  { href: "/violentometro", label: "Violentômetro" },
  { href: "/quiz", label: "Quiz" },
  { href: "/chat", label: "Chat" },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <nav className="nav">
      <strong style={{ marginRight: "auto", color: "var(--text)" }}>Byst.end</strong>
      {links.map((l) => (
        <Link key={l.href} href={l.href} className={pathname === l.href ? "active" : ""}>
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
