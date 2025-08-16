'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Monster } from '@/types/monsters';

export default function EncounterGenerator() {
  const [partySize, setPartySize] = useState(4);
  const [partyLevel, setPartyLevel] = useState(5);
  const [difficulty, setDifficulty] = useState('Medium');
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setMonsters([]);

    try {
      const res = await fetch(`/api/monsters?partySize=${partySize}&partyLevel=${partyLevel}&difficulty=${difficulty}`);
      if (!res.ok) {
        if (res.status === 400) {
            setError('Invalid or missing parameters. Try adjusting the parameters.');
        } else if (res.status === 503) {
            setError('Generator timed out. Try adjusting the parameters.');
        } else {
            setError('Failed to generate encounter');
        }
        setMonsters([]);
        return;
      }
      const data = await res.json();
      setMonsters(data || []);
    } catch (err) {
      console.error(err);
      setError('Unexpected Error. Please Try Again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 font-serif">
      <h1 className="text-3xl font-bold text-[var(--accent-red)] uppercase mb-6 text-center">
        Random Encounter Generator
      </h1>

      <div className="space-y-4 mb-6">
        <div>
          <label>Party Size</label>
          <input
            type="number"
            min={1}
            value={partySize}
            onChange={(e) => setPartySize(parseInt(e.target.value))}
          />
        </div>

        <div>
          <label>Party Level</label>
          <input
            type="number"
            min={1}
            max={20}
            value={partyLevel}
            onChange={(e) => setPartyLevel(parseInt(e.target.value))}
          />
        </div>

        <div>
          <label>Difficulty</label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
            <option>Deadly</option>
          </select>
        </div>

        <div className='text-center'>
            <button type="button" className="btn btn-primary" onClick={handleGenerate}>
            Generate Encounter
            </button>
        </div>
      </div>

      {loading && <p>Generating encounter...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {monsters.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
          {monsters.map((monster, idx) => (
            <Link
                key={idx}
                href={monster.statBlock}
                target='_blank'
                rel='noopener noreferrer'
                className='border rounded-lg overflow-hidden hover:shadow-lg/50 transition bg-[var(--accent-gold)]'
                >
                {monster.image && (
                    <div className='relative w-full aspect-square overflow-hidden rounded-t-lg'>
                        <Image
                        src={monster.image}
                        alt={monster.name}
                        fill
                        style={{ objectFit: 'cover', objectPosition: 'top' }}
                        sizes='100vw'
                        />
                    </div>
                )}
                <div className="p-4 text-center font-bold">{monster.name}</div>  
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
