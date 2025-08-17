
export type RawCharacter = {
  characterName: string;
  level: number;
  character_class: string;
  armor: string;
  shield?: boolean;
  unarmoredDefense?: boolean;
  abilityScores: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  savingThrows?: string[];
  skillProficiencies?: string[];
  image_path?: string | null;
};
