// src/components/sheets/SheetSection.tsx
import React from "react";

interface SheetSectionProps {
  title: string;
  children?: React.ReactNode; // A MUDANÇA ESTÁ AQUI. O '?' torna a propriedade opcional.
  className?: string;
}

export default function SheetSection({
  title,
  children,
  className,
}: SheetSectionProps) {
  return (
    <div className={`border-2 border-black/30 p-4 rounded-sm ${className}`}>
      <h3
        className="text-lg font-bold text-black/70 mb-3 border-b-2 border-black/30 pb-1"
        style={{ fontFamily: "'Cinzel', serif" }}
      >
        {title}
      </h3>
      {/* Agora, só renderizamos 'children' se ele existir */}
      {children}
    </div>
  );
}
