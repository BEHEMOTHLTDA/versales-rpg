// src/components/sheets/Dnd5eSheet.tsx
'use client';

import { useState, useEffect, useCallback, useRef } from "react";
import { Dnd5eSheetData, defaultDnd5eSheet, DndAttributes, SKILL_ATTRIBUTE_MAP, Attack } from "@/types/dnd5e";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase/client";

// Importando nossos componentes de ficha
import SheetSection from "./SheetSection";
import InventorySection from "../inventory/InventorySection";
import CharacterSheetHeader from "./CharacterSheetHeader";

// --- Funções de Cálculo (Regras de D&D 5e) ---
const calculateAbilityModifier = (score: number): number => Math.floor((score - 10) / 2);
const formatModifier = (mod: number): string => mod >= 0 ? `+${mod}` : mod.toString();
const getLevelFromClassString = (classStr: string): number => {
    const levels = (classStr || "").match(/\d+/g) || [];
    return levels.reduce((sum, lvl) => sum + parseInt(lvl, 10), 0) || 1;
};
const getProficiencyBonus = (level: number): number => {
    if (level < 1) return 2;
    return Math.floor((level - 1) / 4) + 2;
};

// --- Tipos de Props ---
interface Dnd5eSheetProps {
  initialData: Partial<Dnd5eSheetData>;
  onSave: (newData: Dnd5eSheetData) => Promise<void>;
  characterId: string;
  avatarUrl: string | null;
}

export default function Dnd5eSheet({ initialData, onSave, characterId, avatarUrl: initialAvatarUrl }: Dnd5eSheetProps) {
  const { user } = useAuth();
  const [sheetData, setSheetData] = useState<Dnd5eSheetData>(defaultDnd5eSheet);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Função Principal de Recálculo ---
  const updateAndRecalculateSheet = useCallback((data: Dnd5eSheetData) => {
    const newSheet = { ...data };
    const level = getLevelFromClassString(newSheet.class_and_level);
    newSheet.proficiency_bonus = getProficiencyBonus(level);

    for (const attr in newSheet.attributes) {
      const key = attr as keyof DndAttributes;
      newSheet.attributes[key].modifier = calculateAbilityModifier(newSheet.attributes[key].score);
    }
    
    newSheet.initiative = newSheet.attributes.dexterity.modifier;
    
    for (const save in newSheet.saving_throws) {
        const key = save as keyof DndAttributes;
        const attrMod = newSheet.attributes[key].modifier;
        const profBonus = newSheet.saving_throws[key].is_proficient ? newSheet.proficiency_bonus : 0;
        newSheet.saving_throws[key].bonus = attrMod + profBonus;
    }

    Object.entries(SKILL_ATTRIBUTE_MAP).forEach(([skillName, attribute]) => {
        const attrMod = newSheet.attributes[attribute].modifier;
        const isProficient = newSheet.skills[skillName]?.is_proficient || false;
        const profBonus = isProficient ? newSheet.proficiency_bonus : 0;
        newSheet.skills[skillName] = { ...(newSheet.skills[skillName] || { is_proficient: false, has_expertise: false }), bonus: attrMod + profBonus };
    });

    setSheetData(newSheet);
  }, []);

  // Efeito para Inicializar e Sincronizar os Dados
  useEffect(() => {
    const mergedData = JSON.parse(JSON.stringify(defaultDnd5eSheet));
    const deepMerge = (target: any, source: any) => {
        if (!source) return;
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                deepMerge(target[key], source[key]);
            } else { target[key] = source[key]; }
        }
    };
    deepMerge(mergedData, initialData);
    updateAndRecalculateSheet(mergedData);
  }, [initialData, updateAndRecalculateSheet]);
  
  // --- Handlers ---
  const handleSaveClick = async () => { setIsSaving(true); await onSave(sheetData); setIsSaving(false); alert('Ficha salva com sucesso!'); };
  const handleGenericChange = (path: string, value: any) => {
    const keys = path.split('.');
    const newSheet = JSON.parse(JSON.stringify(sheetData));
    let current = newSheet;
    for (let i = 0; i < keys.length - 1; i++) { current = current[keys[i]]; }
    current[keys[keys.length - 1]] = value;
    updateAndRecalculateSheet(newSheet);
  };
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0 || !user) return;
    const file = event.target.files[0];
    const filePath = `${user.uid}/${characterId}-${Date.now()}.${file.name.split('.').pop()}`;
    setIsUploading(true);
    const { error: uploadError } = await supabase.storage.from('character-avatars').upload(filePath, file);
    if (uploadError) {
      alert('Erro no upload: ' + uploadError.message);
    } else {
      const { data } = supabase.storage.from('character-avatars').getPublicUrl(filePath);
      const publicUrl = data.publicUrl;
      const { error: dbError } = await supabase.from('characters').update({ avatar_url: publicUrl }).eq('id', characterId);
      if (dbError) alert('Erro ao salvar nova imagem: ' + dbError.message);
      else setAvatarUrl(publicUrl);
    }
    setIsUploading(false);
  };
  const handleAttacksChange = (index: number, field: keyof Attack, value: string) => {
    const newAttacks = [...sheetData.attacks_and_spellcasting];
    newAttacks[index] = { ...newAttacks[index], [field]: value };
    handleGenericChange('attacks_and_spellcasting', newAttacks);
  };
  const addAttack = () => {
    const newAttack: Attack = { name: "Novo Ataque", attack_bonus: "+0", damage: "1d4" };
    handleGenericChange('attacks_and_spellcasting', [...sheetData.attacks_and_spellcasting, newAttack]);
  };
  
  return (
    <div className="bg-[#f3e9d8] text-black p-4 md:p-8 rounded-sm shadow-lg max-w-7xl mx-auto font-serif">
      <button onClick={handleSaveClick} disabled={isSaving} className="fixed top-24 right-4 px-4 py-2 bg-red-900/80 text-white rounded hover:bg-red-800 z-50 font-bold">
        {isSaving ? 'Salvando...' : 'Salvar Ficha'}
      </button>

      <CharacterSheetHeader 
        characterName={sheetData.character_name}
        data={{ class_and_level: sheetData.class_and_level, race: sheetData.race, background: sheetData.background, alignment: sheetData.alignment, player_name: sheetData.player_name, experience_points: sheetData.experience_points }}
        onDataChange={handleGenericChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* --- COLUNA ESQUERDA: ATRIBUTOS, DEFESAS E PERÍCIAS --- */}
        <div className="md:col-span-1 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1 space-y-2">
              {Object.entries(sheetData.attributes).map(([key, attr]) => (
                <div key={key} className="flex flex-col items-center bg-white/40 p-2 rounded-sm border-2 border-black/20">
                  <label className="text-xs uppercase font-bold">{key.substring(0,3)}</label>
                  <div className="text-4xl font-bold">{formatModifier(attr.modifier)}</div>
                  <input type="number" value={attr.score} onChange={(e) => handleGenericChange(`attributes.${key}.score`, parseInt(e.target.value) || 0)} className="w-16 p-1 text-center bg-white border border-gray-400 rounded" />
                </div>
              ))}
            </div>
            <div className="col-span-1 space-y-4">
              <SheetSection title="Inspiração">
                <input type="checkbox" checked={sheetData.inspiration} onChange={(e) => handleGenericChange('inspiration', e.target.checked)} className="w-8 h-8 mx-auto block accent-red-900"/>
              </SheetSection>
              <SheetSection title="Bônus de Proficiência">
                <div className="text-4xl font-bold text-center">{formatModifier(sheetData.proficiency_bonus)}</div>
              </SheetSection>
              <SheetSection title="Testes de Resistência">
                  {Object.entries(sheetData.saving_throws).map(([key, save]) => (
                      <div key={key} className="flex items-center text-sm">
                          <input type="checkbox" checked={save.is_proficient} onChange={(e) => handleGenericChange(`saving_throws.${key}.is_proficient`, e.target.checked)} className="mx-2 accent-red-900"/>
                          <span className="w-8 text-center font-bold">{formatModifier(save.bonus)}</span>
                          <span className="capitalize">{key.substring(0,3)}</span>
                      </div>
                  ))}
              </SheetSection>
            </div>
          </div>
          <SheetSection title="Perícias">
            <div className="grid grid-cols-1 gap-y-1 text-sm">
                {Object.entries(SKILL_ATTRIBUTE_MAP).map(([skill, attribute]) => {
                    const skillData = sheetData.skills[skill] || { is_proficient: false, bonus: 0 };
                    return (
                        <div key={skill} className="flex items-center bg-white/30 p-1 rounded-sm">
                            <input type="checkbox" checked={skillData.is_proficient} onChange={(e) => handleGenericChange(`skills.${skill}.is_proficient`, e.target.checked)} className="mx-2 accent-red-900"/>
                            <span className="w-8 text-center font-bold">{formatModifier(skillData.bonus)}</span>
                            <span className="flex-1 capitalize">{skill.replace(/_/g, ' ')}</span>
                            <span className="text-xs text-gray-500 mr-2">({attribute.substring(0,3).toUpperCase()})</span>
                        </div>
                    );
                })}
            </div>
          </SheetSection>
        </div>

        {/* --- COLUNA CENTRAL: IMAGEM, COMBATE E EQUIPAMENTO --- */}
        <div className="md:col-span-1 space-y-4">
            <div className="bg-black/10 p-2 rounded-sm border-2 border-black/30 relative group">
              <div className="bg-gray-300 h-64 flex items-center justify-center">
                <img src={avatarUrl || 'https://i.imgur.com/g0P33p8.png'} alt={sheetData.character_name} className="w-full h-full object-cover object-top" />
              </div>
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="text-white bg-black/70 px-4 py-2 rounded">{isUploading ? 'Enviando...' : 'Trocar Imagem'}</button>
                <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} accept="image/*" className="hidden" />
              </div>
            </div>
            <SheetSection title="Vitalidade & Combate">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div><label className="text-xs uppercase">CA</label><input type="number" value={sheetData.armor_class} onChange={(e) => handleGenericChange('armor_class', parseInt(e.target.value))} className="w-full text-2xl font-bold bg-white/30 p-1 rounded text-center"/></div>
                  <div><label className="text-xs uppercase">Iniciativa</label><div className="text-2xl font-bold p-1">{formatModifier(sheetData.initiative)}</div></div>
                  <div><label className="text-xs uppercase">Desloc.</label><input type="text" value={sheetData.speed} onChange={(e) => handleGenericChange('speed', e.target.value)} className="w-full text-2xl font-bold bg-white/30 p-1 rounded text-center"/></div>
                </div>
                <div className="mt-2 bg-white/30 p-2 rounded">
                  <label className="text-xs uppercase">Pontos de Vida</label>
                  <div className="flex items-center justify-center space-x-2">
                    <input type="number" value={sheetData.current_hit_points} onChange={(e) => handleGenericChange('current_hit_points', parseInt(e.target.value) || 0)} className="w-1/2 p-1 text-center text-xl" placeholder="Atuais"/>
                    <span className="font-bold">/</span>
                    <input type="number" value={sheetData.hit_point_maximum} onChange={(e) => handleGenericChange('hit_point_maximum', parseInt(e.target.value) || 0)} className="w-1/2 p-1 text-center text-xl bg-white/50" placeholder="Máximo"/>
                  </div>
                </div>
                 <div className="mt-2 bg-white/30 p-2 rounded">
                  <label className="text-xs uppercase">Dados de Vida</label>
                  <input type="text" value={sheetData.hit_dice} onChange={(e) => handleGenericChange('hit_dice', e.target.value)} className="w-full p-1 text-center text-xl" />
                </div>
            </SheetSection>
            <SheetSection title="Ataques & Magias">
                <div className="space-y-2">
                    {sheetData.attacks_and_spellcasting.map((attack, index) => (
                        <div key={index} className="grid grid-cols-3 gap-1 text-sm">
                           <input type="text" value={attack.name} onChange={e => handleAttacksChange(index, 'name', e.target.value)} placeholder="Nome" className="col-span-3 p-1 rounded bg-white/50 border border-black/10"/>
                           <input type="text" value={attack.attack_bonus} onChange={e => handleAttacksChange(index, 'attack_bonus', e.target.value)} placeholder="Bônus" className="p-1 rounded bg-white/50 border border-black/10 text-center"/>
                           <input type="text" value={attack.damage} onChange={e => handleAttacksChange(index, 'damage', e.target.value)} placeholder="Dano/Tipo" className="col-span-2 p-1 rounded bg-white/50 border border-black/10"/>
                        </div>
                    ))}
                </div>
                <button onClick={addAttack} className="text-xs mt-2 w-full p-1 bg-black/50 text-white rounded hover:bg-black/60">+ Adicionar Ataque</button>
            </SheetSection>
        </div>

        {/* --- COLUNA DIREITA: ROLEPLAY E EQUIPAMENTO --- */}
        <div className="md:col-span-1 space-y-4">
          <SheetSection title="Traços de Personalidade"><textarea value={sheetData.personality_traits} onChange={(e) => handleGenericChange('personality_traits', e.target.value)} className="w-full h-24 p-2 bg-white/30 border border-black/20 rounded" /></SheetSection>
          <SheetSection title="Ideais"><textarea value={sheetData.ideals} onChange={(e) => handleGenericChange('ideals', e.target.value)} className="w-full h-24 p-2 bg-white/30 border border-black/20 rounded" /></SheetSection>
          <SheetSection title="Vínculos"><textarea value={sheetData.bonds} onChange={(e) => handleGenericChange('bonds', 