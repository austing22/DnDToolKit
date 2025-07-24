import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/authOptions';
import { Session } from 'next-auth';

export default async function Dashboard() {
  const session: Session | null = await getServerSession(authOptions);

  if (!session) {
    // redirect to login if not signed in
    return <div>Redirecting to login...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Welcome, {session.user.name}</h1>
    </div>
  );
}
