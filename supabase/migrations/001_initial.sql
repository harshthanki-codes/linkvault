create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  handle       text unique not null,
  display_name text,
  bio          text,
  created_at   timestamptz default now()
);

create table public.bookmarks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null,
  url         text not null,
  description text,
  is_public   boolean not null default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create index bookmarks_user_id_idx on public.bookmarks(user_id);
create index bookmarks_public_idx  on public.bookmarks(user_id, is_public) where is_public = true;

alter table public.profiles  enable row level security;
alter table public.bookmarks enable row level security;

create policy "anyone can read profiles"
  on public.profiles for select using (true);

create policy "users update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "owners have full access to bookmarks"
  on public.bookmarks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "public bookmarks are readable by anyone"
  on public.bookmarks for select
  using (is_public = true);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  base_handle text;
  final_handle text;
  counter int := 0;
begin
  base_handle := regexp_replace(split_part(new.email, '@', 1), '[^a-zA-Z0-9_]', '', 'g');
  if length(base_handle) < 3 then
    base_handle := 'user' || base_handle;
  end if;
  base_handle := substring(base_handle from 1 for 20);
  final_handle := base_handle;

  while exists (select 1 from public.profiles where handle = final_handle) loop
    counter := counter + 1;
    final_handle := base_handle || counter::text;
  end loop;

  insert into public.profiles (id, handle)
  values (new.id, final_handle);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger bookmarks_updated_at
  before update on public.bookmarks
  for each row execute procedure public.set_updated_at();
