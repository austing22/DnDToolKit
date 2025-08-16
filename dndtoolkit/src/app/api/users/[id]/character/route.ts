import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { RawCharacter } from "@/types/character";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } 
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("dndtoolkit");

    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId((await context.params).id) });

    if (!user || !user.character) {
      return NextResponse.json({ error: "Character not found" }, { status: 404 });
    }

    if (user.email !== session.user.email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const char = user.character;
    const baseScores = char.abilityScores;

    const getModifier = (score: number) => Math.floor((score - 10) / 2);

    // Build structured ability scores
    const abilityScores = {
      strength: { score: baseScores.strength, modifier: getModifier(baseScores.strength) },
      dexterity: { score: baseScores.dexterity, modifier: getModifier(baseScores.dexterity) },
      constitution: { score: baseScores.constitution, modifier: getModifier(baseScores.constitution) },
      intelligence: { score: baseScores.intelligence, modifier: getModifier(baseScores.intelligence) },
      wisdom: { score: baseScores.wisdom, modifier: getModifier(baseScores.wisdom) },
      charisma: { score: baseScores.charisma, modifier: getModifier(baseScores.charisma) },
    };

    const modifiers = {
      STR: abilityScores.strength.modifier,
      DEX: abilityScores.dexterity.modifier,
      CON: abilityScores.constitution.modifier,
      INT: abilityScores.intelligence.modifier,
      WIS: abilityScores.wisdom.modifier,
      CHA: abilityScores.charisma.modifier,
    };

    // Armor Class logic
    type ArmorFormula = (modifiers: Record<string, number>) => number;

    const armorTable: Record<string, ArmorFormula> = {
      // Light Armor
      "Padded": (mods) => 11 + mods.DEX,
      "Leather": (mods) => 11 + mods.DEX,
      "Studded Leather": (mods) => 12 + mods.DEX,

      // Medium Armor (max +2 DEX)
      "Hide": (mods) => 12 + Math.min(2, mods.DEX),
      "Chain Shirt": (mods) => 13 + Math.min(2, mods.DEX),
      "Scale Mail": (mods) => 14 + Math.min(2, mods.DEX),
      "Breastplate": (mods) => 14 + Math.min(2, mods.DEX),
      "Half Plate": (mods) => 15 + Math.min(2, mods.DEX),

      // Heavy Armor (no DEX)
      "Ring Mail": () => 14,
      "Chain Mail": () => 16,
      "Splint": () => 17,
      "Full Plate": () => 18,
    };

    function calculateArmorClass(char: RawCharacter, modifiers: Record<string, number>): number {
      let armorClass = 10 + modifiers.DEX;

      if (char.armor === "None") {
        if (char.unarmoredDefense) {
          if (char.character_class === "Barbarian") {
            armorClass = 10 + modifiers.DEX + modifiers.CON;
          } else if (char.character_class === "Monk") {
            armorClass = 10 + modifiers.DEX + modifiers.WIS;
          }
        } else {
          armorClass = 10 + modifiers.DEX;
        }
      } else if (armorTable[char.armor]) {
        armorClass = armorTable[char.armor](modifiers);
      }

      if (char.shield) armorClass += 2;

      return armorClass;
    }


    const initiative = modifiers.DEX;
    const proficiencyBonus = Math.ceil(1 + char.level / 4);

    // Calculate saving throws
    const savingThrows = {
      strength: modifiers.STR + (char.savingThrows?.includes("strength") ? proficiencyBonus : 0),
      dexterity: modifiers.DEX + (char.savingThrows?.includes("dexterity") ? proficiencyBonus : 0),
      constitution: modifiers.CON + (char.savingThrows?.includes("constitution") ? proficiencyBonus : 0),
      intelligence: modifiers.INT + (char.savingThrows?.includes("intelligence") ? proficiencyBonus : 0),
      wisdom: modifiers.WIS + (char.savingThrows?.includes("wisdom") ? proficiencyBonus : 0),
      charisma: modifiers.CHA + (char.savingThrows?.includes("charisma") ? proficiencyBonus : 0),
    };

    // Skills mapping (ability used for each skill)
    const skillAbilities: Record<string, keyof typeof modifiers> = {
      athletics: "STR",
      acrobatics: "DEX",
      sleightOfHand: "DEX",
      stealth: "DEX",
      arcana: "INT",
      history: "INT",
      investigation: "INT",
      nature: "INT",
      religion: "INT",
      animalHandling: "WIS",
      insight: "WIS",
      medicine: "WIS",
      perception: "WIS",
      survival: "WIS",
      deception: "CHA",
      intimidation: "CHA",
      performance: "CHA",
      persuasion: "CHA",
    };

    const skills: Record<string, number> = {};
    for (const [skill, ability] of Object.entries(skillAbilities)) {
      const baseMod = modifiers[ability];
      const isProficient = char.skillProficiencies?.includes(skill) ?? false;
      skills[skill] = baseMod + (isProficient ? proficiencyBonus : 0);
    }

    // Hit points formula 
    // Map class to hit die size
    const hitDiceMap: Record<string, number> = {
      Barbarian: 12,
      Fighter: 10,
      Paladin: 10,
      Ranger: 10,
      Bard: 8,
      Cleric: 8,
      Druid: 8,
      Monk: 8,
      Rogue: 8,
      Warlock: 8,
      Sorcerer: 6,
      Wizard: 6,
    };

    // Calculate hit points
    function calculateHitPoints(char: RawCharacter, modifiers: Record<string, number>): number {
      const hitDie = hitDiceMap[char.character_class];
      if (!hitDie) throw new Error(`Unknown class: ${char.character_class}`);

      const level = char.level;
      if (level <= 0) return 0;

      const firstLevelHP = hitDie + modifiers.CON;
      const averagePerLevel = Math.floor(hitDie / 2) + 1 + modifiers.CON;

      return firstLevelHP + (level - 1) * averagePerLevel;
    }


    const calculatedCharacterStats = {
      name: char.characterName,
      level: char.level,
      class: char.character_class,
      image: char.image_path || user.image,
      armor: char.armor ?? "None",
      shield: !!char.shield,
      unarmoredDefense: !!char.unarmoredDefense,
      armorClass: calculateArmorClass(char,modifiers),
      hitPoints: calculateHitPoints(char, modifiers),
      initiative,
      proficiencyBonus,
      abilityScores,
      savingThrows,
      skills,
    };

    return NextResponse.json(calculatedCharacterStats, { status: 200 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
