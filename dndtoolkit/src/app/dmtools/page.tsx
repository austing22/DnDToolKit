// import Image from 'next/image';
// import Link from 'next/link';

// export default function Home() {
//   return (
//     <main className="min-h-screen px-4 py-12 flex flex-col items-center">
//       <h1 className="text-4xl font-bold text-center mb-10">DM Tools</h1>

//       <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
//         <Link href="/dmtools/initiative" className="group bg-white rounded-lg shadow p-6 flex flex-col items-center hover:shadow-lg transition">
//           <Image
//             src="/images/dmtools/initiative.png" 
//             alt="Initiative Tracker"
//             width={300}
//             height={200}
//             className="rounded mb-4 object-cover"
//           />
//           <h2 className="text-xl font-semibold group-hover:text-blue-600">Initiative Tracker</h2>
//         </Link>

//         <Link href="/dmtools/npcs" className="group bg-white rounded-lg shadow p-6 flex flex-col items-center hover:shadow-lg transition">
//           <Image
//             src="/images/dmtools/npc.png" 
//             alt="NPC Generator"
//             width={300}
//             height={200}
//             className="rounded mb-4 object-cover"
//           />
//           <h2 className="text-xl font-semibold group-hover:text-blue-600">NPC Generator</h2>
//         </Link>

//         <Link href="/dmtools/encounters" className="group bg-white rounded-lg shadow p-6 flex flex-col items-center hover:shadow-lg transition">
//           <Image
//             src="/images/dmtools/encounter.png" 
//             alt="Random Encounter Generator"
//             width={300}
//             height={200}
//             className="rounded mb-4 object-cover"
//           />
//           <h2 className="text-xl font-semibold group-hover:text-blue-600">Random Encounter Generator</h2>
//         </Link>
//       </section>
//     </main>
//   );
// }



import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 px-4 py-12 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-center mb-10">DM Tools</h1>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        <ToolCard
          href="/dmtools/initiative"
          imageSrc="/images/dmtools/initiative.png" 
          label="Initiative Tracker"
        />
        <ToolCard
          href="/dmtools/npcs"
          imageSrc="/images/dmtools/npc.png" 
          label="NPC Generator"
        />
        <ToolCard
          href="/dmtools/encounters"
          imageSrc="/images/dmtools/encounter.png" 
          label="Random Encounter Generator"
        />
      </section>
    </main>
  );
}

function ToolCard({ href, imageSrc, label }: { href: string; imageSrc: string; label: string }) {
  return (
    <Link href={href} className="relative group block w-full aspect-[3/2] rounded overflow-hidden shadow-lg hover:shadow-xl transition">
      <Image
        src={imageSrc}
        alt={label}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 33vw"
        priority
      />
      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/50 transition" />
      <p className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-xl font-semibold bg-black/60 px-4 py-2 rounded">
        {label}
      </p>
    </Link>
  );
}

