import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Byst.end — Prevenção de Assédio",
  description: "Plataforma educativa para prevenção de assédio no ambiente profissional",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <main className="container">
          <Nav />
          {children}
        </main>
      </body>
    </html>
  );
}
