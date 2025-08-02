'use client';

import Link from 'next/link';

export default function AdventureLogPage() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const type = formData.get('type');
  const entry = formData.get('entry');

  if (!type || !entry) {
    alert('Please complete the form.');
    return;
  }

  const res = await fetch('/api/adventurelog', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type, entry }),
  });

  if (res.ok) {
    const data = await res.json();
    alert('Log saved');
    // Clear form or show confirmation
    (e.target as HTMLFormElement).reset();
  } else {
    const error = await res.json();
    console.error('Failed to save log:', error.message);
    alert(`Error: ${error.message}`);
  }
};


  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Navigation Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Link href="/adventurelog/view?type=location" className="nav-tile">
          <img src="/images/locations.png" alt="Locations" className="tile-img" />
          <p className="tile-label">Locations</p>
        </Link>
        <Link href="/adventurelog/view?type=npc" className="nav-tile">
          <img src="/images/npcs.png" alt="NPCs" className="tile-img" />
          <p className="tile-label">NPCs</p>
        </Link>
        <Link href="/adventurelog/view?type=quest" className="nav-tile">
          <img src="/images/quests.png" alt="Quests" className="tile-img" />
          <p className="tile-label">Quests</p>
        </Link>
        <Link href="/adventurelog/view?type=session" className="nav-tile">
          <img src="/images/sessions.png" alt="Sessions" className="tile-img" />
          <p className="tile-label">Sessions</p>
        </Link>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="form-label block mb-2"><h2>Log Type</h2></label>
          <div className="radio-group flex gap-4 flex-wrap">
            {['location', 'npc', 'quest', 'session'].map((t) => (
              <div key={t}>
                <input type="radio" name="type" id={`type-${t}`} value={t} defaultChecked={t === 'location'} />
                <label htmlFor={`type-${t}`} className="custom-radio capitalize">{t}</label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="entry" className="block mb-2"><h2>Entry Text</h2></label>
          <textarea
            id="entry"
            name="entry"
            className="form-textarea w-full"
            rows={6}
            placeholder="Enter log text here..."
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit Log
        </button>
      </form>
    </div>
  );
}
