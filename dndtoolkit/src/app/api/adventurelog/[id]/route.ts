import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(
  req: NextRequest,
  context: unknown
  //{ params }: { params: { id: string } }
) : Promise<Response> {
  try {
    const { params } = context as { params: { id: string } };
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('dndtoolkit');
    const logs = db.collection('adventurelog');

    const result = await logs.deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Log not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Log deleted' }, { status: 200 });
  } catch (error) {
    console.error('DELETE /api/adventurelog/[id] error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context :unknown
  //{ params }: { params: { id: string } }
) : Promise<Response> {
  try {
    const { params } = context as { params: { id: string } };
    // const { id } = params; // Build says never used, but this is just what the internet said to fix...leaving for now
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { entry } = await req.json();
    if (!entry) {
      return NextResponse.json({ message: 'Missing entry text' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('dndtoolkit');
    const logs = db.collection('adventurelog');

    const result = await logs.findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          entry,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return NextResponse.json({ message: 'Log not found' }, { status: 404 });
    }

    return NextResponse.json(result.value);
  } catch (err) {
    console.error('PUT /api/adventurelog/[id] error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 

