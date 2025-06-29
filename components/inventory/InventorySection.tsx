// src/components/inventory/InventorySection.tsx
"use client";

import { useState } from "react";
import SheetSection from "../sheets/SheetSection";
import { Currency } from "@/types/dnd5e";

interface Item {
  item: string;
  quantity: number;
  weight: number;
}

interface InventoryProps {
  items: Item[];
  currency: Currency;
  onItemsChange: (newItems: Item[]) => void;
  onCurrencyChange: (newCurrency: Currency) => void;
}

export default function InventorySection({
  items,
  currency,
  onItemsChange,
  onCurrencyChange,
}: InventoryProps) {
  const [newItemName, setNewItemName] = useState("");

  const handleAddItem = () => {
    if (!newItemName.trim()) return;
    const newItem: Item = { item: newItemName, quantity: 1, weight: 0 };
    onItemsChange([...items, newItem]);
    setNewItemName("");
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onItemsChange(newItems);
  };

  return (
    <SheetSection title="Equipamento & Tesouro">
      {/* Moedas */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {Object.entries(currency).map(([type, value]) => (
          <div key={type} className="text-center">
            <label className="text-xs uppercase font-bold">{type}</label>
            <input
              type="number"
              value={value}
              onChange={(e) =>
                onCurrencyChange({
                  ...currency,
                  [type]: parseInt(e.target.value) || 0,
                })
              }
              className="w-full p-1 text-center bg-white/50 border border-black/20 rounded"
            />
          </div>
        ))}
      </div>

      {/* Lista de Itens */}
      <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-white/30 p-1 rounded-sm"
          >
            <span>
              {item.quantity}x {item.item}
            </span>
            <button
              onClick={() => handleRemoveItem(index)}
              className="text-red-800 font-bold px-2"
            >
              X
            </button>
          </div>
        ))}
      </div>

      {/* Adicionar Novo Item */}
      <div className="flex space-x-2 mt-4">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Adicionar novo item..."
          className="flex-grow p-2 bg-white/50 border border-black/20 rounded"
        />
        <button
          onClick={handleAddItem}
          className="px-4 py-2 bg-black/60 text-white rounded"
        >
          Adicionar
        </button>
      </div>
    </SheetSection>
  );
}
