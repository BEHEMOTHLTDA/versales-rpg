// src/components/profile/ProfileContent.tsx
"use client";

import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import ChronicleCard from "../chronicles/ChronicleCard";
import CharacterCard from "../characters/CharacterCard";

interface ProfileContentProps {
  activeTab: string;
  userId: string | undefined;
}

type Chronicle = {
  id: string;
  title: string;
  content: string | null;
};

type Character = {
  id: string;
  name: string;
  avatar_url: string | null;
  system: { name: string } | null;
};

export default function ProfileContent({
  activeTab,
  userId,
}: ProfileContentProps) {
  const [chronicles, setChronicles] = useState<Chronicle[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchContent = async () => {
      setLoading(true);
      if (activeTab === "Crônicas") {
        const { data, error } = await supabase
          .from("chronicles")
          .select("*")
          .eq("owner_id", userId)
          .order("created_at", { ascending: false });
        if (data) setChronicles(data);
      } else if (activeTab === "Personagens") {
        const { data, error } = await supabase
          .from("characters")
          .select("id, name, avatar_url, system:systems(name)")
          .eq("owner_id", userId)
          .order("created_at", { ascending: false });
        if (data) setCharacters(data as any);
      }
      setLoading(false);
    };

    fetchContent();
  }, [activeTab, userId]);

  // A CORREÇÃO ESTÁ AQUI: O 'return' deve ser seguido por parênteses (), não por '>'.
  return (
    <div className="w-full max-w-5xl mx-auto p-8">
      {activeTab === "Crônicas" && (
        <div>
          <h2
            className="text-3xl mb-4"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Crônicas do Arconte
          </h2>
          {loading && <p>Carregando crônicas...</p>}
          {!loading && chronicles.length === 0 && (
            <p className="text-gray-400">Nenhuma crônica foi forjada ainda.</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {chronicles.map((chronicle) => (
              <ChronicleCard
                key={chronicle.id}
                title={chronicle.title}
                content={chronicle.content}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === "Personagens" && (
        <div>
          <h2
            className="text-3xl mb-4"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Companhia de Aventureiros
          </h2>
          {loading && <p>Buscando aventureiros...</p>}
          {!loading && characters.length === 0 && (
            <p className="text-gray-400">Nenhum personagem foi criado ainda.</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {characters.map((char) => (
              <CharacterCard
                key={char.id}
                id={char.id}
                name={char.name}
                systemName={char.system?.name || "Sistema Desconhecido"}
                avatarUrl={char.avatar_url}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === "Biblioteca" && (
        <div>
          <h2
            className="text-3xl mb-4"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Biblioteca Pessoal
          </h2>
          <p className="text-gray-400">
            Aqui serão exibidos todos os itens que o usuário adquiriu no
            Marketplace de Criadores...
          </p>
        </div>
      )}
    </div>
  );
}
