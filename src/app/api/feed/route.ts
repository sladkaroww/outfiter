import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const sql = getDb();
    const posts = await sql`
      select
        p.id,
        p.title,
        p.image_url,
        p.location,
        p.created_at,
        count(l.post_id)::int as likes,
        coalesce(
          json_agg(
            json_build_object('id', i.id, 'name', i.name, 'type', i.type)
          ) filter (where i.id is not null),
          '[]'::json
        ) as items
      from outfit_posts p
      left join outfit_post_items pi on pi.post_id = p.id
      left join wardrobe_items i on i.id = pi.item_id
      left join outfit_likes l on l.post_id = p.id
      group by p.id
      order by p.created_at desc
      limit 50
    `;

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Failed to load feed", error);
    return NextResponse.json({ error: "Feed is not configured yet" }, { status: 503 });
  }
}
