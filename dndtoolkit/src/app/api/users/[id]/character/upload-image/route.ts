// app/api/users/[userId]/character/upload-image/route.ts
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

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
