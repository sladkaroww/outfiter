"use client";

import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";

type ClothingItem = {
  id: number;
  name: string;
  type: string;
  color: string;
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
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 2,
    name: "Classic white tee",
    type: "Тениска",
    color: "Бяло",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 3,
    name: "Straight denim",
    type: "Дънки",
    color: "Синьо",
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

  const visiblePosts = useMemo(() => {
    if (activeCategory === "Всички") return posts;
    return posts.filter((post) => post.title.toLowerCase().includes(activeCategory.slice(0, -1).toLowerCase()));
  }, [activeCategory, posts]);

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

    setItems((current) => [
      {
        id: Date.now(),
        name,
        type,
        color,
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
          <button className={activeTab === "wardrobe" ? "nav-link active" : "nav-link"} onClick={() => setActiveTab("wardrobe")}>
            Гардероб
          </button>
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
            <button className="secondary-button" onClick={() => setShowItemModal(true)}>+ Добави дреха</button>
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
            <button className={activeTab === "wardrobe" ? "selected" : ""} onClick={() => setActiveTab("wardrobe")}>Гардероб</button>
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
          <section className="wardrobe-section">
            <div className="wardrobe-toolbar">
              <p>{items.length} дрехи в твоя гардероб</p>
              <button className="primary-button small" onClick={() => setShowItemModal(true)}>+ Добави дреха</button>
            </div>
            <div className="wardrobe-grid">
              {items.map((item) => (
                <article className="item-card" key={item.id}>
                  <ImagePreview src={item.image} alt={item.name} className="item-image" />
                  <div><span>{item.type}</span><h3>{item.name}</h3><p>{item.color}</p></div>
                </article>
              ))}
              <button className="item-card add-card" onClick={() => setShowItemModal(true)}><span>+</span><strong>Добави дреха</strong><small>Снимай или качи снимка</small></button>
            </div>
          </section>
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
            <label>Име<input name="name" placeholder="Напр. Винтидж риза" required /></label>
            <div className="form-row"><label>Тип<select name="type" defaultValue="Тениска"><option>Тениска</option><option>Риза</option><option>Връхна дреха</option><option>Дънки</option><option>Обувки</option><option>Аксесоар</option></select></label><label>Цвят<input name="color" placeholder="Черно" /></label></div>
            <button className="primary-button full" type="submit">Запази в гардероба</button>
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
