'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center">
      {/* Banner Image */}
      <div className="w-full relative h-64 md:h-80 lg:h-96">
        <Image
          src="/images/home/home_banner.jpg"
          alt="Welcome Banner"
          fill
          className="object-cover"
        />
      </div>

      {/* Feature Icons */}
      <section className="w-full max-w-6xl px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/dmtools" className="nav-tile">
          <Image 
            src="/images/home/dm_tools.png" 
            alt="DM Tools" 
            fill 
            className="tile-Image object-contain"
          />
          <p className="tile-label">DM Tools</p>
        </Link>

        <Link href="/character" className="nav-tile">
          <Image 
            src="/images/home/character_sheet.png" 
            alt="Character Sheet" 
            fill 
            className="tile-Image object-contain"
          />
          <p className="tile-label">Character Sheet</p>
        </Link>

        <Link href="/adventurelog" className="nav-tile">
          <Image 
            src="/images/home/adventure_logs.png" 
            alt="Adventure Log" 
            fill 
            className="tile-Image object-contain"
          />
          <p className="tile-label">Adventure Log</p>
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
