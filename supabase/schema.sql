-- Glowly multi-tenant schema
-- Run this in the Supabase SQL editor (or via `supabase db push`)

-- ============ SALONS (tenants) ============
create table if not exists salons (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  city text,
  plan text not null default 'basic' check (plan in ('basic', 'premium')),
  trial_ends_at timestamptz default (now() + interval '14 days'),
  created_at timestamptz default now()
);

-- ============ SALON MEMBERS (maps auth.users -> salon, like agencies in Prophecy AI) ============
create table if not exists salon_members (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid references salons(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text not null default 'owner' check (role in ('owner', 'staff')),
  created_at timestamptz default now(),
  unique (salon_id, user_id)
);

-- ============ WHATSAPP CREDENTIALS (per salon, Wati.io) ============
create table if not exists whatsapp_credentials (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid references salons(id) on delete cascade not null unique,
  provider text not null default 'wati' check (provider in ('wati', 'meta_cloud')),
  wati_api_endpoint text,
  wati_access_token text,
  whatsapp_number text,
  connected boolean default false,
  created_at timestamptz default now()
);

-- ============ SERVICES ============
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid references salons(id) on delete cascade not null,
  name text not null,
  duration_minutes int not null default 30,
  price_pkr numeric not null default 0,
  created_at timestamptz default now()
);

-- ============ STAFF ============
create table if not exists staff (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid references salons(id) on delete cascade not null,
  name text not null,
  specialty text,
  created_at timestamptz default now()
);

-- ============ CLIENTS (CRM) ============
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid references salons(id) on delete cascade not null,
  name text,
  phone text not null,
  birthday date,
  notes text,
  lifetime_value_pkr numeric default 0,
  created_at timestamptz default now(),
  unique (salon_id, phone)
);

-- ============ BOOKINGS ============
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid references salons(id) on delete cascade not null,
  client_id uuid references clients(id) on delete set null,
  service_id uuid references services(id) on delete set null,
  staff_id uuid references staff(id) on delete set null,
  starts_at timestamptz not null,
  status text not null default 'confirmed' check (status in ('confirmed', 'completed', 'cancelled', 'no_show')),
  created_at timestamptz default now()
);

-- ============ CONVERSATIONS (WhatsApp threads) ============
create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid references salons(id) on delete cascade not null,
  client_id uuid references clients(id) on delete set null,
  wa_phone text not null,
  last_message_at timestamptz default now(),
  ai_handling boolean default true,
  created_at timestamptz default now()
);

-- ============ MESSAGES ============
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade not null,
  sender text not null check (sender in ('client', 'ai', 'staff')),
  content text not null,
  created_at timestamptz default now()
);

-- ================= ROW LEVEL SECURITY =================
alter table salons enable row level security;
alter table salon_members enable row level security;
alter table whatsapp_credentials enable row level security;
alter table services enable row level security;
alter table staff enable row level security;
alter table clients enable row level security;
alter table bookings enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;

-- Helper: is the current user a member of this salon?
create or replace function is_salon_member(target_salon_id uuid)
returns boolean as $$
  select exists (
    select 1 from salon_members
    where salon_id = target_salon_id and user_id = auth.uid()
  );
$$ language sql security definer stable;

-- salons: members can see their own salon
create policy "members read own salon" on salons
  for select using (is_salon_member(id));

create policy "members update own salon" on salons
  for update using (is_salon_member(id));

-- salon_members: users can see their own membership rows
create policy "read own memberships" on salon_members
  for select using (user_id = auth.uid());

-- Generic tenant-scoped policies (repeat pattern per table)
create policy "tenant read whatsapp_credentials" on whatsapp_credentials
  for select using (is_salon_member(salon_id));
create policy "tenant write whatsapp_credentials" on whatsapp_credentials
  for all using (is_salon_member(salon_id));

create policy "tenant read services" on services
  for select using (is_salon_member(salon_id));
create policy "tenant write services" on services
  for all using (is_salon_member(salon_id));

create policy "tenant read staff" on staff
  for select using (is_salon_member(salon_id));
create policy "tenant write staff" on staff
  for all using (is_salon_member(salon_id));

create policy "tenant read clients" on clients
  for select using (is_salon_member(salon_id));
create policy "tenant write clients" on clients
  for all using (is_salon_member(salon_id));

create policy "tenant read bookings" on bookings
  for select using (is_salon_member(salon_id));
create policy "tenant write bookings" on bookings
  for all using (is_salon_member(salon_id));

create policy "tenant read conversations" on conversations
  for select using (is_salon_member(salon_id));
create policy "tenant write conversations" on conversations
  for all using (is_salon_member(salon_id));

-- messages: scoped via parent conversation's salon
create policy "tenant read messages" on messages
  for select using (
    exists (
      select 1 from conversations c
      where c.id = messages.conversation_id
      and is_salon_member(c.salon_id)
    )
  );
create policy "tenant write messages" on messages
  for all using (
    exists (
      select 1 from conversations c
      where c.id = messages.conversation_id
      and is_salon_member(c.salon_id)
    )
  );
