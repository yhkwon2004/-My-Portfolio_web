import { auth } from "@/auth";
import { contentSchema, getContent, saveContent } from "@/lib/content-store";

export async function GET() {
  const content = await getContent();
  return Response.json(content);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  const parsed = contentSchema.parse(payload);
  const saved = await saveContent(parsed);
  return Response.json(saved);
}
