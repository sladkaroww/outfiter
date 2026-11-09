import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { WardrobeView } from "@/components/wardrobe-view";

export default async function WardrobePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in?redirect_url=%2Fwardrobe");
  return <main><SiteHeader active="wardrobe" /><div className="content-shell page-shell"><WardrobeView /></div></main>;
}
