import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { auth } from "@/auth";
import { put } from "@vercel/blob";

export const runtime = "nodejs";

const INLINE_IMAGE_LIMIT = 384 * 1024;

function safeName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return Response.json({ error: "Missing file" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return Response.json({ error: "Only image uploads are supported" }, { status: 400 });
  }

  const name = `${Date.now()}-${safeName(file.name || "upload")}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`portfolio/${name}`, buffer, {
      access: "public",
      contentType: file.type,
      addRandomSuffix: true
    });
    return Response.json({ url: blob.url });
  }

  if (process.env.VERCEL) {
    return Response.json(
      {
        error: "Image storage is not configured. Add BLOB_READ_WRITE_TOKEN in Vercel and redeploy before uploading images."
      },
      { status: 503 }
    );
  }

  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, name), buffer);
  } catch (error) {
    if (buffer.byteLength > INLINE_IMAGE_LIMIT) {
      return Response.json(
        {
          error: error instanceof Error ? `Upload failed: ${error.message}` : "Upload failed"
        },
        { status: 500 }
      );
    }

    return Response.json({ url: `data:${file.type};base64,${buffer.toString("base64")}` });
  }

  return Response.json({ url: `/uploads/${name}` });
}
