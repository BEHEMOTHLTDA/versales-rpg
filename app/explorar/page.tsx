// PASSO 1: Crie a pasta e o arquivo da página de busca
// Caminho: src/app/explorar/page.tsx

"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import UserSearchResultCard from "@/components/social/UserSearchResultCard"; // Criaremos este componente a seguir

// Definimos o tipo de dados que esperamos para cada resultado de perfil
type ProfileSearchResult = {
  id: string;
  username: string;
  avatar_url: string | null;
};

export default function ExplorarPage() {
  const { user } = useAuth(); // Pegamos o usuário logado para não incluí-lo nos resultados
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<ProfileSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setHasSearched(true);

    // Query do Supabase para buscar perfis
    const { data, error } = await supabase
      .from("profiles")
      .select("id, username, avatar_url")
      .ilike("username", `%${searchTerm}%`) // 'ilike' faz uma busca case-insensitive que contém o termo
      .not("id", "eq", user?.uid || ""); // Exclui o próprio usuário da busca

    if (error) {
      console.error("Erro ao buscar usuários:", error);
      setResults([]);
    } else {
      setResults(data);
    }

    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1
        className="text-4xl text-center mb-2"
        style={{ fontFamily: "'Cinzel', serif" }}
      >
        Observatório dos Arcontes
      </h1>
      <p className="text-center text-gray-400 mb-8">
        Procure por outros escribas e aventureiros no reino de VERSALES.
      </p>

      {/* Barra de Busca */}
      <div className="flex space-x-2 mb-8">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Digite o nickname de um Arconte..."
          className="flex-grow p-3 bg-[#1f1f1f] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-900/80"
        />
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="px-6 py-3 font-bold bg-red-800 text-white rounded-md hover:bg-red-700 disabled:bg-gray-500"
        >
          {isLoading ? "Buscando..." : "Buscar"}
        </button>
      </div>

      {/* Resultados da Busca */}
      <div>
        {isLoading ? (
          <p className="text-center">Procurando nos anais...</p>
        ) : hasSearched && results.length === 0 ? (
          <p className="text-center text-gray-500">
            Nenhum Arconte encontrado com este nome.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((profile) => (
              <UserSearchResultCard key={profile.id} profile={profile} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
