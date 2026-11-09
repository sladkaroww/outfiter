"use client";

import { useState } from "react";
import { useAppState } from "./app-state";
import { ItemUploadModal } from "./item-upload-modal";
import { PostUploadModal } from "./post-upload-modal";

const categories = ["Всички", "Ежедневни", "Работа", "Вечер", "Спорт"];

export function FeedView() {
  const { posts, toggleLike } = useAppState();
  const [category, setCategory] = useState("Всички");
  const [showPost, setShowPost] = useState(false);
  const [showItem, setShowItem] = useState(false);
  const visible = category === "Всички" ? posts : posts.filter((post) => post.title.toLowerCase().includes(category.slice(0, -1).toLowerCase()));
  return <><div className="feed-toolbar"><div><p className="eyebrow">COMMUNITY FEED</p><h1>Какво носят хората</h1></div><div className="quick-actions"><button className="primary-button small" onClick={() => setShowPost(true)}>+ Качи фит</button><button className="secondary-button small" onClick={() => setShowItem(true)}>Гардероб</button></div></div><div className="category-row">{categories.map((item) => <button key={item} className={category === item ? "category selected" : "category"} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="feed-grid">{visible.map((post) => <article className="post-card" key={post.id}><div className="post-image-wrap"><img src={post.image} alt={post.title} className="post-image" /><button className={post.liked ? "like-button liked" : "like-button"} onClick={() => toggleLike(post.id)} aria-label="Харесай аутфита">{post.liked ? "♥" : "♡"}</button></div><div className="post-meta"><div className="author"><span className="avatar">{post.avatar}</span><div><strong>{post.author}</strong><small>{post.handle}</small></div></div><span className="likes">♥ {post.likes}</span></div><h3>{post.title}</h3><p className="location">{post.location}</p><div className="item-tags">{post.items.map((item) => <span key={item}>{item}</span>)}</div></article>)}</div>{showPost && <PostUploadModal onClose={() => setShowPost(false)} />}{showItem && <ItemUploadModal onClose={() => setShowItem(false)} />}</>;
}
