// src/components/chronicles/ChronicleEditorModal.tsx
"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

// Uma barra de ferramentas customizada para o nosso editor Tiptap
const Toolbar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 p-2 bg-[#111] border border-gray-700 rounded-t-md">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={
          editor.isActive("bold")
            ? "bg-red-800 text-white p-2 rounded"
            : "text-gray-300 p-2 rounded hover:bg-gray-700"
        }
      >
        Negrito
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={
          editor.isActive("italic")
            ? "bg-red-800 text-white p-2 rounded"
            : "text-gray-300 p-2 rounded hover:bg-gray-700"
        }
      >
        Itálico
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={
          editor.isActive("heading", { level: 2 })
            ? "bg-red-800 text-white p-2 rounded"
            : "text-gray-300 p-2 rounded hover:bg-gray-700"
        }
      >
        Título
      </button>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={
          editor.isActive("paragraph")
            ? "bg-red-800 text-white p-2 rounded"
            : "text-gray-300 p-2 rounded hover:bg-gray-700"
        }
      >
        Parágrafo
      </button>
    </div>
  );
};

interface ChronicleEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, content: string) => Promise<void>;
}

export default function ChronicleEditorModal({
  isOpen,
  onClose,
  onSave,
}: ChronicleEditorModalProps) {
  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Hook principal do Tiptap para configurar o editor
  const editor = useEditor({
    extensions: [
      StarterKit, // Pacote com as funcionalidades básicas (negrito, itálico, etc.)
    ],
    content: "", // Conteúdo inicial do editor
    editorProps: {
      attributes: {
        class:
          "prose prose-invert min-h-[300px] max-w-none p-4 focus:outline-none bg-[#111] text-gray-200 border border-gray-700 rounded-b-md",
      },
    },
  });

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!editor) return;

    setIsSaving(true);
    // Pegamos o conteúdo do editor em formato HTML
    const content = editor.getHTML();
    await onSave(title, content);
    setIsSaving(false);

    // Limpa os campos após salvar
    setTitle("");
    editor.commands.clearContent();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1f1f1f] p-6 rounded-lg shadow-lg w-full max-w-3xl border border-gray-700">
        <h2
          className="text-2xl mb-4 text-white"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          Forjar Nova Crônica
        </h2>

        <input
          type="text"
          placeholder="Título da Crônica"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-4 bg-[#111] border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-900"
        />

        {/* O Editor de Texto Rico Tiptap */}
        <div className="text-white">
          <Toolbar editor={editor} />
          <EditorContent editor={editor} />
        </div>

        <div className="flex justify-end space-x-4 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !editor}
            className="px-6 py-2 font-bold bg-red-800 text-white rounded hover:bg-red-700 disabled:bg-gray-500 transition-colors"
          >
            {isSaving ? "Salvando..." : "Salvar Crônica"}
          </button>
        </div>
      </div>
    </div>
  );
}
