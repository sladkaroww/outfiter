import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const sql = getDb();
    const items = await sql`
      select id, name, type, color, description, image_url, created_at
      from wardrobe_items
      where clerk_user_id = ${userId}
      order by created_at desc
    `;
    return NextResponse.json({ items });
  } catch (error) {
    console.error("Failed to load wardrobe", error);
    return NextResponse.json({ error: "Wardrobe is not configured yet" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const type = typeof body.type === "string" ? body.type.trim() : "";
  const color = typeof body.color === "string" ? body.color.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const imageUrl = typeof body.imageUrl === "string" ? body.imageUrl.trim() : "";

  if (!name || !type || !imageUrl) {
    return NextResponse.json({ error: "name, type and imageUrl are required" }, { status: 400 });
  }

  try {
    const sql = getDb();
    const [item] = await sql`
      insert into wardrobe_items (clerk_user_id, name, type, color, description, image_url)
      values (${userId}, ${name}, ${type}, ${color}, ${description}, ${imageUrl})
      returning id, name, type, color, description, image_url, created_at
    `;
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error("Failed to create wardrobe item", error);
    return NextResponse.json({ error: "Wardrobe is not configured yet" }, { status: 503 });
  }
}
