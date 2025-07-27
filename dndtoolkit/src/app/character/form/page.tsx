// src/app/character/form/page.tsx
import { getServerSession, Session } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { redirect } from 'next/navigation';
import CharacterForm from './CharacterForm';

export default async function Page() {
  const session: Session | null = await getServerSession(authOptions);
  if (!session) redirect('/login');

  return <CharacterForm userId={session.user.id} />;
}
