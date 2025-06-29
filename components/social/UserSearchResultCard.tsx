// PASSO 2: Crie o componente do card de resultado
// Caminho: src/components/social/UserSearchResultCard.tsx

"use client";

import Link from "next/link";

// Tipo para os dados do perfil que este card recebe
type ProfileSearchResult = {
  id: string;
  username: string;
  avatar_url: string | null;
};

interface UserSearchResultCardProps {
  profile: ProfileSearchResult;
}

export default function UserSearchResultCard({
  profile,
}: UserSearchResultCardProps) {
  const defaultAvatar =
    "[https://i.imgur.com/g0P33p8.png](https://i.imgur.com/g0P33p8.png)";

  return (
    <div className="bg-black/40 p-4 rounded-lg border border-gray-800 text-center hover:border-red-900/50 transition-colors">
      <img
        src={profile.avatar_url || defaultAvatar}
        alt={`Avatar de ${profile.username}`}
        className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-gray-600 object-cover"
        onError={(e) => (e.currentTarget.src = defaultAvatar)}
      />
      <h3 className="text-lg font-bold text-white truncate">
        {profile.username}
      </h3>

      {/* O link leva o usuário para a página de perfil dinâmica que já criamos */}
      <Link href={`/perfil/${profile.username}`}>
        <span className="mt-4 inline-block bg-gray-700 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-600 transition-colors">
          Ver Perfil
        </span>
      </Link>
    </div>
  );
}
