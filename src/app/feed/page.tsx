import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { FeedView } from "@/components/feed-view";
import { SiteHeader } from "@/components/site-header";

export default async function FeedPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in?redirect_url=%2Ffeed");
  return <main><SiteHeader active="feed" /><div className="content-shell page-shell"><FeedView /></div></main>;
}
