// src/components/profile/ProfileHeader.tsx
"use client";

// Definimos o tipo para o status de amizade para clareza
type FriendshipStatus = "not_friends" | "pending" | "friends" | "is_self";

// A interface de Props define tudo o que este componente precisa para funcionar
interface ProfileHeaderProps {
  username: string;
  avatarUrl?: string | null;
  backgroundUrl?: string | null;
  etherFragments?: number | null;
  onEditClick: () => void;
  onAddFriend: () => void;
  isOwnProfile: boolean;
  friendshipStatus: FriendshipStatus;
}

// Componente para renderizar o botão de interação com outros usuários
const FriendshipButton = ({
  status,
  onAddFriend,
}: {
  status: FriendshipStatus;
  onAddFriend: () => void;
}) => {
  switch (status) {
    case "not_friends":
      return (
        <button
          onClick={onAddFriend}
          className="bg-green-800/70 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 transition-colors"
        >
          Adicionar Amigo
        </button>
      );
    case "pending":
      return (
        <button
          className="bg-gray-600/70 text-white px-3 py-1 rounded-md text-sm cursor-not-allowed"
          disabled
        >
          Pedido Pendente
        </button>
      );
    case "friends":
      return (
        <button className="bg-blue-800/70 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors">
          Amigos
        </button>
      );
    default:
      return null;
  }
};

export default function ProfileHeader({
  username,
  avatarUrl,
  backgroundUrl,
  etherFragments,
  onEditClick,
  onAddFriend,
  isOwnProfile,
  friendshipStatus,
}: ProfileHeaderProps) {
  // Imagens padrão caso o usuário ainda não tenha definido as suas
  const defaultBackground = "https://i.imgur.com/mPGM5d8.jpeg"; // Fundo padrão mais escuro
  const defaultAvatar = "https://i.imgur.com/g0P33p8.png";

  return (
    <div className="w-full h-64 md:h-80 relative border-b-4 border-red-900/50">
      {/* Imagem de Fundo do Perfil */}
      <img
        src={backgroundUrl || defaultBackground}
        alt="Papel de parede do perfil"
        className="w-full h-full object-cover"
        // Em caso de erro ao carregar a imagem, usa o fundo padrão
        onError={(e) => (e.currentTarget.src = defaultBackground)}
      />
      {/* Sobreposição escura para garantir a legibilidade do texto */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Botões de Ação no canto superior direito */}
      <div className="absolute top-4 right-4 z-10">
        {isOwnProfile ? (
          <button
            onClick={onEditClick}
            className="bg-black/50 text-white px-3 py-1 rounded-md text-sm hover:bg-black/80 transition-colors"
          >
            Editar Perfil
          </button>
        ) : (
          <FriendshipButton
            status={friendshipStatus}
            onAddFriend={onAddFriend}
          />
        )}
      </div>

      {/* Container para as informações do usuário */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end p-4 space-x-4">
        <img
          src={avatarUrl || defaultAvatar}
          alt={`Avatar de ${username}`}
          className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-gray-600 object-cover shadow-lg"
          onError={(e) => (e.currentTarget.src = defaultAvatar)}
        />
        <div className="mb-2">
          <h1
            className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {username}
          </h1>
          <div className="flex items-center space-x-2 text-yellow-400">
            <span className="text-lg">💎</span>
            <span className="text-lg font-bold drop-shadow-md">
              {etherFragments || 0} Fragmentos de Éter
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
