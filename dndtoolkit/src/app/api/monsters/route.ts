import { NextResponse, NextRequest } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Monster } from '@/types/monsters';
import { sleep } from '@/components/Sleep'; 

export async function POST(req: Request) {
  try {

    const data = await req.json();

    if (!data.name || !data.XP || !data.statBlock || !data.image) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('dndtoolkit');

    const result = await db.collection('monsters').insertOne(data);

    return NextResponse.json({ success: true, id: result.insertedId }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await sleep(1000);
    
    // 1. Parse and validate query parameters
    const searchParams = request.nextUrl.searchParams;

    const partySize = parseInt(searchParams.get("partySize") || "", 10);
    const partyLevel = parseInt(searchParams.get("partyLevel") || "", 10);
    const difficulty = searchParams.get("difficulty");

    if (
      isNaN(partySize) ||
      partySize < 1 ||
      isNaN(partyLevel) ||
      partyLevel < 1 ||
      !difficulty
    ) {
      return NextResponse.json(
        { error: "Invalid or missing parameters." },
        { status: 400 }
      );
    }

    // 2. XP thresholds from DMG
    const xpThresholds: Record<string, Record<number, number>> = {
        easy: {
            1: 25, 2: 50, 3: 75, 4: 125, 5: 250,
            6: 300, 7: 350, 8: 450, 9: 550, 10: 600,
            11: 800, 12: 1000, 13: 1100, 14: 1250, 15: 1400,
            16: 1600, 17: 2000, 18: 2100, 19: 2400, 20: 2800
        },
        medium: {
            1: 50, 2: 100, 3: 150, 4: 250, 5: 500,
            6: 600, 7: 750, 8: 900, 9: 1100, 10: 1200,
            11: 1600, 12: 2000, 13: 2200, 14: 2500, 15: 2800,
            16: 3200, 17: 3900, 18: 4200, 19: 4900, 20: 5700
        },
        hard: {
            1: 75, 2: 150, 3: 225, 4: 375, 5: 750,
            6: 900, 7: 1100, 8: 1400, 9: 1600, 10: 1900,
            11: 2400, 12: 3000, 13: 3400, 14: 3800, 15: 4300,
            16: 4800, 17: 5900, 18: 6300, 19: 7300, 20: 8500
        },
        deadly: {
            1: 100, 2: 200, 3: 400, 4: 500, 5: 1100,
            6: 1400, 7: 1700, 8: 2100, 9: 2400, 10: 2800,
            11: 3600, 12: 4500, 13: 5100, 14: 5700, 15: 6400,
            16: 7200, 17: 8800, 18: 9500, 19: 10900, 20: 12700
        },
    };


    // Shouldn't be able to enter an invalid difficulty, but put in a check for future
    if (!xpThresholds[difficulty.toLowerCase()]) {
      return NextResponse.json(
        { error: "Invalid difficulty level." },
        { status: 400 }
      );
    }

    if (!xpThresholds[difficulty.toLowerCase()][partyLevel]) {
      return NextResponse.json(
        { error: "Unsupported party level for difficulty calculation." },
        { status: 400 }
      );
    }

    const baseXp = xpThresholds[difficulty.toLowerCase()][partyLevel];
    const totalXpBudget = baseXp * partySize;

    // 3. XP multiplier table (DMG rules)
    function getXpMultiplier(monsterCount: number): number {
      if (monsterCount === 1) return 1;
      if (monsterCount === 2) return 1.5;
      if (monsterCount <= 6) return 2;
      if (monsterCount <= 10) return 2.5;
      if (monsterCount <= 14) return 3;
      return 4;
    }

    // 4. Fetch all monsters from MongoDB
    const client = await clientPromise;
    const db = client.db("dndtoolkit");
    const monsters = await db.collection<Monster>("monsters").find().toArray();

    if (!monsters.length) {
      return NextResponse.json(
        { error: "No monsters found in database." },
        { status: 500 }
      );
    }

    // 5. Attempt to generate a valid encounter
    const minXp = totalXpBudget * 0.8;
    const maxXp = totalXpBudget * 1.2;

    const maxAttempts = 1000;
    let generatedEncounter: Monster[] = [];

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const currentEncounter: Monster[] = [];
      const monsterCount = Math.floor(Math.random() * 6) + 1; // random number of monsters

      for (let i = 0; i < monsterCount; i++) {
        const randomIndex = Math.floor(Math.random() * monsters.length);
        currentEncounter.push(monsters[randomIndex]);
      }

      const rawXp = currentEncounter.reduce(
        (sum, monster) => sum + Number(monster.XP || 0), // monster.XP accesses XP from document field which is string
        0
      );
      const adjustedXp = rawXp * getXpMultiplier(currentEncounter.length);

      if (adjustedXp >= minXp && adjustedXp <= maxXp) {
        generatedEncounter = currentEncounter;
        break;
      }
    }

    if (!generatedEncounter.length) {
      return NextResponse.json(
        { error: "Unable to generate an encounter within the XP budget." },
        { status: 503 }
      );
    }

    // 6. Return result
    const responsePayload = generatedEncounter.map((monster) => ({
      name: monster.name,
      image: monster.image,
      XP: monster.XP,
      statBlock: monster.statBlock,
    }));

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (error) {
    console.error("Error generating encounter:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
