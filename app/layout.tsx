// src/app/layout.tsx
import type { Metadata } from "next";
// Importando as fontes corretas do Google Fonts que definimos para o projeto.
import { Cinzel, Lato, Source_Serif_4 } from "next/font/google";
import "./globals.css";

// Importando os componentes essenciais para o funcionamento global do site.
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";

// --- Configuração das Fontes ---
// Cada fonte é configurada com uma variável CSS para ser facilmente usada em todo o site.
const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const sourceSerif4 = Source_Serif_4({
  variable: "--font-source-serif-pro",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

// --- Metadados do Site ---
// Informações que aparecem na aba do navegador e nos resultados de busca.
export const metadata: Metadata = {
  title: "VERSALES RPG",
  description: "Suas crônicas, seu legado.",
};

// --- Componente RootLayout ---
// Este é o componente principal que "abraça" todas as páginas do seu site.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${cinzel.variable} ${sourceSerif4.variable} ${lato.variable} bg-[#111111] text-gray-200 antialiased`}
      >
        {/* O AuthProvider garante que todo o site saiba se o usuário está logado ou não. */}
        <AuthProvider>
          {/* A Navbar aparecerá em todas as páginas, no topo. */}
          <Navbar />
          {/* A tag <main> é onde o conteúdo de cada página individual será renderizado. */}
          <main className="pt-4">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
