import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { Session } from 'next-auth';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    // Validate user
    const session: Session | null = await getServerSession(authOptions);
    if (!session || session.user.id !== params.id) {
        return NextResponse.json({message: 'Forbidden'}, { status: 403 });
    }
    const body = await req.json();

    if (!userId || !body.characterName || !body.abilityScores) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('dndtoolkit');
    const users = db.collection('users');

    const result = await users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { ...body } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: 'User not found or data unchanged' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Character data saved' }, { status: 204 });
  } catch (error) {
    console.error('PUT /api/users/[id]/character/form error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
