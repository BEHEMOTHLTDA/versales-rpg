// src/components/characters/CharacterCreationModal.tsx
"use client";

import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

interface CharacterCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, systemId: number) => Promise<void>;
}

type System = {
  id: number;
  name: string;
};

export default function CharacterCreationModal({
  isOpen,
  onClose,
  onSave,
}: CharacterCreationModalProps) {
  const [name, setName] = useState("");
  const [systemId, setSystemId] = useState("");
  const [systems, setSystems] = useState<System[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Busca a lista de sistemas do banco de dados quando o modal abre
  useEffect(() => {
    if (isOpen) {
      const fetchSystems = async () => {
        const { data, error } = await supabase
          .from("systems")
          .select("id, name");
        if (data) {
          setSystems(data);
          // Define o primeiro sistema como padrão
          if (data.length > 0) {
            setSystemId(data[0].id.toString());
          }
        }
      };
      fetchSystems();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!name || !systemId) {
      alert("Por favor, preencha o nome e selecione um sistema.");
      return;
    }
    setIsSaving(true);
    await onSave(name, parseInt(systemId, 10));
    setIsSaving(false);
    setName("");
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[#1f1f1f] p-6 rounded-lg shadow-lg w-full max-w-md border border-gray-700">
        <h2
          className="text-2xl mb-4 text-white"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          Dar Vida a um Novo Ser
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nome do Personagem"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 bg-[#111] border border-gray-700 rounded text-white"
          />
          <select
            value={systemId}
            onChange={(e) => setSystemId(e.target.value)}
            className="w-full p-2 bg-[#111] border border-gray-700 rounded text-white"
          >
            {systems.map((system) => (
              <option key={system.id} value={system.id}>
                {system.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button onClick={onClose} className="px-4 py-2 text-gray-300">
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 font-bold bg-red-800 text-white rounded hover:bg-red-700 disabled:bg-gray-500"
          >
            {isSaving ? "Criando..." : "Criar Personagem"}
          </button>
        </div>
      </div>
    </div>
  );
}
