// src/types/dnd5e.ts

// --- TIPOS DE SUPORTE ---

// Define a estrutura para um único atributo
export interface Attribute {
  score: number;
  modifier: number;
}

// Define a estrutura para uma única perícia ou teste de resistência
export interface Skill {
  is_proficient: boolean;
  has_expertise: boolean;
  bonus: number;
}

// Define a estrutura para um único ataque
export interface Attack {
  name: string;
  attack_bonus: string;
  damage: string;
}

// Define a estrutura para a moeda
export interface Currency {
  cp: number; // Peças de Cobre
  sp: number; // Peças de Prata
  ep: number; // Peças de Electro
  gp: number; // Peças de Ouro
  pp: number; // Peças de Platina
}

// --- INTERFACE PRINCIPAL DA FICHA ---

export interface Dnd5eSheetData {
  // Informações do Cabeçalho
  character_name: string;
  class_and_level: string;
  race: string;
  background: string;
  alignment: string;
  player_name: string;
  experience_points: number;

  // Atributos
  attributes: {
    strength: Attribute;
    dexterity: Attribute;
    constitution: Attribute;
    intelligence: Attribute;
    wisdom: Attribute;
    charisma: Attribute;
  };

  // Proficiência e Inspiração
  proficiency_bonus: number;
  inspiration: boolean;

  // Testes de Resistência
  saving_throws: Record<keyof Dnd5eSheetData["attributes"], Skill>;

  // Perícias
  skills: Record<string, Skill>;

  // Informações de Combate
  armor_class: number;
  initiative: number;
  speed: string;
  hit_point_maximum: number;
  current_hit_points: number;
  temporary_hit_points: number;
  hit_dice: string;
  death_saves: {
    successes: number;
    failures: number;
  };

  // Ataques e Magias
  attacks_and_spellcasting: Attack[];

  // Equipamento
  equipment: {
    item: string;
    quantity: number;
    weight: number;
  }[];
  currency: Currency;

  // Detalhes de Personalidade
  personality_traits: string;
  ideals: string;
  bonds: string;
  flaws: string;

  // Habilidades e Talentos
  features_and_traits: string[];

  // Outras Proficiências e Idiomas
  other_proficiencies_and_languages: string[];
}

// --- VALORES PADRÃO PARA UMA FICHA NOVA ---

export const defaultDnd5eSheet: Dnd5eSheetData = {
  character_name: "Novo Aventureiro",
  class_and_level: "Guerreiro 1",
  race: "Humano",
  background: "Acólito",
  alignment: "Leal e Bom",
  player_name: "",
  experience_points: 0,
  attributes: {
    strength: { score: 10, modifier: 0 },
    dexterity: { score: 10, modifier: 0 },
    constitution: { score: 10, modifier: 0 },
    intelligence: { score: 10, modifier: 0 },
    wisdom: { score: 10, modifier: 0 },
    charisma: { score: 10, modifier: 0 },
  },
  proficiency_bonus: 2,
  inspiration: false,
  saving_throws: {
    strength: { is_proficient: false, has_expertise: false, bonus: 0 },
    dexterity: { is_proficient: false, has_expertise: false, bonus: 0 },
    constitution: { is_proficient: false, has_expertise: false, bonus: 0 },
    intelligence: { is_proficient: false, has_expertise: false, bonus: 0 },
    wisdom: { is_proficient: false, has_expertise: false, bonus: 0 },
    charisma: { is_proficient: false, has_expertise: false, bonus: 0 },
  },
  skills: {}, // Será populado dinamicamente
  armor_class: 10,
  initiative: 0,
  speed: "9m",
  hit_point_maximum: 10,
  current_hit_points: 10,
  temporary_hit_points: 0,
  hit_dice: "1d10",
  death_saves: { successes: 0, failures: 0 },
  attacks_and_spellcasting: [
    { name: "Ataque Desarmado", attack_bonus: "+0", damage: "1 de concussão" },
  ],
  equipment: [],
  currency: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 },
  personality_traits: "",
  ideals: "",
  bonds: "",
  flaws: "",
  features_and_traits: [],
  other_proficiencies_and_languages: [],
};
