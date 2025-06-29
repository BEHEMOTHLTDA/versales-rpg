// src/components/characters/CharacterCard.tsx
"use client";

import Link from "next/link"; // Importe o componente Link

interface CharacterCardProps {
  id: string; // Adicionamos o ID para criar o link
  name: string;
  systemName: string;
  avatarUrl: string | null;
}

export default function CharacterCard({
  id,
  name,
  systemName,
  avatarUrl,
}: CharacterCardProps) {
  return (
    <Link href={`/fichas/${id}`} className="block">
      <div className="bg-black/30 rounded-lg border border-gray-800 hover:border-red-900/50 transition-all duration-300 group hover:scale-105 h-full">
        <div
          className="w-full h-40 bg-gray-900 rounded-t-lg bg-cover bg-center"
          style={{ backgroundImage: "url('https://i.imgur.com/5zS5a2L.jpeg')" }}
        >
          {/* A imagem do personagem virá aqui no futuro */}
        </div>
        <div className="p-4">
          <h3
            className="text-xl text-white mb-1 truncate"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {name}
          </h3>
          <p className="text-sm text-red-400/70">{systemName}</p>
        </div>
      </div>
    </Link>
  );
}
