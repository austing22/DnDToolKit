'use client';

import { useState } from 'react';

export default function NpcUploadUtility() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !imageFile) {
      setMessage('Please complete all fields.');
      return;
    }

    const npc = {
      firstName,
      lastName,
      image: `/images/npcs/${imageFile.name}` // Assumes you copy file manually into /public/images/npcs
    };

    try {
      const res = await fetch('/api/npcs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(npc)
      });

      if (!res.ok) throw new Error('Failed to save NPC');

      setMessage('NPC saved!');
      setFirstName('');
      setLastName('');
      setImageFile(null);
    } catch (err) {
      console.error(err);
      setMessage('Failed to save NPC');
    }
  };

  return (
    <main className="max-w-xl mx-auto px-4 py-10 font-serif">
      <h1 className="text-3xl font-bold text-[var(--accent-red)] uppercase mb-6 text-center">
        Add New NPC
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
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
              Will be saved as: <code>/images/npcs/{imageFile.name}</code>
            </p>
          )}
        </div>
        <button type="submit" className="btn btn-primary">
          Save NPC
        </button>
        {message && <p className="mt-2 text-center">{message}</p>}
      </form>
    </main>
  );
}
