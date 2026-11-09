"use client";

import { Show, SignInButton, SignUpButton } from "@clerk/nextjs";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

function ImagePreview({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={className} />;
}

export default function Home() {
  return <main>
    <SiteHeader />
    <section className="hero">
      <div><p className="eyebrow">YOUR STYLE, YOUR STORY</p><h1>Носи го.<br /><em>Сподели го.</em></h1><p className="hero-copy">Вдъхновение от реални хора, аутфити от твоя гардероб и място, където личният ти стил се вижда.</p><div className="hero-actions"><Link className="primary-button" href="/feed">Разгледай feed-а <span>↗</span></Link><Show when="signed-in"><Link className="secondary-button" href="/wardrobe">+ Моят гардероб</Link></Show><Show when="signed-out"><SignUpButton mode="redirect" forceRedirectUrl="/feed"><button className="secondary-button">Създай профил</button></SignUpButton></Show></div></div>
      <div className="hero-card"><ImagePreview src="https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1000&q=85" alt="Аутфит вдъхновение" className="hero-image" /><div className="hero-card-caption"><span>01 / 04</span><strong>Quiet confidence</strong><small>by @nora.style</small></div></div>
    </section>
    <section className="landing-links content-shell"><div><p className="eyebrow">START HERE</p><h2>Едно място за твоя стил.</h2><p className="hero-copy">Влез във feed-а, сподели своя фит или подреди дигиталния си гардероб.</p></div><div className="quick-link-grid"><Link className="quick-link-card" href="/feed"><strong>Feed</strong><span>Виж последните фитове →</span></Link><Show when="signed-in"><Link className="quick-link-card" href="/wardrobe"><strong>Моят гардероб</strong><span>Добавяй и търси дрехи →</span></Link></Show><Show when="signed-out"><SignInButton mode="modal"><button className="quick-link-card"><strong>Моят гардероб</strong><span>Влез, за да го отвориш →</span></button></SignInButton></Show></div></section>
  </main>;
}
