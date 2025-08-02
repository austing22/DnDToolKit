import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { type, entry } = body;

    if (!type || !entry) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    const MAX_ENTRY_LENGTH = 10000;
    if (typeof entry === 'string' && entry.length > MAX_ENTRY_LENGTH) {
      return NextResponse.json({ message: 'Payload Too Large'}, { status: 413 });
    }

    const client = await clientPromise;
    const db = client.db('dndtoolkit');
    const logs = db.collection('adventurelog');

    const newLog = {
      userId: new ObjectId(session.user.id),
      type,
      entry,
      createdAt: new Date(),
    };

    const result = await logs.insertOne(newLog);

    return NextResponse.json({ message: 'Log saved', id: result.insertedId }, { status: 201 });
  } catch (err) {
    console.error('Error saving adventure log:', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const type = req.nextUrl.searchParams.get('type');
    if (!type) {
      return NextResponse.json({ message: 'Missing type parameter' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('dndtoolkit');
    const logs = db.collection('adventurelog');

    const userLogs = await logs
      .find({ type })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(userLogs);
  } catch (err) {
    console.error('GET /api/adventurelog error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

