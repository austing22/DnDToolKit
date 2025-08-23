import { NextResponse } from "next/server";
import { put, list, del } from "@vercel/blob";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const userId = (await context.params).id;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // List existing blobs and delete them
    const existing = await list({ prefix: `characters/${userId}/` });
    for (const blob of existing.blobs) {
      await del(blob.url, { token: process.env.BLOB_READ_WRITE_TOKEN });
    }

    // Upload to Vercel Blob
    const blob = await put(`characters/${userId}/${file.name}`, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({ url: blob.url }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
