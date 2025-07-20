import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = await clientPromise;
    const db = client.db(); // Use default DB from URI
    const collections = await db.listCollections().toArray();

    res.status(200).json({
      message: 'MongoDB connection successful!',
      collections: collections.map((c) => c.name),
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ error: 'Database connection failed.' });
  }
}
