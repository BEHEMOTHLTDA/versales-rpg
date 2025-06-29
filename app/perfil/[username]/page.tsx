// src/app/perfil/[username]/page.tsx
"use client";

// Hooks do React e Next.js
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

// Nossos hooks, bibliotecas e tipos
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase/config";
import { supabase } from "@/lib/supabase/client";
import { signOut } from "firebase/auth";

// Nossos componentes de UI
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import ProfileContent from "@/components/profile/ProfileContent";
import EditProfileModal from "@/components/profile/EditProfileModal";
import ChronicleEditorModal from "@/components/chronicles/ChronicleEditorModal";
import CharacterCreationModal from "@/components/characters/CharacterCreationModal";

// --- Definição dos Tipos de Dados ---
type ProfileData = {
  id: string;
  username: string;
  avatar_url: string | null;
  background_url: string | null;
  ether_fragments: number | null;
  bio: string | null;
};
type FriendshipStatus = "not_friends" | "pending" | "friends" | "is_self";

// --- Componente da Página de Perfil Dinâmica ---
export default function PerfilDinamicoPage() {
  // --- Hooks de Estado e Navegação ---
  const router = useRouter();
  const params = useParams();
  const usernameFromUrl = Array.isArray(params.username)
    ? params.username[0]
    : params.username;

  const { user: loggedInUser, loading: loadingAuth } = useAuth();

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [friendshipStatus, setFriendshipStatus] =
    useState<FriendshipStatus>("not_friends");
  const [activeTab, setActiveTab] = useState("Crônicas");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChronicleModalOpen, setIsChronicleModalOpen] = useState(false);
  const [isCharModalOpen, setIsCharModalOpen] = useState(false);

  // --- Efeito Principal para Buscar Dados ---
  useEffect(() => {
    async function fetchProfileAndFriendship() {
      if (!usernameFromUrl) return;
      setLoadingProfile(true);

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", usernameFromUrl)
        .single();

      if (profileError || !profile) {
        console.error("Perfil não encontrado:", profileError);
        router.push("/explorar");
        return;
      }
      setProfileData(profile);

      if (loggedInUser) {
        if (loggedInUser.uid === profile.id) {
          setFriendshipStatus("is_self");
        } else {
          const { data: friendship } = await supabase
            .from("friendships")
            .select("status")
            .or(
              `(user_one_id.eq.${loggedInUser.uid},user_two_id.eq.${profile.id}),(user_one_id.eq.${profile.id},user_two_id.eq.${loggedInUser.uid})`
            )
            .single();

          if (friendship) {
            setFriendshipStatus(friendship.status as FriendshipStatus);
          } else {
            setFriendshipStatus("not_friends");
          }
        }
      } else {
        setFriendshipStatus("not_friends");
      }
      setLoadingProfile(false);
    }
    fetchProfileAndFriendship();
  }, [usernameFromUrl, loggedInUser, router]);

  // --- Funções de Ação (Handlers) ---

  const handleLogout = async () => {
    /* ... (código existente) ... */
  };
  const handleAddFriend = async () => {
    /* ... (código existente) ... */
  };
  const handleProfileUpdate = async (newUsername: string): Promise<boolean> => {
    /* ... (código existente) ... */ return true;
  };
  const handleImageUpload = async (
    file: File,
    bucket: "profile-avatars" | "profile-backgrounds",
    field: "avatar_url" | "background_url"
  ) => {
    /* ... (código existente) ... */
  };
  const handleSaveChronicle = async (title: string, content: string) => {
    /* ... (código existente) ... */
  };
  const handleSaveCharacter = async (name: string, systemId: number) => {
    /* ... (código existente) ... */
  };

  // --- Renderização ---

  if (loadingAuth || loadingProfile) {
    return (
      <div
        className="flex items-center justify-center min-h-screen text-white text-xl"
        style={{ fontFamily: "'Cinzel', serif" }}
      >
        Carregando Santuário do Arconte...
      </div>
    );
  }

  if (!profileData) {
    return (
      <div
        className="flex items-center justify-center min-h-screen text-white text-xl"
        style={{ fontFamily: "'Cinzel', serif" }}
      >
        Este Arconte não foi encontrado nos anais do tempo.
      </div>
    );
  }

  return (
    <>
      {/* Modais de Edição */}
      {friendshipStatus === "is_self" && (
        <>
          <EditProfileModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            currentUsername={profileData.username}
            onSave={handleProfileUpdate}
            onAvatarUpload={(file) =>
              handleImageUpload(file, "profile-avatars" as any, "avatar_url")
            }
            onBackgroundUpload={(file) =>
              handleImageUpload(file, "profile-backgrounds", "background_url")
            }
          />
          <ChronicleEditorModal
            isOpen={isChronicleModalOpen}
            onClose={() => setIsChronicleModalOpen(false)}
            onSave={handleSaveChronicle}
          />
          <CharacterCreationModal
            isOpen={isCharModalOpen}
            onClose={() => setIsCharModalOpen(false)}
            onSave={handleSaveCharacter}
          />
        </>
      )}

      <main className="flex flex-col items-center w-full">
        <ProfileHeader
          username={profileData.username}
          avatarUrl={profileData.avatar_url}
          backgroundUrl={profileData.background_url}
          etherFragments={profileData.ether_fragments}
          onEditClick={() => setIsEditModalOpen(true)}
          isOwnProfile={friendshipStatus === "is_self"}
          friendshipStatus={friendshipStatus}
          onAddFriend={handleAddFriend}
        />
        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* ===================================================================== */}
        {/* == BOTÕES DE AÇÃO REINTRODUZIDOS E CORRIGIDOS AQUI == */}
        {/* ===================================================================== */}
        {friendshipStatus === "is_self" && (
          <div className="w-full max-w-5xl mx-auto px-8 mt-6 text-right">
            {activeTab === "Crônicas" && (
              <button
                onClick={() => setIsChronicleModalOpen(true)}
                className="px-4 py-2 font-bold bg-red-800 text-white rounded hover:bg-red-700 transition-colors"
              >
                + Nova Crônica
              </button>
            )}
            {activeTab === "Personagens" && (
              <button
                onClick={() => setIsCharModalOpen(true)}
                className="px-4 py-2 font-bold bg-red-800 text-white rounded hover:bg-red-700 transition-colors"
              >
                + Criar Personagem
              </button>
            )}
          </div>
        )}

        <ProfileContent activeTab={activeTab} userId={profileData.id} />

        {friendshipStatus === "is_self" && (
          <div className="my-12">
            <button
              onClick={handleLogout}
              className="px-6 py-2 text-sm text-gray-400 hover:text-white hover:bg-red-900/50 rounded-md transition-colors"
            >
              Sair do Grimório
            </button>
          </div>
        )}
      </main>
    </>
  );
}
