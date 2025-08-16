'use client';

import { useState } from 'react';

export default function MonsterUploadUtility() {
  const [name, setName] = useState('');
  const [XP, setXP] = useState('');
  const [statBlock, setStatBlock] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !XP || !statBlock || !imageFile) {
      setMessage('Please complete all fields.');
      return;
    }

    const monster = {
      name,
      XP,
      statBlock,
      image: `/images/monsters/${imageFile.name}` // Copy file manually into /public/images/monsters
    };

    try {
      const res = await fetch('/api/monsters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(monster)
      });

      if (!res.ok) throw new Error('Failed to save monster');

      setMessage('Monster saved!');
      setName('');
      setXP('');
      setStatBlock('');
      setImageFile(null);
    } catch (err) {
      console.error(err);
      setMessage('Failed to save monster');
    }
  };

  return (
    <main className="max-w-xl mx-auto px-4 py-10 font-serif">
      <h1 className="text-3xl font-bold text-[var(--accent-red)] uppercase mb-6 text-center">
        Add New Monster
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name">Monster Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="XP">XP Value</label>
          <input
            type="text"
            id="XP"
            value={XP}
            onChange={(e) => setXP(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="type">Stat Block</label>
          <input
            type="text"
            id="statBlock"
            value={statBlock}
            onChange={(e) => setStatBlock(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="image">Upload Image</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
          {imageFile && (
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Will be saved as: <code>/images/monsters/{imageFile.name}</code>
            </p>
          )}
        </div>
        <button type="submit" className="btn btn-primary">
          Save Monster
        </button>
        {message && <p className="mt-2 text-center">{message}</p>}
      </form>
    </main>
  );
}
