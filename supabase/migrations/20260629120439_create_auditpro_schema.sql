/*
# AuditPro — Full Schema & RLS

Creates the complete schema for the Beyan Omer audit practice platform:
profiles, clients, engagements, milestones, documents, PBC requests,
messages, invoices, invoice items, time entries, notifications, audit log,
blog posts, and contact submissions.

## 1. New Tables
- `profiles` — extends auth.users with role (auditor/client/admin), status, name, contact info.
- `clients` — companies served by the firm; linked to a profile (for client logins).
- `engagements` — audit projects (statutory, internal, tax, forensic, etc.) tied to a client.
- `milestones` — per-engagement milestone tracking.
- `documents` — files uploaded for engagements (bank statements, working papers, etc.).
- `pbc_requests` — "prepared by client" checklist items per engagement.
- `messages` — secure thread messages between auditor and client.
- `invoices` — billing records per engagement/client.
- `invoice_items` — line items on an invoice.
- `time_entries` — billable/non-billable hours logged per engagement.
- `notifications` — per-user in-app notifications.
- `audit_log` — append-only audit trail of sensitive actions.
- `blog_posts` — public insights articles.
- `contact_submissions` — public contact form submissions.

## 2. Enums
- `user_role`: auditor | client | admin
- `user_status`: active | inactive | pending
- `client_status`: active | inactive | prospect | archived
- `industry_type`: manufacturing | retail | financial_services | healthcare | technology | real_estate | hospitality | ngo | government | other
- `engagement_type`: statutory_audit | internal_audit | tax_audit | forensic_audit | compliance_review | agreed_upon_procedures | compilation | review
- `engagement_status`: planning | fieldwork | review | reporting | completed | on_hold | cancelled
- `document_type`: financial_statement | bank_statement | invoice | contract | audit_report | management_letter | tax_return | pbc_document | working_paper | correspondence | other
- `document_status`: pending | uploaded | reviewed | approved | rejected
- `invoice_status`: draft | sent | paid | overdue | cancelled
- `notification_type`: document_uploaded | message_received | invoice_sent | invoice_paid | deadline_approaching | engagement_status_changed | pbc_completed | new_client
- `post_status`: draft | published | archived

## 3. Security (RLS)
- RLS enabled on every table.
- `profiles`: users read/update own; auditors/admins read all.
- `clients`: auditors/admins full CRUD; clients read own (via profile_id).
- `engagements`: auditors/admins full CRUD; clients read own (via client.profile_id).
- `milestones`: auditors/admins full CRUD; clients read via parent engagement.
- `documents`: auditors/admins full CRUD; clients read own + insert own.
- `pbc_requests`: auditors/admins full CRUD; clients read via parent engagement.
- `messages`: auditors/admins full CRUD; clients read/insert own (via client.profile_id).
- `invoices` / `invoice_items`: auditors/admins full CRUD; clients read own.
- `time_entries`: auditors/admins full CRUD.
- `notifications`: users read/update own.
- `audit_log`: auditors/admins insert + read.
- `blog_posts`: published readable by anon+authenticated; auditors/admins full CRUD.
- `contact_submissions`: anyone can insert; auditors/admins read.

## 4. Functions & Triggers
- `handle_new_user()` — auto-creates a profile row on auth.users insert.
- `handle_updated_at()` — sets updated_at on row update (per table trigger).
- `generate_invoice_number()` — auto-generates INV-YYYY-NNNN on insert when null.
- `update_engagement_hours()` — recomputes billable_hours on time_entries change.

## 5. Notes
- All statements are idempotent (IF NOT EXISTS / DROP POLICY IF EXISTS).
- Owner columns default to auth.uid() where applicable.
- Policies are dropped before recreate to stay re-runnable.
*/

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- =============================================
-- ENUMS
-- =============================================
do $$ begin
  create type user_role as enum ('auditor', 'client', 'admin');
exception when duplicate_object then null; end $$;
do $$ begin
  create type user_status as enum ('active', 'inactive', 'pending');
exception when duplicate_object then null; end $$;
do $$ begin
  create type client_status as enum ('active', 'inactive', 'prospect', 'archived');
exception when duplicate_object then null; end $$;
do $$ begin
  create type industry_type as enum (
    'manufacturing', 'retail', 'financial_services', 'healthcare',
    'technology', 'real_estate', 'hospitality', 'ngo', 'government', 'other'
  );
exception when duplicate_object then null; end $$;
do $$ begin
  create type engagement_type as enum (
    'statutory_audit', 'internal_audit', 'tax_audit', 'forensic_audit',
    'compliance_review', 'agreed_upon_procedures', 'compilation', 'review'
  );
exception when duplicate_object then null; end $$;
do $$ begin
  create type engagement_status as enum (
    'planning', 'fieldwork', 'review', 'reporting', 'completed', 'on_hold', 'cancelled'
  );
exception when duplicate_object then null; end $$;
do $$ begin
  create type document_type as enum (
    'financial_statement', 'bank_statement', 'invoice', 'contract',
    'audit_report', 'management_letter', 'tax_return', 'pbc_document',
    'working_paper', 'correspondence', 'other'
  );
exception when duplicate_object then null; end $$;
do $$ begin
  create type document_status as enum ('pending', 'uploaded', 'reviewed', 'approved', 'rejected');
exception when duplicate_object then null; end $$;
do $$ begin
  create type invoice_status as enum ('draft', 'sent', 'paid', 'overdue', 'cancelled');
exception when duplicate_object then null; end $$;
do $$ begin
  create type notification_type as enum (
    'document_uploaded', 'message_received', 'invoice_sent', 'invoice_paid',
    'deadline_approaching', 'engagement_status_changed', 'pbc_completed', 'new_client'
  );
exception when duplicate_object then null; end $$;
do $$ begin
  create type post_status as enum ('draft', 'published', 'archived');
exception when duplicate_object then null; end $$;

-- =============================================
-- TABLES
-- =============================================
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  role user_role not null default 'client',
  status user_status not null default 'active',
  full_name text not null,
  email text not null,
  phone text,
  avatar_url text,
  company_name text,
  job_title text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.clients (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.profiles(id) on delete set null,
  company_name text not null,
  trade_name text,
  tin_number text unique,
  registration_number text,
  industry industry_type default 'other',
  status client_status default 'active',
  fiscal_year_end date,
  address text,
  city text,
  country text default 'Ethiopia',
  website text,
  primary_contact_name text,
  primary_contact_email text,
  primary_contact_phone text,
  notes text,
  tags text[],
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.engagements (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references public.clients(id) on delete cascade not null,
  title text not null,
  type engagement_type not null,
  status engagement_status default 'planning',
  period_start date,
  period_end date,
  planned_start date,
  planned_end date,
  actual_start date,
  actual_end date,
  fee_amount decimal(12,2),
  fee_currency text default 'ETB',
  billable_hours decimal(8,2) default 0,
  budgeted_hours decimal(8,2),
  progress int default 0,
  description text,
  scope text,
  assigned_to uuid references public.profiles(id),
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.milestones (
  id uuid default uuid_generate_v4() primary key,
  engagement_id uuid references public.engagements(id) on delete cascade,
  title text not null,
  description text,
  due_date date,
  completed_at timestamptz,
  is_completed boolean default false,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists public.documents (
  id uuid default uuid_generate_v4() primary key,
  engagement_id uuid references public.engagements(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  uploaded_by uuid references public.profiles(id),
  name text not null,
  description text,
  file_path text not null default '',
  file_size bigint,
  file_type text,
  document_type document_type default 'other',
  status document_status default 'uploaded',
  version int default 1,
  is_confidential boolean default false,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.pbc_requests (
  id uuid default uuid_generate_v4() primary key,
  engagement_id uuid references public.engagements(id) on delete cascade,
  title text not null,
  description text,
  due_date date,
  is_completed boolean default false,
  completed_at timestamptz,
  document_id uuid references public.documents(id),
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.messages (
  id uuid default uuid_generate_v4() primary key,
  engagement_id uuid references public.engagements(id) on delete cascade,
  client_id uuid references public.clients(id),
  sender_id uuid references public.profiles(id) not null,
  sender_name text,
  sender_role text,
  content text not null,
  is_read boolean default false,
  read_at timestamptz,
  parent_id uuid references public.messages(id),
  created_at timestamptz default now()
);

create table if not exists public.invoices (
  id uuid default uuid_generate_v4() primary key,
  engagement_id uuid references public.engagements(id),
  client_id uuid references public.clients(id) on delete cascade not null,
  invoice_number text unique not null,
  status invoice_status default 'draft',
  amount decimal(12,2) not null,
  tax_amount decimal(12,2) default 0,
  total_amount decimal(12,2) not null,
  currency text default 'ETB',
  issue_date date default current_date,
  due_date date,
  paid_date date,
  payment_method text,
  notes text,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.invoice_items (
  id uuid default uuid_generate_v4() primary key,
  invoice_id uuid references public.invoices(id) on delete cascade,
  description text not null,
  quantity decimal(8,2) default 1,
  unit_price decimal(12,2) not null,
  amount decimal(12,2) not null,
  sort_order int default 0
);

create table if not exists public.time_entries (
  id uuid default uuid_generate_v4() primary key,
  engagement_id uuid references public.engagements(id) on delete cascade,
  logged_by uuid references public.profiles(id),
  description text,
  hours decimal(5,2) not null,
  date date default current_date,
  is_billable boolean default true,
  hourly_rate decimal(10,2),
  created_at timestamptz default now()
);

create table if not exists public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  type notification_type,
  title text not null,
  message text,
  link text,
  is_read boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.audit_log (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id),
  action text not null,
  table_name text,
  record_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  created_at timestamptz default now()
);

create table if not exists public.blog_posts (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  cover_image text,
  status post_status default 'draft',
  tags text[],
  author_id uuid references public.profiles(id),
  author_name text,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.contact_submissions (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  phone text,
  company text,
  service_interest text,
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- =============================================
-- INDEXES
-- =============================================
create index if not exists idx_clients_status on public.clients(status);
create index if not exists idx_engagements_client on public.engagements(client_id);
create index if not exists idx_engagements_status on public.engagements(status);
create index if not exists idx_documents_engagement on public.documents(engagement_id);
create index if not exists idx_documents_client on public.documents(client_id);
create index if not exists idx_messages_engagement on public.messages(engagement_id);
create index if not exists idx_invoices_client on public.invoices(client_id);
create index if not exists idx_invoices_status on public.invoices(status);
create index if not exists idx_notifications_user on public.notifications(user_id, is_read);
create index if not exists idx_time_entries_engagement on public.time_entries(engagement_id);
create index if not exists idx_pbc_engagement on public.pbc_requests(engagement_id);
create index if not exists idx_milestones_engagement on public.milestones(engagement_id);
create index if not exists idx_invoice_items_invoice on public.invoice_items(invoice_id);

-- =============================================
-- RLS
-- =============================================
alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.engagements enable row level security;
alter table public.milestones enable row level security;
alter table public.documents enable row level security;
alter table public.pbc_requests enable row level security;
alter table public.messages enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_items enable row level security;
alter table public.time_entries enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_log enable row level security;
alter table public.blog_posts enable row level security;
alter table public.contact_submissions enable row level security;

-- Helper: is auditor/admin
-- (inlined in policies for clarity)

-- profiles
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles for select to authenticated using (auth.uid() = id);
drop policy if exists "Auditors can view all profiles" on public.profiles;
create policy "Auditors can view all profiles" on public.profiles for select to authenticated using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('auditor','admin'))
);
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles for insert to authenticated with check (auth.uid() = id);

-- clients
drop policy if exists "Auditors manage clients" on public.clients;
create policy "Auditors manage clients" on public.clients for all to authenticated using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('auditor','admin'))
) with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('auditor','admin'))
);
drop policy if exists "Clients view own record" on public.clients;
create policy "Clients view own record" on public.clients for select to authenticated using (profile_id = auth.uid());

-- engagements
drop policy if exists "Auditors manage engagements" on public.engagements;
create policy "Auditors manage engagements" on public.engagements for all to authenticated using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('auditor','admin'))
) with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('auditor','admin'))
);
drop policy if exists "Clients view own engagements" on public.engagements;
create policy "Clients view own engagements" on public.engagements for select to authenticated using (
  client_id in (select id from public.clients where profile_id = auth.uid())
);

-- milestones
drop policy if exists "Auditors manage milestones" on public.milestones;
create policy "Auditors manage milestones" on public.milestones for all to authenticated using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('auditor','admin'))
) with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('auditor','admin'))
);
drop policy if exists "Clients view milestones" on public.milestones;
create policy "Clients view milestones" on public.milestones for select to authenticated using (
  engagement_id in (
    select e.id from public.engagements e
    join public.clients c on c.id = e.client_id
    where c.profile_id = auth.uid()
  )
);

-- documents
drop policy if exists "Auditors manage documents" on public.documents;
create policy "Auditors manage documents" on public.documents for all to authenticated using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('auditor','admin'))
) with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('auditor','admin'))
);
drop policy if exists "Clients access own documents" on public.documents;
create policy "Clients access own documents" on public.documents for select to authenticated using (
  client_id in (select id from public.clients where profile_id = auth.uid())
);
drop policy if exists "Clients upload documents" on public.documents;
create policy "Clients upload documents" on public.documents for insert to authenticated with check (
  client_id in (select id from public.clients where profile_id = auth.uid())
);

-- pbc_requests
drop policy if exists "Auditors manage pbc" on public.pbc_requests;
create policy "Auditors manage pbc" on public.pbc_requests for all to authenticated using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('auditor','admin'))
) with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('auditor','admin'))
);
drop policy if exists "Clients view pbc" on public.pbc_requests;
create policy "Clients view pbc" on public.pbc_requests for select to authenticated using (
  engagement_id in (
    select e.id from public.engagements e
    join public.clients c on c.id = e.client_id
    where c.profile_id = auth.uid()
  )
);

-- messages
drop policy if exists "Auditors manage messages" on public.messages;
create policy "Auditors manage messages" on public.messages for all to authenticated using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('auditor','admin'))
) with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('auditor','admin'))
);
drop policy if exists "Clients view own messages" on public.messages;
create policy "Clients view own messages" on public.messages for select to authenticated using (
  client_id in (select id from public.clients where profile_id = auth.uid())
);
drop policy if exists "Clients send messages" on public.messages;
create policy "Clients send messages" on public.messages for insert to authenticated with check (
  sender_id = auth.uid() and
  client_id in (select id from public.clients where profile_id = auth.uid())
);

-- invoices
drop policy if exists "Auditors manage invoices" on public.invoices;
create policy "Auditors manage invoices" on public.invoices for all to authenticated using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('auditor','admin'))
) with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('auditor','admin'))
);
drop policy if exists "Clients view own invoices" on public.invoices;
create policy "Clients view own invoices" on public.invoices for select to authenticated using (
  client_id in (select id from public.clients where profile_id = auth.uid())
);

-- invoice_items
drop policy if exists "Auditors manage invoice items" on public.invoice_items;
create policy "Auditors manage invoice items" on public.invoice_items for all to authenticated using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('auditor','admin'))
) with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('auditor','admin'))
);
drop policy if exists "Clients view own invoice items" on public.invoice_items;
create policy "Clients view own invoice items" on public.invoice_items for select to authenticated using (
  invoice_id in (
    select i.id from public.invoices i
    join public.clients c on c.id = i.client_id
    where c.profile_id = auth.uid()
  )
);

-- time_entries
drop policy if exists "Auditors manage time entries" on public.time_entries;
create policy "Auditors manage time entries" on public.time_entries for all to authenticated using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('auditor','admin'))
) with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('auditor','admin'))
);

-- notifications
drop policy if exists "Users see own notifications" on public.notifications;
create policy "Users see own notifications" on public.notifications for select to authenticated using (user_id = auth.uid());
drop policy if exists "Users update own notifications" on public.notifications;
create policy "Users update own notifications" on public.notifications for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "Users insert own notifications" on public.notifications;
create policy "Users insert own notifications" on public.notifications for insert to authenticated with check (user_id = auth.uid());

-- audit_log
drop policy if exists "Auditors read audit log" on public.audit_log;
create policy "Auditors read audit log" on public.audit_log for select to authenticated using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('auditor','admin'))
);
drop policy if exists "Auditors insert audit log" on public.audit_log;
create policy "Auditors insert audit log" on public.audit_log for insert to authenticated with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('auditor','admin'))
);

-- blog_posts
drop policy if exists "Public can read published posts" on public.blog_posts;
create policy "Public can read published posts" on public.blog_posts for select to anon, authenticated using (status = 'published');
drop policy if exists "Auditors manage blog" on public.blog_posts;
create policy "Auditors manage blog" on public.blog_posts for all to authenticated using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('auditor','admin'))
) with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('auditor','admin'))
);

-- contact_submissions
drop policy if exists "Anyone can submit contact form" on public.contact_submissions;
create policy "Anyone can submit contact form" on public.contact_submissions for insert to anon, authenticated with check (true);
drop policy if exists "Auditors read submissions" on public.contact_submissions;
create policy "Auditors read submissions" on public.contact_submissions for select to authenticated using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('auditor','admin'))
);
drop policy if exists "Auditors update submissions" on public.contact_submissions;
create policy "Auditors update submissions" on public.contact_submissions for update to authenticated using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('auditor','admin'))
) with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('auditor','admin'))
);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'client')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at on public.profiles;
create trigger set_updated_at before update on public.profiles for each row execute procedure public.handle_updated_at();
drop trigger if exists set_updated_at on public.clients;
create trigger set_updated_at before update on public.clients for each row execute procedure public.handle_updated_at();
drop trigger if exists set_updated_at on public.engagements;
create trigger set_updated_at before update on public.engagements for each row execute procedure public.handle_updated_at();
drop trigger if exists set_updated_at on public.documents;
create trigger set_updated_at before update on public.documents for each row execute procedure public.handle_updated_at();
drop trigger if exists set_updated_at on public.invoices;
create trigger set_updated_at before update on public.invoices for each row execute procedure public.handle_updated_at();
drop trigger if exists set_updated_at on public.pbc_requests;
create trigger set_updated_at before update on public.pbc_requests for each row execute procedure public.handle_updated_at();
drop trigger if exists set_updated_at on public.blog_posts;
create trigger set_updated_at before update on public.blog_posts for each row execute procedure public.handle_updated_at();

create or replace function public.generate_invoice_number()
returns trigger language plpgsql as $$
declare
  next_num int;
begin
  select coalesce(max(cast(split_part(invoice_number, '-', 3) as int)), 0) + 1
  into next_num
  from public.invoices
  where invoice_number like 'INV-' || to_char(now(), 'YYYY') || '-%';
  new.invoice_number = 'INV-' || to_char(now(), 'YYYY') || '-' || lpad(next_num::text, 4, '0');
  return new;
end;
$$;

drop trigger if exists before_invoice_insert on public.invoices;
create trigger before_invoice_insert
  before insert on public.invoices
  for each row
  when (new.invoice_number is null or new.invoice_number = '')
  execute procedure public.generate_invoice_number();

create or replace function public.update_engagement_hours()
returns trigger language plpgsql as $$
begin
  update public.engagements
  set billable_hours = (
    select coalesce(sum(hours), 0) from public.time_entries
    where engagement_id = coalesce(new.engagement_id, old.engagement_id) and is_billable = true
  )
  where id = coalesce(new.engagement_id, old.engagement_id);
  return coalesce(new, old);
end;
$$;

drop trigger if exists after_time_entry on public.time_entries;
create trigger after_time_entry
  after insert or update or delete on public.time_entries
  for each row execute procedure public.update_engagement_hours();
