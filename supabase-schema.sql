-- CampusMarket KG — Supabase Schema & Storage Setup
-- Run this in your Supabase Dashboard -> SQL Editor

-- 1. Profiles Table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  nickname text not null,
  university text not null,
  major text not null,
  manner_temp numeric(4,1) not null default 98.5,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 2. Products Table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  title text not null,
  price integer not null check (price >= 0),
  retail_price integer,
  category text not null,
  university text not null default 'KNU',
  safe_zone text not null,
  description text not null,
  image_url text not null,
  seller_name text not null,
  seller_major text not null,
  likes integer not null default 0,
  views integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

create policy "Products are viewable by everyone"
  on public.products for select
  using (true);

create policy "Authenticated users can insert products"
  on public.products for insert
  to authenticated
  with check (auth.uid() = user_id or user_id is null);

create policy "Anyone can update likes and views on products"
  on public.products for update
  using (true);

create policy "Owners can delete their own products"
  on public.products for delete
  to authenticated
  using (auth.uid() = user_id);

-- 3. Meetup Requests Table
create table if not exists public.meetup_requests (
  id uuid primary key default gen_random_uuid(),
  product_id text not null,
  product_title text not null,
  product_price integer not null default 0,
  buyer_id uuid references auth.users(id) on delete set null,
  buyer_name text not null,
  seller_name text not null,
  safe_zone text not null,
  proposed_time text not null,
  note text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

alter table public.meetup_requests enable row level security;

create policy "Meetup requests viewable by everyone or involved users"
  on public.meetup_requests for select
  using (true);

create policy "Authenticated or campus users can insert meetup requests"
  on public.meetup_requests for insert
  with check (true);

-- 4. Storage Bucket: product-images
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Public read access for product-images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Authenticated users can upload product-images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');
