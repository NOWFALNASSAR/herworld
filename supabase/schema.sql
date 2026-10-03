-- HER WORLD database. Paste into Supabase -> SQL Editor -> Run.
-- IMPORTANT: replace her@email.com (4 places) with the admin's real email first.

create table if not exists content (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('campaign','photo','reel','video','vlog','pov','bts','acting')),
  title text not null,
  slug text unique not null,
  brand text,
  brand_logo text,
  tags text[] not null default '{}',
  description text,
  role text,
  deliverables text,
  concept text,
  created_what text,
  results text,
  media jsonb not null default '[]',
  instagram_url text,
  trending boolean not null default false,
  status text not null default 'published' check (status in ('published','hidden')),
  published_at date not null default current_date,
  created_at timestamptz not null default now()
);

create table if not exists settings (
  id int primary key default 1 check (id = 1),
  data jsonb not null default '{}'
);
insert into settings (id, data) values (1, '{}') on conflict (id) do nothing;

alter table content enable row level security;
alter table settings enable row level security;

drop policy if exists "public reads published" on content;
create policy "public reads published" on content
  for select using (status = 'published' or auth.jwt()->>'email' = 'her@email.com');

drop policy if exists "public reads settings" on settings;
create policy "public reads settings" on settings for select using (true);

drop policy if exists "admin writes content" on content;
create policy "admin writes content" on content for all
  using (auth.jwt()->>'email' = 'her@email.com')
  with check (auth.jwt()->>'email' = 'her@email.com');

drop policy if exists "admin writes settings" on settings;
create policy "admin writes settings" on settings for all
  using (auth.jwt()->>'email' = 'her@email.com')
  with check (auth.jwt()->>'email' = 'her@email.com');
