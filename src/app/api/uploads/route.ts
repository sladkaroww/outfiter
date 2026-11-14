import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createUploadUrl } from "@/lib/storage";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const contentType = typeof body.contentType === "string" ? body.contentType : "";
  if (!allowedTypes.has(contentType)) {
    return NextResponse.json({ error: "Only JPEG, PNG, WebP and GIF images are supported" }, { status: 400 });
  }

  const extension = contentType.split("/")[1].replace("jpeg", "jpg");
  const key = `wardrobe/${userId}/${crypto.randomUUID()}.${extension}`;

  try {
    const uploadUrl = await createUploadUrl(key, contentType);
    return NextResponse.json({ key, uploadUrl });
  } catch (error) {
    console.error("Failed to create image upload URL", error);
    return NextResponse.json({ error: "Image storage is not configured" }, { status: 503 });
  }
}
