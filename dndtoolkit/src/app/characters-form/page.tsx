'use client';

import { useState } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/authOptions';
import { redirect } from 'next/navigation';

const abilities = ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma'];
const skills = [
  'Acrobatics', 'Animal Handling', 'Arcana', 'Athletics', 'Deception', 'History',
  'Insight', 'Intimidation', 'Investigation', 'Medicine', 'Nature', 'Perception',
  'Performance', 'Persuasion', 'Religion', 'Sleight of Hand', 'Stealth', 'Survival'
];
const armors = ['None', 'Leather', 'Studded Leather', 'Chain Shirt', 'Scale Mail', 'Half Plate', 'Full Plate'];

export default async function CharacterForm() {
  // Check for user login, redirect to login if none
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }

  const [form, setForm] = useState({
    characterName: '',
    level: 1,
    abilityScores: Object.fromEntries(abilities.map(a => [a.toLowerCase(), 10])),
    skillProficiencies: [] as string[],
    savingThrows: [] as string[],
    armor: 'None',
    shield: false,
    unarmoredDefense: false,
    image: null as File | null,
  });

  const handleAbilityChange = (ability: string, value: number) => {
    setForm(prev => ({
      ...prev,
      abilityScores: {
        ...prev.abilityScores,
        [ability.toLowerCase()]: value,
      },
    }));
  };

  const handleCheckboxChange = (type: 'skillProficiencies' | 'savingThrows', value: string) => {
    setForm(prev => {
      const arr = prev[type];
      const updated = arr.includes(value)
        ? arr.filter(item => item !== value)
        : [...arr, value];
      return { ...prev, [type]: updated };
    });
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 font-serif">
      <h1 className="text-3xl font-bold text-[var(--accent-red)] uppercase mb-6 text-center">
        Create Character
      </h1>

      <form className="space-y-6">
        <div>
          <label>Character Name</label>
          <input
            type="text"
            value={form.characterName}
            onChange={(e) => setForm({ ...form, characterName: e.target.value })}
          />
        </div>

        <div>
          <label>Level</label>
          <input
            type="number"
            min={1}
            max={20}
            value={form.level}
            onChange={(e) => setForm({ ...form, level: parseInt(e.target.value) })}
          />
        </div>

        <fieldset>
          <legend className="font-bold text-[var(--accent-blue)] mb-2">Ability Scores</legend>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {abilities.map(ability => (
              <div key={ability}>
                <label>{ability}</label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={form.abilityScores[ability.toLowerCase()]}
                  onChange={(e) => handleAbilityChange(ability, parseInt(e.target.value))}
                />
              </div>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-bold text-[var(--accent-blue)] mb-2">Skill Proficiencies</legend>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {skills.map(skill => (
              <label key={skill}>
                <input
                  type="checkbox"
                  checked={form.skillProficiencies.includes(skill)}
                  onChange={() => handleCheckboxChange('skillProficiencies', skill)}
                />
                <span className="custom-checkbox">{skill}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-bold text-[var(--accent-blue)] mb-2">Saving Throws</legend>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {abilities.map(ability => (
              <label key={ability}>
                <input
                  type="checkbox"
                  checked={form.savingThrows.includes(ability)}
                  onChange={() => handleCheckboxChange('savingThrows', ability)}
                />
                <span className="custom-checkbox">{ability}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label>Armor</label>
          <select
            value={form.armor}
            onChange={(e) => setForm({ ...form, armor: e.target.value })}
          >
            {armors.map(armor => (
              <option key={armor} value={armor}>{armor}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4">
          <label>
            <input
              type="checkbox"
              checked={form.shield}
              onChange={(e) => setForm({ ...form, shield: e.target.checked })}
            />
            <span className="custom-checkbox">Shield</span>
          </label>

          <label>
            <input
              type="checkbox"
              checked={form.unarmoredDefense}
              onChange={(e) => setForm({ ...form, unarmoredDefense: e.target.checked })}
            />
            <span className="custom-checkbox">Unarmored Defense</span>
          </label>
        </div>

        <div>
          <label>Upload Character Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Save Character
        </button>
      </form>
    </main>
  );
}
