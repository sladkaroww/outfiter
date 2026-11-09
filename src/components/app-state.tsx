"use client";

import { createContext, useContext, useMemo, useState } from "react";

export type ClothingItem = {
  id: number;
  name: string;
  type: string;
  color: string;
  description: string;
  image: string;
};

export type OutfitPost = {
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
  { id: 1, name: "Oversized blazer", type: "Връхна дреха", color: "Черно", description: "Структуриран блейзър за ежедневни и официални визии.", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=85" },
  { id: 2, name: "Classic white tee", type: "Тениска", color: "Бяло", description: "Базова памучна тениска със свободна кройка.", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85" },
  { id: 3, name: "Straight denim", type: "Дънки", color: "Синьо", description: "Прав модел дънки с висока талия.", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=700&q=85" },
];

const starterPosts: OutfitPost[] = [
  { id: 1, author: "Mia Petrova", handle: "@miapetrova", avatar: "MP", title: "Coffee run uniform", location: "Sofia, Bulgaria", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85", liked: false, likes: 128, items: ["Blazer", "White tee", "Denim"] },
  { id: 2, author: "Alex Ivanov", handle: "@alexwears", avatar: "AI", title: "Soft tailoring", location: "Plovdiv, Bulgaria", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85", liked: false, likes: 86, items: ["Linen shirt", "Wide trousers"] },
];

type AppState = {
  items: ClothingItem[];
  posts: OutfitPost[];
  addItem: (item: Omit<ClothingItem, "id">) => void;
  addPost: (post: Omit<OutfitPost, "id" | "liked" | "likes">) => void;
  toggleLike: (id: number) => void;
};

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState(starterItems);
  const [posts, setPosts] = useState(starterPosts);
  const value = useMemo<AppState>(() => ({
    items,
    posts,
    addItem: (item) => setItems((current) => [{ ...item, id: Date.now() }, ...current]),
    addPost: (post) => setPosts((current) => [{ ...post, id: Date.now(), liked: false, likes: 0 }, ...current]),
    toggleLike: (id) => setPosts((current) => current.map((post) => post.id === id ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 } : post)),
  }), [items, posts]);
  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const state = useContext(AppStateContext);
  if (!state) throw new Error("useAppState must be used inside AppStateProvider");
  return state;
}
