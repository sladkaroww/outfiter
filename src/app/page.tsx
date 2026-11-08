"use client";

import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import {
  Button as YamadaButton,
  Field,
  Input as YamadaInput,
  Textarea as YamadaTextarea,
} from "@yamada-ui/react";
import Link from "next/link";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";

type ClothingItem = {
  id: number;
  name: string;
  type: string;
  color: string;
  description: string;
  image: string;
};

type OutfitPost = {
  id: number;
  author: string;
  handle: string;
  avatar: string;
  title: string;
  location: string;
  image: string;
  liked: boolean;
  likes: number;
  items: string[];
};

const starterItems: ClothingItem[] = [
  {
    id: 1,
    name: "Oversized blazer",
    type: "Връхна дреха",
    color: "Черно",
    description: "Структуриран блейзър за ежедневни и официални визии.",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 2,
    name: "Classic white tee",
    type: "Тениска",
    color: "Бяло",
    description: "Базова памучна тениска със свободна кройка.",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 3,
    name: "Straight denim",
    type: "Дънки",
    color: "Синьо",
    description: "Прав модел дънки с висока талия.",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=700&q=85",
  },
];

const starterPosts: OutfitPost[] = [
  {
    id: 1,
    author: "Mia Petrova",
    handle: "@miapetrova",
    avatar: "MP",
    title: "Coffee run uniform",
    location: "Sofia, Bulgaria",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85",
    liked: false,
    likes: 128,
    items: ["Blazer", "White tee", "Denim"],
  },
  {
    id: 2,
    author: "Alex Ivanov",
    handle: "@alexwears",
    avatar: "AI",
    title: "Soft tailoring",
    location: "Plovdiv, Bulgaria",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85",
    liked: false,
    likes: 86,
    items: ["Linen shirt", "Wide trousers"],
  },
];

const categories = ["Всички", "Ежедневни", "Работа", "Вечер", "Спорт"];

function ImagePreview({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} />
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<"feed" | "wardrobe">("feed");
  const [activeCategory, setActiveCategory] = useState("Всички");
  const [items, setItems] = useState(starterItems);
  const [posts, setPosts] = useState(starterPosts);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [newItemImage, setNewItemImage] = useState("");
  const [wardrobeSearch, setWardrobeSearch] = useState("");
  const [wardrobeCategory, setWardrobeCategory] = useState("Всички");

  const visiblePosts = useMemo(() => {
    if (activeCategory === "Всички") return posts;
    return posts.filter((post) => post.title.toLowerCase().includes(activeCategory.slice(0, -1).toLowerCase()));
  }, [activeCategory, posts]);

  const wardrobeCategories = ["Всички", ...Array.from(new Set(items.map((item) => item.type)))];
  const visibleItems = useMemo(() => {
    const query = wardrobeSearch.trim().toLowerCase();
    return items.filter((item) => {
      const matchesCategory = wardrobeCategory === "Всички" || item.type === wardrobeCategory;
      const searchable = `${item.name} ${item.type} ${item.color} ${item.description}`.toLowerCase();
      return matchesCategory && (!query || searchable.includes(query));
    });
  }, [items, wardrobeCategory, wardrobeSearch]);

  function toggleLike(id: number) {
    setPosts((current) =>
      current.map((post) =>
        post.id === id
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post,
      ),
    );
  }

  function addItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "Нова дреха");
    const type = String(form.get("type") || "Други");
    const color = String(form.get("color") || "Неутрален");
    const description = String(form.get("description") || "");

    setItems((current) => [
      {
        id: Date.now(),
        name,
        type,
        color,
        description,
        image:
          newItemImage ||
          "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=700&q=85",
      },
      ...current,
    ]);
    setNewItemImage("");
    setShowItemModal(false);
    event.currentTarget.reset();
  }

  function handleImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setNewItemImage(URL.createObjectURL(file));
  }

  function addPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") || "Нов аутфит");
    const image =
      String(form.get("image") || "") ||
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=85";

    setPosts((current) => [
      {
        id: Date.now(),
        author: "Твоят профил",
        handle: "@you",
        avatar: "YO",
        title,
        location: "Твоят гардероб",
        image,
        liked: false,
        likes: 0,
        items: items.slice(0, 3).map((item) => item.name),
      },
      ...current,
    ]);
    setShowPostModal(false);
    event.currentTarget.reset();
  }

  return (
    <main>
      <header className="topbar">
        <Link className="brand" href="/">
          outfiter<span>.</span>
        </Link>
        <nav className="desktop-nav" aria-label="Основна навигация">
          <button className={activeTab === "feed" ? "nav-link active" : "nav-link"} onClick={() => setActiveTab("feed")}>
            Feed
          </button>
          <Show when="signed-in">
            <button className={activeTab === "wardrobe" ? "nav-link active" : "nav-link"} onClick={() => setActiveTab("wardrobe")}>
              Моят гардероб
            </button>
          </Show>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="nav-link">Моят гардероб</button>
            </SignInButton>
          </Show>
        </nav>
        <div className="auth-actions">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="text-button">Вход</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="primary-button small">Създай профил</button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">YOUR STYLE, YOUR STORY</p>
          <h1>Носи го.<br /><em>Сподели го.</em></h1>
          <p className="hero-copy">
            Вдъхновение от реални хора, аутфити от твоя гардероб и място,
            където личният ти стил се вижда.
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => setActiveTab("feed")}>Разгледай feed-а <span>↗</span></button>
            <Show when="signed-in">
              <button className="secondary-button" onClick={() => setActiveTab("wardrobe")}>+ Добави дреха</button>
            </Show>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="secondary-button">Влез, за да добавяш дрехи</button>
              </SignInButton>
            </Show>
          </div>
        </div>
        <div className="hero-card">
          <ImagePreview
            src="https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1000&q=85"
            alt="Аутфит вдъхновение"
            className="hero-image"
          />
          <div className="hero-card-caption">
            <span>01 / 04</span>
            <strong>Quiet confidence</strong>
            <small>by @nora.style</small>
          </div>
        </div>
      </section>

      <div className="content-shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">DISCOVER</p>
            <h2>{activeTab === "feed" ? "Какво носят хората" : "Моят гардероб"}</h2>
          </div>
          <div className="tab-switcher">
            <button className={activeTab === "feed" ? "selected" : ""} onClick={() => setActiveTab("feed")}>Feed</button>
            <Show when="signed-in">
              <button className={activeTab === "wardrobe" ? "selected" : ""} onClick={() => setActiveTab("wardrobe")}>Моят гардероб</button>
            </Show>
          </div>
        </div>

        {activeTab === "feed" ? (
          <>
            <div className="category-row">
              {categories.map((category) => (
                <button key={category} className={activeCategory === category ? "category selected" : "category"} onClick={() => setActiveCategory(category)}>
                  {category}
                </button>
              ))}
            </div>
            <div className="feed-grid">
              {visiblePosts.map((post) => (
                <article className="post-card" key={post.id}>
                  <div className="post-image-wrap">
                    <ImagePreview src={post.image} alt={post.title} className="post-image" />
                    <button className={post.liked ? "like-button liked" : "like-button"} onClick={() => toggleLike(post.id)} aria-label="Харесай аутфита">
                      {post.liked ? "♥" : "♡"}
                    </button>
                  </div>
                  <div className="post-meta">
                    <div className="author">
                      <span className="avatar">{post.avatar}</span>
                      <div><strong>{post.author}</strong><small>{post.handle}</small></div>
                    </div>
                    <span className="likes">♥ {post.likes}</span>
                  </div>
                  <h3>{post.title}</h3>
                  <p className="location">{post.location}</p>
                  <div className="item-tags">{post.items.map((item) => <span key={item}>{item}</span>)}</div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <Show when="signed-in" fallback={
            <section className="private-wardrobe-prompt">
              <p className="eyebrow">PRIVATE SPACE</p>
              <h2>Влез, за да отвориш своя гардероб.</h2>
              <p>Тук ще съхраняваш дрехите си, ще ги намираш с търсачка и ще създаваш лични аутфити.</p>
              <SignInButton mode="modal"><button className="primary-button">Влез в профила си <span>↗</span></button></SignInButton>
            </section>
          }>
          <section className="wardrobe-section">
            <div className="wardrobe-toolbar">
              <div><p className="eyebrow">PRIVATE SPACE</p><p>{items.length} дрехи в твоя гардероб</p></div>
              <button className="primary-button small" onClick={() => setShowItemModal(true)}>+ Добави дреха</button>
            </div>
            <div className="wardrobe-search">
              <span>⌕</span>
              <YamadaInput
                value={wardrobeSearch}
                onChange={(event) => setWardrobeSearch(event.target.value)}
                placeholder="Търси тениска, дънки, обувки..."
                aria-label="Търси в моя гардероб"
                variant="flushed"
              />
              {wardrobeSearch && <button onClick={() => setWardrobeSearch("")} aria-label="Изчисти търсенето">×</button>}
            </div>
            <div className="wardrobe-categories">
              {wardrobeCategories.map((category) => <button key={category} className={wardrobeCategory === category ? "category selected" : "category"} onClick={() => setWardrobeCategory(category)}>{category}</button>)}
            </div>
            {visibleItems.length === 0 ? <div className="wardrobe-empty"><strong>Няма намерени дрехи</strong><span>Пробвай с „тениска“ или добави нова дреха.</span><button className="secondary-button" onClick={() => setShowItemModal(true)}>+ Добави дреха</button></div> : null}
            <div className="wardrobe-grid">
              {visibleItems.map((item) => (
                <article className="item-card" key={item.id}>
                  <ImagePreview src={item.image} alt={item.name} className="item-image" />
                  <div><span>{item.type}</span><h3>{item.name}</h3><p>{item.color}</p><small>{item.description}</small></div>
                </article>
              ))}
              <button className="item-card add-card" onClick={() => setShowItemModal(true)}><span>+</span><strong>Добави дреха</strong><small>Снимай или качи снимка</small></button>
            </div>
          </section>
          </Show>
        )}
      </div>

      <section className="join-banner">
        <div><p className="eyebrow">MAKE IT YOURS</p><h2>Твоят стил заслужава място.</h2></div>
        <Show when="signed-out"><SignUpButton mode="modal"><button className="primary-button">Започни безплатно <span>↗</span></button></SignUpButton></Show>
        <Show when="signed-in"><button className="primary-button" onClick={() => setShowPostModal(true)}>Сподели аутфит <span>↗</span></button></Show>
      </section>

      {showItemModal && (
        <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setShowItemModal(false)}>
          <form className="modal" onSubmit={addItem}>
            <button type="button" className="modal-close" onClick={() => setShowItemModal(false)}>×</button>
            <p className="eyebrow">MY WARDROBE</p><h2>Добави дреха</h2><p className="modal-copy">Създай дигитален гардероб, който е наистина твой.</p>
            <label>Снимка<input type="file" accept="image/*" onChange={handleImage} /></label>
            {newItemImage && <ImagePreview src={newItemImage} alt="Преглед" className="upload-preview" />}
            <Field.Root label="Име" replace={false}>
              <YamadaInput name="name" placeholder="Напр. Винтидж риза" required />
            </Field.Root>
            <div className="form-row">
              <Field.Root label="Тип" replace={false}>
                <select name="type" defaultValue="Тениска"><option>Тениска</option><option>Риза</option><option>Връхна дреха</option><option>Дънки</option><option>Обувки</option><option>Аксесоар</option></select>
              </Field.Root>
              <Field.Root label="Цвят" replace={false}>
                <YamadaInput name="color" placeholder="Черно" />
              </Field.Root>
            </div>
            <Field.Root label="Описание" helperMessage="Материя, кройка, повод..." replace={false}>
              <YamadaTextarea name="description" placeholder="Опиши дрехата си..." rows={3} />
            </Field.Root>
            <YamadaButton className="primary-button full" type="submit">Запази в гардероба</YamadaButton>
          </form>
        </div>
      )}

      {showPostModal && (
        <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setShowPostModal(false)}>
          <form className="modal" onSubmit={addPost}>
            <button type="button" className="modal-close" onClick={() => setShowPostModal(false)}>×</button>
            <p className="eyebrow">SHARE YOUR FIT</p><h2>Сподели аутфит</h2><p className="modal-copy">Покажи на общността какво носиш днес.</p>
            <label>Заглавие<input name="title" placeholder="Напр. Sunday layers" required /></label>
            <label>URL на снимка<input name="image" type="url" placeholder="https://..." /></label>
            <button className="primary-button full" type="submit">Публикувай аутфита</button>
          </form>
        </div>
      )}
    </main>
  );
}
