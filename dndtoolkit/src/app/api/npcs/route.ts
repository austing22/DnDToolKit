import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb'; 

export async function POST(req: Request) {
    try {
    const body = await req.json();
    const { firstName, lastName, image } = body;

    if (!firstName || !lastName || !image) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('dndtoolkit');
    const collection = db.collection('npcs');

    const result = await collection.insertOne({ firstName, lastName, image });

    return NextResponse.json({ message: 'NPC created', npcId: result.insertedId }, { status: 201 });
  } catch (err) {
    console.error('Error inserting NPC:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
    try {
    const client = await clientPromise;
    const db = client.db('dndtoolkit');
    const collection = db.collection('npcs');

    const docs = await collection.aggregate([{ $sample: { size: 3 } }]).toArray();

    if (docs.length < 3) {
      return NextResponse.json({ message: 'Not enough NPCs to generate.' }, { status: 400 });
    }

    const npc = {
      firstName: docs[0].firstName,
      lastName: docs[1].lastName,
      image: docs[2].image,
    };

    return NextResponse.json(npc, { status: 200 });
  } catch (err) {
    console.error('GET /api/npcs error:', err);
    return NextResponse.json({ message: 'Failed to generate NPC' }, { status: 500 });
  }
}