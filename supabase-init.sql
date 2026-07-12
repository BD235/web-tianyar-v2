-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create categories table
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create destinations table
create table public.destinations (
  id uuid default uuid_generate_v4() primary key,
  category_id uuid references public.categories(id) on delete set null,
  title text not null,
  description text not null,
  price numeric default 0,
  operational_hours text not null default '08:00 - 18:00',
  latitude numeric not null,
  longitude numeric not null,
  images text[] default array[]::text[],
  facilities jsonb default '[]'::jsonb,
  tips_and_rules text,
  is_popular boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);


-- Setup Row Level Security (RLS)
alter table public.categories enable row level security;
alter table public.destinations enable row level security;

-- Create policies for public access (READ ONLY)
create policy "Allow public read access for categories" on public.categories for select using (true);
create policy "Allow public read access for destinations" on public.destinations for select using (true);

-- Create policies for admin (ALL ACCESS) - Secure check checking email matching admin email
create policy "Allow admin full access for categories" on public.categories for all using (auth.jwt() ->> 'email' = 'admin@tianyar.com');
create policy "Allow admin full access for destinations" on public.destinations for all using (auth.jwt() ->> 'email' = 'admin@tianyar.com');

-- Create Storage Bucket for images
insert into storage.buckets (id, name, public) values ('wisata-images', 'wisata-images', true);

create policy "Public Access to Images" on storage.objects for select using (bucket_id = 'wisata-images');
create policy "Admin Upload Access" on storage.objects for insert with check (bucket_id = 'wisata-images' and auth.jwt() ->> 'email' = 'admin@tianyar.com');
create policy "Admin Update Access" on storage.objects for update using (bucket_id = 'wisata-images' and auth.jwt() ->> 'email' = 'admin@tianyar.com');
create policy "Admin Delete Access" on storage.objects for delete using (bucket_id = 'wisata-images' and auth.jwt() ->> 'email' = 'admin@tianyar.com');
