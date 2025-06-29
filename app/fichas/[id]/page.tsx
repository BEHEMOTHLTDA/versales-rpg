// src/app/fichas/[id]/page.tsx
"use client";

import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

// Importando os componentes e tipos necessários
import Dnd5eSheet from "@/components/sheets/Dnd5eSheet";
import { Dnd5eSheetData, defaultDnd5eSheet } from "@/types/dnd5e";

// Este é o tipo de dados que esperamos receber do nosso banco de dados.
// Ele inclui as informações básicas do personagem e os dados do sistema de jogo.
type CharacterData = {
  id: string;
  name: string;
  avatar_url: string | null;
  sheet_data: Partial<Dnd5eSheetData>; // A ficha pode estar parcialmente preenchida.
  system: {
    id: number;
    name: string;
  };
};

// Este é o componente da página que recebe o 'id' do personagem da URL
export default function FichaPage({ params }: { params: { id: string } }) {
  const [character, setCharacter] = useState<CharacterData | null>(null);
  const [loading, setLoading] = useState(true);

  // Pegamos o ID do personagem diretamente dos parâmetros da URL
  const characterId = params.id;

  // O hook useEffect é acionado assim que a página carrega, para buscar os dados do personagem
  useEffect(() => {
    // Se não houver um ID na URL, não fazemos nada
    if (!characterId) return;

    const fetchCharacter = async () => {
      setLoading(true);
      // Fazemos a chamada ao Supabase para buscar o personagem pelo seu ID.
      // A query também busca o nome do sistema de jogo (`systems`) relacionado.
      const { data, error } = await supabase
        .from("characters")
        .select(
          `
          id,
          name,
          avatar_url,
          sheet_data,
          system:systems ( id, name )
        `
        )
        .eq("id", characterId)
        .single(); // .single() garante que esperamos apenas um resultado

      if (error) {
        console.error("Erro ao buscar o aventureiro:", error);
        setCharacter(null); // Define como nulo em caso de erro
      } else if (data) {
        setCharacter(data as any);
      }
      setLoading(false);
    };

    fetchCharacter();
  }, [characterId]); // Esta função será executada novamente se o ID na URL mudar

  // Esta função será passada para o componente da ficha para que ele possa salvar os dados
  const handleSaveSheet = async (newData: any) => {
    if (!characterId) return;

    const { error } = await supabase
      .from("characters")
      .update({ sheet_data: newData }) // Atualiza apenas a coluna 'sheet_data' com os novos dados
      .eq("id", characterId);

    if (error) {
      alert("Falha ao salvar a ficha: " + error.message);
    }
  };

  // Enquanto os dados estão sendo carregados, exibimos uma mensagem de loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h2
          className="text-center p-10 text-2xl text-white"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          Carregando grimório do aventureiro...
        </h2>
      </div>
    );
  }

  // Se, após carregar, nenhum personagem for encontrado, exibimos uma mensagem de erro
  if (!character) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h2
          className="text-center p-10 text-2xl text-white"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          Aventureiro não encontrado ou o grimório se perdeu no tempo.
        </h2>
      </div>
    );
  }

  // Esta função decide qual componente de ficha renderizar com base no ID do sistema
  const renderSheet = () => {
    // A mágica acontece aqui: usamos um 'switch' para escolher o componente correto
    switch (character.system.id) {
      case 1: // O ID para 'Dungeons & Dragons 5e' que inserimos no Supabase
        // Preparamos os dados da ficha, garantindo que mesmo uma ficha nova tenha os valores padrão
        const initialDndData = {
          ...defaultDnd5eSheet,
          ...character.sheet_data,
          attributes: {
            ...defaultDnd5eSheet.attributes,
            ...character.sheet_data?.attributes,
          },
          vitals: {
            ...defaultDnd5eSheet.vitals,
            ...character.sheet_data?.vitals,
          },
          skills: {
            ...defaultDnd5eSheet.skills,
            ...character.sheet_data?.skills,
          },
        };

        return (
          <Dnd5eSheet
            initialData={initialDndData}
            onSave={handleSaveSheet}
            characterName={character.name}
            characterId={character.id}
            avatarUrl={character.avatar_url}
          />
        );

      // Futuramente, adicionaremos mais casos aqui
      // case 2:
      //   return <Coc7eSheet ... />;

      default:
        return (
          <div>
            O grimório para este sistema de regras ainda não foi escrito.
          </div>
        );
    }
  };

  return (
    // Um contêiner com espaçamento para a ficha não ficar colada nas bordas da tela
    <div className="p-4 md:p-8 min-h-screen">{renderSheet()}</div>
  );
}
