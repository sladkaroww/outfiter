"use client";

import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export function SiteHeader({ active }: { active?: "feed" | "wardrobe" }) {
  return <header className="topbar">
    <Link className="brand" href="/">outfiter<span>.</span></Link>
    <nav className="desktop-nav" aria-label="Основна навигация">
      <Link className={active === "feed" ? "nav-link active" : "nav-link"} href="/feed">Feed</Link>
      <Show when="signed-in"><Link className={active === "wardrobe" ? "nav-link active" : "nav-link"} href="/wardrobe">Моят гардероб</Link></Show>
      <Show when="signed-out"><SignInButton mode="modal"><button className="nav-link">Моят гардероб</button></SignInButton></Show>
    </nav>
    <div className="auth-actions">
      <Show when="signed-out"><SignInButton mode="modal"><button className="text-button">Вход</button></SignInButton><SignUpButton mode="redirect" forceRedirectUrl="/feed"><button className="primary-button small">Създай профил</button></SignUpButton></Show>
      <Show when="signed-in"><UserButton /></Show>
    </div>
  </header>;
}
