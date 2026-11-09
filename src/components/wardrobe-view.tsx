"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAppState } from "./app-state";
import { ItemUploadModal } from "./item-upload-modal";

export function WardrobeView() {
  const { items } = useAppState();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Всички");
  const [showModal, setShowModal] = useState(false);
  const categories = ["Всички", ...Array.from(new Set(items.map((item) => item.type)))];
  const visible = useMemo(() => items.filter((item) => (category === "Всички" || item.type === category) && `${item.name} ${item.type} ${item.color} ${item.description}`.toLowerCase().includes(query.toLowerCase())), [category, items, query]);
  return <><div className="feed-toolbar"><div><p className="eyebrow">PRIVATE SPACE</p><h1>Моят гардероб</h1><p className="toolbar-copy">{items.length} дрехи в твоя дигитален гардероб</p></div><div className="quick-actions"><Link className="secondary-button small" href="/feed">← Към feed-а</Link><button className="primary-button small" onClick={() => setShowModal(true)}>+ Добави дреха</button></div></div><div className="wardrobe-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Търси тениска, дънки, обувки..." aria-label="Търси в моя гардероб" />{query && <button onClick={() => setQuery("")} aria-label="Изчисти търсенето">×</button>}</div><div className="wardrobe-categories">{categories.map((item) => <button key={item} className={category === item ? "category selected" : "category"} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="wardrobe-grid">{visible.map((item) => <article className="item-card" key={item.id}><img src={item.image} alt={item.name} className="item-image" /><div><span>{item.type}</span><h3>{item.name}</h3><p>{item.color}</p><small>{item.description}</small></div></article>)}<button className="item-card add-card" onClick={() => setShowModal(true)}><span>+</span><strong>Добави дреха</strong><small>Снимай или качи снимка</small></button></div>{visible.length === 0 && <div className="wardrobe-empty"><strong>Няма намерени дрехи</strong><span>Пробвай с „тениска“ или добави нова дреха.</span></div>}{showModal && <ItemUploadModal onClose={() => setShowModal(false)} />}</>;
}
