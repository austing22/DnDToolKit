'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Navbar() {
  // Use to manage Login/Logout
  const { data: session, status } = useSession();

  // Tracks which dropdown section is open
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Tracks if mobile menu is open
  const [menuOpen, setMenuOpen] = useState(false);

  // Opens or closes the section dropdown
  const toggleSection = (sectionName: string) => {
    if (activeSection === sectionName) {
      setActiveSection(null); // close if it's already open
    } else {
      setActiveSection(sectionName); // open new one, close any old
    }
  };

  return (
    <nav className="nav-general px-4 py-3">
      <div className="max-w-6xl mx-auto">
        {/* Top row: logo and hamburger */}
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            D&D Toolkit
          </Link>

          {/* Hamburger toggle (only shows on small screens) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-2xl"
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>

        {/* Main menu: hidden on mobile unless toggled, always visible on md+ */}
        <ul className={`mt-4 md:mt-0 md:flex md:space-x-6 ${menuOpen ? 'block' : 'hidden'} md:block`}>
          
          {/* DM Tools */}
          <li>
            <button
              onClick={() => toggleSection('dmTools')}
              className="nav-section"
            >
              DM Tools
            </button>
            <div
              className={`submenu-container ${
                activeSection === 'dmTools' ? 'open' : ''}`}
            >
              <ul className="submenu">
                <li>
                  <Link href="/npcs" className="nav-link">
                    NPC Generator
                  </Link>
                </li>
                <li>
                  <Link href="/npc-generator" className="nav-link">
                    Encounter Generator
                  </Link>
                </li>
                <li>
                  <Link href="/initiative" className="nav-link">
                    Initiative Tracker
                  </Link>
                </li>
              </ul>
            </div>
          </li>

          {/* Adventure Log */}
          <li>
            <button
              onClick={() => toggleSection('adventureLog')}
              className="nav-section"
            >
              Adventure Log
            </button>
            <div
              className={`submenu-container ${
                activeSection === 'adventureLog' ? 'open' : ''
              }`}
            >
              <ul className="submenu">
                <li>
                  <Link href="/adventurelog" className="nav-link">
                    Locations
                  </Link>
                </li>
                <li>
                  <Link href="/adventurelog" className="nav-link">
                    NPCs
                  </Link>
                </li>
                <li>
                  <Link href="/adventurelog" className="nav-link">
                    Quests
                  </Link>
                </li>
                <li>
                  <Link href="/adventurelog" className="nav-link">
                    Sessions
                  </Link>
                </li>
                <li>
                  <Link href="/adventurelog" className="nav-link">
                    Add Entry
                  </Link>
                </li>
              </ul>
            </div>
          </li>

          {/* Simple links */}
          <li>
            <Link href="/character/form" className="nav-link">
              Character Sheet
            </Link>
          </li>
          {/* Auth Section: Login or Logout */}
          <li className="mt-2 md:mt-0">
            {status === 'loading' ? (
              <span className="nav-link">Loading...</span>
            ) : session?.user ? (
              <div className="flex items-center space-x-4">
                <span className="nav-link">Hi, {session.user.name?.split(' ')[0]}</span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="nav-link"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className='nav-link'>
                Login
              </Link>
            )}
          </li>

        </ul>
      </div>
    </nav>
  );
}
