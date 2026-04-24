import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { auth } from "@/auth";
import { put } from "@vercel/blob";

export const runtime = "nodejs";

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

  const name = `${Date.now()}-${safeName(file.name || "upload")}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`portfolio/${name}`, file, {
      access: "public",
      addRandomSuffix: true
    });
    return Response.json({ url: blob.url });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, name), buffer);

  return Response.json({ url: `/uploads/${name}` });
}
