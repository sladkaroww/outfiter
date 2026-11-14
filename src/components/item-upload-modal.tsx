"use client";

import { FormEvent, useState } from "react";
import { Button as YamadaButton, Field, Input as YamadaInput, Textarea as YamadaTextarea } from "@yamada-ui/react";
import { MagneticDropZone } from "./MagneticDropZone";
import { useAppState } from "./app-state";

export function ItemUploadModal({ onClose }: { onClose: () => void }) {
  const { addItem } = useAppState();
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File>();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      await addItem({ name: String(form.get("name") || "Нова дреха"), type: String(form.get("type") || "Други"), color: String(form.get("color") || "Неутрален"), description: String(form.get("description") || ""), image: image || "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=700&q=85" }, imageFile);
      onClose();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Неуспешно запазване");
    } finally {
      setSaving(false);
    }
  }
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><form className="modal" onSubmit={submit}><button type="button" className="modal-close" onClick={onClose}>×</button><p className="eyebrow">MY WARDROBE</p><h2>Добави дреха</h2><p className="modal-copy">Създай дигитален гардероб, който е наистина твой.</p><label>Снимка</label><MagneticDropZone onFilesChange={(files) => { const file = files[0]; setImageFile(file); setImage(file ? URL.createObjectURL(file) : ""); }} />{image && <img src={image} alt="Преглед" className="upload-preview" />}<Field.Root label="Име" replace={false}><YamadaInput name="name" placeholder="Напр. Винтидж риза" required /></Field.Root><div className="form-row"><Field.Root label="Тип" replace={false}><select name="type" defaultValue="Тениска"><option>Тениска</option><option>Риза</option><option>Връхна дреха</option><option>Дънки</option><option>Обувки</option><option>Аксесоар</option></select></Field.Root><Field.Root label="Цвят" replace={false}><YamadaInput name="color" placeholder="Черно" /></Field.Root></div><Field.Root label="Описание" replace={false}><YamadaTextarea name="description" placeholder="Опиши дрехата си..." rows={3} /></Field.Root>{error && <p className="upload-error">{error}</p>}<YamadaButton className="primary-button full" type="submit" loading={saving}>Запази в гардероба</YamadaButton></form></div>;
}
