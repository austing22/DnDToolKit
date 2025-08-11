import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { Session } from 'next-auth';

export async function PUT(
  req: NextRequest,
  context: unknown
  // { params }: { params: { id: string } }
) : Promise<Response> {
  try {
    const { params } = context as { params: { id: string } };
    // Validate user
    const session: Session | null = await getServerSession(authOptions);
    const userId = params.id;
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.id !== userId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();

    if (!body.characterName || !body.abilityScores) {
      return NextResponse.json(
        { message: 'Missing required fields' }, 
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('dndtoolkit');
    const users = db.collection('users');

    const result = await users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { character: body } }  
    );
    console.log('result: ', result);

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: 'User not found or no change made' }, 
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Character data saved' },
      { status: 200 }
    );
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Add the GET method in here to fill the page
