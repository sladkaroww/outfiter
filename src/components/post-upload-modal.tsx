"use client";

import { FormEvent } from "react";
import { useAppState } from "./app-state";

export function PostUploadModal({ onClose }: { onClose: () => void }) {
  const { addPost, items } = useAppState();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    addPost({ author: "Твоят профил", handle: "@you", avatar: "YO", title: String(form.get("title") || "Нов аутфит"), location: "Твоят гардероб", image: String(form.get("image") || "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=85"), items: items.slice(0, 3).map((item) => item.name) });
    onClose();
  }
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><form className="modal" onSubmit={submit}><button type="button" className="modal-close" onClick={onClose}>×</button><p className="eyebrow">SHARE YOUR FIT</p><h2>Сподели аутфит</h2><p className="modal-copy">Покажи на общността какво носиш днес.</p><label>Заглавие<input name="title" placeholder="Напр. Sunday layers" required /></label><label>URL на снимка<input name="image" type="url" placeholder="https://..." /></label><button className="primary-button full" type="submit">Публикувай аутфита</button></form></div>;
}
