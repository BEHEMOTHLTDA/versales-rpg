// src/components/profile/EditProfileModal.tsx
"use client";

import { useState, useRef } from "react";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newUsername: string) => Promise<boolean>; // Retorna true se salvou com sucesso
  onAvatarUpload: (file: File) => Promise<void>;
  onBackgroundUpload: (file: File) => Promise<void>;
  currentUsername: string;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  onSave,
  onAvatarUpload,
  onBackgroundUpload,
  currentUsername,
}: EditProfileModalProps) {
  const [username, setUsername] = useState(currentUsername);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSaveClick = async () => {
    setIsSaving(true);
    setError("");
    const success = await onSave(username);
    if (success) {
      onClose();
    } else {
      setError("Este nickname já está em uso. Tente outro.");
    }
    setIsSaving(false);
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    uploader: (file: File) => Promise<void>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      uploader(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1f1f1f] p-6 rounded-lg shadow-lg w-full max-w-md border border-gray-700">
        <h2
          className="text-2xl mb-4 text-white"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          Editar Santuário
        </h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-bold text-gray-400">
              Nickname Único
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 mt-1 bg-[#111] border border-gray-700 rounded text-white"
            />
            {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => avatarInputRef.current?.click()}
              className="flex-1 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded"
            >
              Trocar Avatar
            </button>
            <input
              type="file"
              ref={avatarInputRef}
              onChange={(e) => handleFileChange(e, onAvatarUpload)}
              className="hidden"
              accept="image/*"
            />

            <button
              onClick={() => backgroundInputRef.current?.click()}
              className="flex-1 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded"
            >
              Trocar Papel de Parede
            </button>
            <input
              type="file"
              ref={backgroundInputRef}
              onChange={(e) => handleFileChange(e, onBackgroundUpload)}
              className="hidden"
              accept="image/*"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white"
          >
            Cancelar
          </button>
          <button
            onClick={handleSaveClick}
            disabled={isSaving}
            className="px-6 py-2 font-bold bg-red-800 text-white rounded hover:bg-red-700 disabled:bg-gray-500"
          >
            {isSaving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
