import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { inter, jetbrainsMono } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Byst.end — Prevenção de Assédio",
  description: "Plataforma educativa para prevenção de assédio no ambiente profissional",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
