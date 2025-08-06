'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Npc {
  firstName: string;
  lastName: string;
  image: string;
}

export default function NpcGenerator() {
  const [npc, setNpc] = useState<Npc | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchNpc = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/npcs', { method: 'GET'});
      if (!res.ok) throw new Error('Failed to fetch NPC');
      const data: Npc = await res.json();
      setNpc(data);
    } catch (error) {
      console.error('Error fetching NPC:', error);
      setNpc(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 text-center font-serif">
      <h1 className="text-3xl md:text-4xl font-bold uppercase text-[var(--accent-red)] mb-6">
        Random NPC Generator
      </h1>
      <p className="mb-4 text-[var(--text-muted)]">
        Click below to meet someone unexpected.
      </p>

      <button onClick={fetchNpc} className="btn btn-primary">
        {loading ? 'Generating...' : 'Generate NPC'}
      </button>

      {npc && (
        <div className="mt-8 flex flex-col items-center">
          <Image
            src={npc.image}
            alt={`${npc.firstName} ${npc.lastName}`}
            width={100}
            height={100}
            className="w-40 h-40 object-cover object-top rounded-full border-4 border-[var(--accent-blue)] shadow-md mb-4"
          />
          <div className="text-[var(--accent-gold)] font-semibold text-xl leading-tight mt-2">
            <div>{npc.firstName}</div>
            <div>{npc.lastName}</div>
          </div>
        </div>
      )}
    </main>
  );
}
