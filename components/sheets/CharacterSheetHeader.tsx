// PASSO 1: Crie este novo arquivo em: src/components/sheets/CharacterSheetHeader.tsx
"use client";

import { Dnd5eSheetData } from "@/types/dnd5e";

// Definimos os tipos de dados que este componente específico irá manipular
type HeaderData = Pick<
  Dnd5eSheetData,
  | "character_name"
  | "class_and_level"
  | "race"
  | "background"
  | "alignment"
  | "player_name"
  | "experience_points"
>;

interface CharacterSheetHeaderProps {
  data: HeaderData;
  onDataChange: (field: keyof HeaderData, value: string | number) => void;
}

// Componente reutilizável para um único campo do cabeçalho
const HeaderField = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}) => (
  <div className="flex flex-col">
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder || label}
      className="bg-transparent border-b-2 border-black/30 text-lg p-1 focus:outline-none focus:border-red-900/50"
    />
    <label className="text-xs uppercase font-bold text-black/60 mt-1">
      {label}
    </label>
  </div>
);

export default function CharacterSheetHeader({
  data,
  onDataChange,
}: CharacterSheetHeaderProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mb-6 border-b-4 border-black/20 pb-6">
      <div className="md:col-span-1">
        <h2 className="text-5xl" style={{ fontFamily: "'Cinzel', serif" }}>
          {data.character_name}
        </h2>
      </div>

      <div className="md:col-span-2 grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
        <HeaderField
          label="Classe & Nível"
          value={data.class_and_level}
          onChange={(e) => onDataChange("class_and_level", e.target.value)}
        />
        <HeaderField
          label="Antecedente"
          value={data.background}
          onChange={(e) => onDataChange("background", e.target.value)}
        />
        <HeaderField
          label="Nome do Jogador"
          value={data.player_name}
          onChange={(e) => onDataChange("player_name", e.target.value)}
        />
        <HeaderField
          label="Raça"
          value={data.race}
          onChange={(e) => onDataChange("race", e.target.value)}
        />
        <HeaderField
          label="Alinhamento"
          value={data.alignment}
          onChange={(e) => onDataChange("alignment", e.target.value)}
        />
        <HeaderField
          label="Pontos de Experiência"
          type="number"
          value={data.experience_points}
          onChange={(e) =>
            onDataChange("experience_points", parseInt(e.target.value) || 0)
          }
        />
      </div>
    </div>
  );
}
