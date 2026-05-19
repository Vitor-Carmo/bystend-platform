"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/cn";
import { MobileDrawer } from "../MobileDrawer";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./Nav.module.css";

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
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        router.push("/busca");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  return (
    <>
      <nav className={styles.nav} aria-label="Principal">
        <Link href="/" className={styles.brand} aria-label="Byst.end — página inicial">
          <Image
            src="/logo.png"
            alt="Byst.end"
            width={163}
            height={150}
            priority
            className={styles.logo}
          />
        </Link>

        <div className={styles.links}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(styles.link, pathname === l.href && styles.linkActive)}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <Link href="/busca" className={styles.shortcut} title="Ir para busca">
          <kbd>Ctrl</kbd>+<kbd>K</kbd>
        </Link>

        <button
          type="button"
          className={styles.menuBtn}
          aria-label="Abrir menu"
          aria-expanded={drawerOpen}
          onClick={() => setDrawerOpen(true)}
        >
          <Menu size={20} />
        </button>
      </nav>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} links={links} pathname={pathname} />
    </>
  );
}
