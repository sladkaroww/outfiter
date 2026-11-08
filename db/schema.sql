create table if not exists wardrobe_items (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null,
  name text not null,
  type text not null,
  color text not null default '',
  image_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists outfit_posts (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null,
  title text not null,
  image_url text not null,
  location text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists outfit_post_items (
  post_id uuid not null references outfit_posts(id) on delete cascade,
  item_id uuid not null references wardrobe_items(id) on delete cascade,
  primary key (post_id, item_id)
);

create table if not exists outfit_likes (
  post_id uuid not null references outfit_posts(id) on delete cascade,
  clerk_user_id text not null,
  created_at timestamptz not null default now(),
  primary key (post_id, clerk_user_id)
);

create index if not exists wardrobe_items_user_idx on wardrobe_items (clerk_user_id, created_at desc);
create index if not exists outfit_posts_created_idx on outfit_posts (created_at desc);
