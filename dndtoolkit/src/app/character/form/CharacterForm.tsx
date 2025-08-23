'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const abilities = ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma'];
const skills = [
  'Acrobatics', 'Animal Handling', 'Arcana', 'Athletics', 'Deception', 'History',
  'Insight', 'Intimidation', 'Investigation', 'Medicine', 'Nature', 'Perception',
  'Performance', 'Persuasion', 'Religion', 'Sleight of Hand', 'Stealth', 'Survival'
];
const armors = ['None', 'Leather', 'Studded Leather', 'Chain Shirt', 'Scale Mail', 'Half Plate', 'Full Plate'];
const character_class = ['Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk', 'Paladin', 'Ranger', 'Rouge', 'Sorcerer', 'Warlock', 'Wizard'];

export default function CharacterForm({ userId }: { userId: string }) {

  const router = useRouter();

  const [form, setForm] = useState({
    characterName: '',
    level: 1,
    character_class: 'Barbarian',
    abilityScores: Object.fromEntries(abilities.map(a => [a.toLowerCase(), 10])),
    skillProficiencies: [] as string[],
    savingThrows: [] as string[],
    armor: 'None',
    shield: false,
    unarmoredDefense: false,
    image: null as File | null,
  });

  useEffect(() => {
    async function fetchCharacter() {
      try {
        console.log("Fetching Character Data...")
        const res = await fetch(`/api/users/${userId}/character/form`, );
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setForm((prev) => ({
              ...prev,
              ...data,
              abilityScores: data.abilityScores || prev.abilityScores,
            }));
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchCharacter();
  }, [userId]);

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

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    // Start with whatever the form already has 
    let image_path: string | null =
      (form as unknown as { image_path?: string | null }).image_path ?? null;

    // 1) If the user picked a new file, upload it first
    if (form.image) {
      const formData = new FormData();
      formData.append("file", form.image);

      const uploadRes = await fetch(`/api/users/${userId}/character/upload-image`, {
        method: "POST",
        // IMPORTANT: no 'Content-Type' header (browser sets multipart boundary)
        body: formData,
      });

      if (!uploadRes.ok) {
        const err = await uploadRes.json().catch(() => ({}));
        throw new Error(err?.message || "Image upload failed");
      }

      const { url } = await uploadRes.json();
      image_path = url; // use the blob URL returned by the upload endpoint
    }

    // 2) Save the character (include image_path so it isn't wiped server-side)
    const response = await fetch(`/api/users/${userId}/character/form`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        characterName: form.characterName,
        level: form.level,
        character_class: form.character_class,
        abilityScores: form.abilityScores,
        skillProficiencies: form.skillProficiencies,
        savingThrows: form.savingThrows,
        armor: form.armor,
        shield: form.shield,
        unarmoredDefense: form.unarmoredDefense,
        image_path, 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || "Failed to save character");
    }

    alert("Character saved!");
    router.push("/character");
  } catch (err) {
    console.error("API error:", err);
    alert(err instanceof Error ? err.message : "Failed to save character.");
  }
};

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 font-serif">
      <h1 className="text-3xl font-bold text-[var(--accent-red)] uppercase mb-6 text-center">
        {form.characterName ? "Edit Character" : "Create Character"}
      </h1>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Character Name */}
        <div>
          <label>Character Name</label>
          <input
            type="text"
            value={form.characterName}
            onChange={(e) => setForm({ ...form, characterName: e.target.value })}
          />
        </div>

        {/* Level & Class */}
        <div>
          <label>Level</label>
          <input
            type="number"
            min={1}
            max={20}
            value={form.level}
            onChange={(e) => setForm({ ...form, level: parseInt(e.target.value) })}
          />
          <label>Class</label>
          <select
            value={form.character_class}
            onChange={(e) => setForm({ ...form, character_class: e.target.value })}
          >
            {character_class.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Ability Scores */}
        <fieldset>
          <legend className="font-bold text-[var(--accent-blue)] mb-2">Ability Scores</legend>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {abilities.map((ability) => (
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

        {/* Skill Proficiencies */}
        <fieldset>
          <legend className="font-bold text-[var(--accent-blue)] mb-2">Skill Proficiencies</legend>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {skills.map((skill) => (
              <label key={skill}>
                <input
                  type="checkbox"
                  checked={form.skillProficiencies.includes(skill)}
                  onChange={() => handleCheckboxChange("skillProficiencies", skill)}
                />
                <span className="custom-checkbox">{skill}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Saving Throws */}
        <fieldset>
          <legend className="font-bold text-[var(--accent-blue)] mb-2">Saving Throws</legend>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {abilities.map((ability) => (
              <label key={ability}>
                <input
                  type="checkbox"
                  checked={form.savingThrows.includes(ability)}
                  onChange={() => handleCheckboxChange("savingThrows", ability)}
                />
                <span className="custom-checkbox">{ability}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Armor */}
        <div>
          <label>Armor</label>
          <select
            value={form.armor}
            onChange={(e) => setForm({ ...form, armor: e.target.value })}
          >
            {armors.map((armor) => (
              <option key={armor} value={armor}>
                {armor}
              </option>
            ))}
          </select>
        </div>

        {/* Shield / Unarmored */}
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

        {/* Image Upload */}
        <div>
          <label>Upload Character Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })}
          />
        </div>

        {/* Submit */}
        <button type="submit" className="btn btn-primary">
          Save Character
        </button>
      </form>
    </main>
  );
}
