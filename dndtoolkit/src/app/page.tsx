'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center">
      {/* Banner Image */}
      <div className="w-full">
        <img
          src="https://placehold.co/600x400" // Replace with your actual banner image path
          alt="Welcome Banner"
          className="w-full object-cover h-64 md:h-80 lg:h-96"
        />
      </div>

      {/* Feature Icons */}
      <section className="w-full max-w-6xl px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <Link href="/dm-tools" className="flex flex-col items-center">
          <img src="https://placehold.co/400" alt="DM Tools" className="h-20 w-20 mb-2" />
          <h2>DM Tools</h2>
        </Link>

        <Link href="/character" className="flex flex-col items-center">
          <img src="https://placehold.co/400" alt="Character Sheet" className="h-20 w-20 mb-2" />
          <h2>Character Sheet</h2>
        </Link>

        <Link href="/adventurelog" className="flex flex-col items-center">
          <img src="https://placehold.co/400" alt="Adventure Log" className="h-20 w-20 mb-2" />
          <h2>Adventure Log</h2>
        </Link>
      </section>

      {/* Login Button */}
      <div className="py-4">
        <Link href="/login">
          <button className='btn btn-primary'>
            Login
          </button>
        </Link>
      </div>
    </main>
  );
}
