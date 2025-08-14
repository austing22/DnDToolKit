"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type AbilityScore = { score: number; modifier: number };

type CharacterData = {
  name: string;
  level: number;
  class: string;
  image?: string | null;
  armor: string | null;
  shield: boolean;
  unarmoredDefense: boolean;
  armorClass: number;
  hitPoints: number;
  initiative: number;
  proficiencyBonus: number;
  abilityScores: Record<string, AbilityScore>;
  savingThrows: Record<string, number>;
  skills: Record<string, number>;
};

export default function CharacterPage({ userId }: { userId: string }) {
  const [character, setCharacter] = useState<CharacterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchCharacter() {
      try {
        const res = await fetch(`/api/users/${userId}/character`);
        if (!res.ok) throw new Error("Failed to fetch character");
        const data = await res.json();
        setCharacter(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchCharacter();
  }, [userId]);

  if (loading) return <p>Loading character data...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!character) return <p>No character data found.</p>;

    return (
    <div className="character-page">
      <div className="character-header">
        {character.image && (
          <Image
            className="character-portrait"
            src={character.image}
            alt={`${character.name} portrait`}
            width={200}
            height={200}
          />
        )}
        <div className="character-info">
          <h1>{character.name}</h1>
          <p>
            Level {character.level} {character.class}
          </p>
          <p>AC: {character.armorClass}</p>
          <p>HP: {character.hitPoints}</p>
          <p>Initiative: {character.initiative >= 0 ? `+${character.initiative}` : character.initiative}</p>
          <p>Proficiency: +{character.proficiencyBonus}</p>
        </div>
      </div>

      <div>
        <div className="character-grid">
            <div className="character-card">
            <h2>Ability Scores</h2>
            <ul>
                {Object.entries(character.abilityScores).map(([stat, value]) => (
                <li key={stat}>
                    <strong>{stat}</strong>: {value.score} (
                    {value.modifier >= 0 ? `+${value.modifier}` : value.modifier})
                </li>
                ))}
            </ul>
            </div>

            <div className="character-card">
            <h2>Saving Throws</h2>
            <ul>
                {Object.entries(character.savingThrows).map(([save, bonus]) => (
                <li key={save}>
                    <strong>{save}</strong>: {bonus >= 0 ? `+${bonus}` : bonus}
                </li>
                ))}
            </ul>
            </div>

            <div className="character-card full-width">
            <h2>Skills</h2>
            <ul>
                {Object.entries(character.skills).map(([skill, bonus]) => (
                <li key={skill}>
                    <strong>{skill}</strong>: {bonus >= 0 ? `+${bonus}` : bonus}
                </li>
                ))}
            </ul>
            </div>
        </div>
        <div className="mt-6 flex justify-center">
            <button 
                type="button" 
                className="btn btn-primary"
                onClick={() => router.push('/character/form')}
            >
                Edit Character
            </button>
        </div>
      </div>
    </div>
  );
}
