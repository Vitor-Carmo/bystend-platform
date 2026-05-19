import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { inter, jetbrainsMono } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Byst.end — Prevenção de Assédio",
  description: "Plataforma educativa para prevenção de assédio no ambiente profissional",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      data-theme="light"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
