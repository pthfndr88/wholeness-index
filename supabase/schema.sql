-- Wholeness Index — Supabase Schema
-- Run this in Supabase SQL editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── Profiles ────────────────────────────────────────────────────────────────
-- Extends auth.users automatically via trigger
create table public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  email       text,
  full_name   text,
  role        text not null default 'individual' check (role in ('individual','coach','org_admin','super_admin')),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Purchases ───────────────────────────────────────────────────────────────
create table public.purchases (
  id                  uuid default uuid_generate_v4() primary key,
  user_id             uuid references public.profiles(id) on delete set null,
  email               text not null,
  stripe_session_id   text unique,
  stripe_payment_id   text,
  product_type        text not null check (product_type in ('full_assessment','coaching_bundle')),
  amount_paid         integer not null, -- in pence
  discount_code       text,
  status              text not null default 'pending' check (status in ('pending','completed','refunded')),
  created_at          timestamptz default now()
);
alter table public.purchases enable row level security;
create policy "Users can view own purchases" on public.purchases for select using (auth.uid() = user_id);
-- Service role only for insert/update (webhook)

-- ─── Access ──────────────────────────────────────────────────────────────────
create table public.access (
  id            uuid default uuid_generate_v4() primary key,
  user_id       uuid references public.profiles(id) on delete cascade,
  email         text,
  product_type  text not null,
  purchase_id   uuid references public.purchases(id),
  granted_at    timestamptz default now(),
  expires_at    timestamptz
);
alter table public.access enable row level security;
create policy "Users can view own access" on public.access for select using (auth.uid() = user_id);

-- ─── Engagements ─────────────────────────────────────────────────────────────
create table public.engagements (
  id            uuid default uuid_generate_v4() primary key,
  coach_id      uuid references public.profiles(id) on delete cascade not null,
  name          text not null,
  slug          text unique not null,
  instrument    text not null default 'RAPID' check (instrument in ('RAPID','FULL')),
  deadline      timestamptz,
  active        boolean default true,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);
alter table public.engagements enable row level security;
create policy "Coaches can manage own engagements" on public.engagements for all using (auth.uid() = coach_id);
create policy "Anyone can read active engagement by slug" on public.engagements for select using (active = true);

-- ─── Invitations ─────────────────────────────────────────────────────────────
create table public.invitations (
  id              uuid default uuid_generate_v4() primary key,
  engagement_id   uuid references public.engagements(id) on delete cascade not null,
  email           text not null,
  token           text unique default uuid_generate_v4()::text,
  status          text not null default 'pending' check (status in ('pending','opened','completed')),
  sent_at         timestamptz default now(),
  opened_at       timestamptz,
  completed_at    timestamptz
);
alter table public.invitations enable row level security;
create policy "Coaches can view invitations for own engagements" on public.invitations
  for select using (
    exists (select 1 from public.engagements e where e.id = engagement_id and e.coach_id = auth.uid())
  );
create policy "Anyone can view invitation by token" on public.invitations for select using (true);

-- ─── Results ─────────────────────────────────────────────────────────────────
create table public.results (
  id                uuid default uuid_generate_v4() primary key,
  user_id           uuid references public.profiles(id) on delete set null,
  engagement_id     uuid references public.engagements(id) on delete set null,
  invitation_token  text,
  instrument        text not null default 'RAPID',
  archetype         text not null,
  confidence        float not null,
  score_i           float not null,
  score_ch          float not null,
  score_co          float not null,
  score_im          float not null,
  -- Full assessment scores
  formation_score   float,
  alignment_index   float,
  structural_index  float,
  shared_with_coach boolean default false,
  completed_at      timestamptz default now()
);
alter table public.results enable row level security;
create policy "Users can view own results" on public.results for select using (auth.uid() = user_id);
create policy "Anyone can insert result" on public.results for insert with check (true);
create policy "Users can update own results" on public.results for update using (auth.uid() = user_id);
create policy "Coaches can view shared results for their engagements" on public.results
  for select using (
    shared_with_coach = true and
    exists (select 1 from public.engagements e where e.id = engagement_id and e.coach_id = auth.uid())
  );

-- ─── Responses ───────────────────────────────────────────────────────────────
create table public.responses (
  id          uuid default uuid_generate_v4() primary key,
  result_id   uuid references public.results(id) on delete cascade not null,
  item_id     integer not null,
  value       integer not null check (value between 1 and 5),
  created_at  timestamptz default now()
);
alter table public.responses enable row level security;
create policy "Users can view own responses" on public.responses
  for select using (
    exists (select 1 from public.results r where r.id = result_id and r.user_id = auth.uid())
  );
create policy "Anyone can insert response" on public.responses for insert with check (true);
