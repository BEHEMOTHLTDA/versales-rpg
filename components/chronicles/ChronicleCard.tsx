// src/components/chronicles/ChronicleCard.tsx
"use client";

// Definimos os "props" que este componente espera receber
interface ChronicleCardProps {
  title: string;
  // O conteúdo pode ser string (com HTML) ou nulo
  content: string | null;
}

// Esta é uma função auxiliar que cria um resumo do texto.
// Ela remove todo o HTML e corta o texto para não ficar muito longo no card.
const createSnippet = (html: string | null, length = 150) => {
  if (!html) {
    return "Nenhum conteúdo disponível.";
  }
  // 1. Usa uma expressão regular para remover todas as tags HTML (ex: <p>, <strong>)
  const text = html.replace(/<[^>]+>/g, "");

  // 2. Se o texto for maior que o limite, corta e adiciona "..."
  if (text.length > length) {
    return text.substring(0, length) + "...";
  }
  return text;
};

export default function ChronicleCard({ title, content }: ChronicleCardProps) {
  // Usamos nossa função auxiliar para criar o resumo
  const snippet = createSnippet(content);

  return (
    // Estilização do card para combinar com o tema "Memento Mori"
    <div className="bg-black/30 p-6 rounded-lg border border-gray-800 hover:border-red-900/50 transition-colors duration-300 flex flex-col h-full">
      <h3
        className="text-xl text-gray-200 mb-2 truncate"
        style={{ fontFamily: "'Cinzel', serif" }}
        title={title} // Mostra o título completo ao passar o mouse
      >
        {title}
      </h3>
      <p className="text-gray-400 text-sm flex-grow">{snippet}</p>
      <div className="text-right mt-4">
        <a
          href="#"
          className="text-sm text-red-400/80 hover:text-red-300"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          Ler Mais →
        </a>
      </div>
    </div>
  );
}
