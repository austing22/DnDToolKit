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
      <section className="w-full max-w-6xl px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <Link href="/dm-tools" className="flex flex-col items-center">
          <div className='w-24 h-24 md:w-32 md:h-32 relative'>
            <Image src="/images/home/dm_tools.png" alt="DM Tools" fill className="object-contain" />
          </div>
          <h2>DM Tools</h2>
        </Link>

        <Link href="/character" className="flex flex-col items-center">
          <div className='w-24 h-24 md:w-32 md:h-32 relative'>
            <Image src="/images/home/character_sheet.png" alt="Character Sheet" fill className="object-contain" />
          </div>
          <h2>Character Sheet</h2>
        </Link>

        <Link href="/adventurelog" className="flex flex-col items-center">
          <div className='w-24 h-24 md:w-32 md:h-32 relative'>
            <Image src="/images/home/adventure_logs.png" alt="Adventure Log" fill className="object-contain" />
          </div>
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
