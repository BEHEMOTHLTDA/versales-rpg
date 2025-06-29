// src/components/layout/Navbar.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function Navbar() {
  // Usamos o nosso hook de autenticação para saber se há um usuário logado
  // e para obter o seu username para o link do perfil.
  const { user } = useAuth();

  return (
    // O <header> serve como o contêiner principal da barra de navegação.
    // A estilização segue o nosso tema "Memento Mori": fundo preto semitransparente,
    // um desfoque (backdrop-blur), uma borda sutil na parte inferior e uma sombra.
    // 'sticky top-0 z-50' garante que a navbar fique fixa no topo da tela ao rolar a página.
    <header className="w-full bg-black/70 backdrop-blur-sm border-b border-red-900/40 sticky top-0 z-50 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Lado Esquerdo da Navbar: Marca e Links Principais */}
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="text-2xl text-gray-200 hover:text-white transition-colors"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              VERSALES
            </Link>
            <div className="hidden md:flex items-baseline space-x-4">
              <Link
                href="/explorar"
                className="text-gray-300 hover:bg-gray-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Explorar Arcontes
              </Link>
              {/* Outros links principais, como "Marketplace", podem ser adicionados aqui no futuro */}
            </div>
          </div>

          {/* Lado Direito da Navbar: Ações do Usuário */}
          <div className="flex items-center space-x-4">
            {user ? (
              // Se o usuário ESTIVER logado:
              <Link
                // O link é dinâmico e aponta para a URL correta do perfil do usuário
                href={`/perfil/${user.username}`}
                className="text-gray-300 hover:bg-gray-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Meu Santuário
              </Link>
            ) : (
              // Se o usuário NÃO ESTIVER logado:
              <Link
                href="/login"
                className="text-gray-300 hover:bg-gray-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Entrar no Grimório
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
