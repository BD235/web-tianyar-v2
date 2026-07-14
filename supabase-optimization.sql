-- 1. Aktifkan ekstensi pg_trgm untuk pencarian substring cepat
create extension if not exists pg_trgm;

-- 2. Buat indeks GIN untuk pencarian title (pencarian wildcard %kata% instan)
create index if not exists destinations_title_trgm_idx 
on public.destinations 
using gin (title gin_trgm_ops);

-- 3. Buat indeks B-Tree pada category_id untuk optimasi query join filter kategori
create index if not exists destinations_category_id_idx 
on public.destinations (category_id);

-- 4. Buat indeks B-Tree pada created_at desc untuk mempercepat order sorting
create index if not exists destinations_created_at_idx 
on public.destinations (created_at desc);

-- 5. Buat Partial Index khusus untuk destinasi populer agar langsung tersortir
create index if not exists destinations_is_popular_idx 
on public.destinations (created_at desc) 
where is_popular = true;
