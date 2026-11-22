create table if not exists public.administradores (
  email text primary key,
  criado_em timestamptz not null default now()
);

create table if not exists public.relatos (
  id uuid primary key default gen_random_uuid(),
  criado_em timestamptz not null default now(),
  titulo text not null check (char_length(titulo) between 5 and 120),
  conteudo text not null check (char_length(conteudo) between 20 and 5000),
  uf char(2) not null,
  cidade text check (cidade is null or char_length(cidade) <= 80),
  tipo_violencia text check (tipo_violencia is null or tipo_violencia in ('Fisica', 'Psicologica', 'Sexual', 'Patrimonial', 'Moral', 'Outros')),
  consentimento boolean not null default false,
  status text not null default 'pendente' check (status in ('pendente', 'publicado', 'arquivado'))
);

create index if not exists relatos_status_criado_em on public.relatos (status, criado_em desc);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.administradores a
    where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

alter table public.administradores enable row level security;
alter table public.relatos enable row level security;

drop policy if exists "relatos_publicos" on public.relatos;
drop policy if exists "relatos_criar" on public.relatos;
drop policy if exists "relatos_admin" on public.relatos;

create policy "relatos_publicos" on public.relatos
  for select to anon, authenticated
  using (status = 'publicado');

create policy "relatos_criar" on public.relatos
  for insert to anon, authenticated
  with check (status = 'pendente' and consentimento = true);

create policy "relatos_admin" on public.relatos
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

revoke all on public.administradores from anon, authenticated;

grant usage on schema public to anon, authenticated;
grant select, insert on public.relatos to anon;
grant select, insert, update, delete on public.relatos to authenticated;
grant execute on function public.is_admin() to anon, authenticated;
