'use client';

import { useState } from 'react';

interface Combatant {
  id: number;
  name: string;
  modifier: number;
  roll: number | null;
  hp: number;
}

export default function InitiativeTracker() {
  const [combatants, setCombatants] = useState<Combatant[]>([]);
  const [turnIndex, setTurnIndex] = useState<number | null>(null);
  const [nextId, setNextId] = useState(1);

  const addCombatant = () => {
    setCombatants((prev) => [
      ...prev,
      { id: nextId, name: '', modifier: 0, roll: null, hp: 0 },
    ]);
    setNextId((id) => id + 1);
  };

  const removeCombatant = (id: number) => {
    setCombatants((prev) => prev.filter((c) => c.id !== id));
  };

  const handleChange = (
    id: number,
    field: keyof Combatant,
    value: string
  ) => {
    setCombatants((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;

        // Name is plain string
        if (field === "name") {
          return { ...c, name: value };
        }

        // Everything else is a number
        let num: number | null = parseInt(value, 10);
        if (isNaN(num)) {
          num = field === "roll" ? null : 0; // roll can be null, others fallback to 0
        }

        return { ...c, [field]: num };
      })
    );
  };

  const rollSingle = (id: number) => {
    setCombatants((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, roll: Math.floor(Math.random() * 20 + 1) } : c
      )
    );
  };

  const rollAllInitiative = () => {
    const rolled = combatants.map((c) => ({
      ...c,
      roll: 
        c.roll === null || c.roll === 0 || isNaN(c.roll)
        ? Math.floor(Math.random() * 20 + 1)
        : c.roll,
    }));

    const ordered = [...rolled].sort((a, b) => (b.roll! + b.modifier) - (a.roll! + a.modifier));
    setCombatants(ordered);
    setTurnIndex(0);
  };

  const nextTurn = () => {
    setTurnIndex((prev) => (prev !== null ? (prev + 1) % combatants.length : 0));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Initiative Tracker</h1>

      

      <div className="space-y-2">
        {combatants.map((c, index) => (
          <div
            key={c.id}
            className={`flex items-center gap-2 p-2 border rounded ${
              turnIndex === index ? 'bg-yellow-100' : 'bg-white'
            }`}
          >
            <div className="flex flex-col">
              <label className="text-xs">Name</label>
              <input
                type="text"
                value={c.name}
                onChange={(e) => handleChange(c.id, 'name', e.target.value)}
                className="input-sm"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs">Modifier</label>
              <input
                type="number"
                value={c.modifier}
                onChange={(e) => handleChange(c.id, 'modifier', e.target.value)}
                className="input-sm w-16"
                step={1}
                onKeyDown={(e) => e.preventDefault()} 
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs">Roll</label>
              <input
                type="number"
                value={c.roll ?? ''}
                onChange={(e) => handleChange(c.id, 'roll', e.target.value)}
                className="input-sm w-16"
              />
            </div>
            <button className="btn text-sm mt-4" onClick={() => rollSingle(c.id)}>🎲</button>
            <div className="flex flex-col">
              <label className="text-xs">HP</label>
              <input
                type="number"
                value={c.hp}
                onChange={(e) => handleChange(c.id, 'hp', e.target.value)}
                className="input-sm w-20"
              />
            </div>
            <div className="mt-6 ml-2 text-sm">
              {c.roll !== null ? `Total: ${c.roll + c.modifier}` : '—'}
            </div>
            <button
              className="btn text-red-500 text-xl ml-auto mt-4"
              onClick={() => removeCombatant(c.id)}
            >
              ❌
            </button>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-4 mb-4 pt-4">
        <button className="btn btn-primary" onClick={addCombatant}>Add Combatant</button>
        <button className="btn btn-primary" onClick={rollAllInitiative}>Roll Initiative</button>
        {turnIndex !== null && (
          <button className="btn btn-secondary" onClick={nextTurn}>Next Turn</button>
        )}
      </div>
    </div>
  );
}
