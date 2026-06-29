-- AuditPro Complete Database Schema
-- Run this in your Supabase SQL editor

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- =============================================
-- USERS / PROFILES (extends Supabase auth.users)
-- =============================================
create type user_role as enum ('auditor', 'client', 'admin');
create type user_status as enum ('active', 'inactive', 'pending');

create table public.profiles (
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

-- =============================================
-- CLIENTS
-- =============================================
create type client_status as enum ('active', 'inactive', 'prospect', 'archived');
create type industry_type as enum (
  'manufacturing', 'retail', 'financial_services', 'healthcare',
  'technology', 'real_estate', 'hospitality', 'ngo', 'government', 'other'
);

create table public.clients (
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

-- =============================================
-- ENGAGEMENTS (Audit Projects)
-- =============================================
create type engagement_type as enum (
  'statutory_audit', 'internal_audit', 'tax_audit', 'forensic_audit',
  'compliance_review', 'agreed_upon_procedures', 'compilation', 'review'
);
create type engagement_status as enum (
  'planning', 'fieldwork', 'review', 'reporting', 'completed', 'on_hold', 'cancelled'
);

create table public.engagements (
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
  description text,
  scope text,
  assigned_to uuid references public.profiles(id),
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================
-- ENGAGEMENT MILESTONES
-- =============================================
create table public.milestones (
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

-- =============================================
-- DOCUMENTS
-- =============================================
create type document_type as enum (
  'financial_statement', 'bank_statement', 'invoice', 'contract',
  'audit_report', 'management_letter', 'tax_return', 'pbc_document',
  'working_paper', 'correspondence', 'other'
);
create type document_status as enum ('pending', 'uploaded', 'reviewed', 'approved', 'rejected');

create table public.documents (
  id uuid default uuid_generate_v4() primary key,
  engagement_id uuid references public.engagements(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  uploaded_by uuid references public.profiles(id),
  name text not null,
  description text,
  file_path text not null,
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

-- =============================================
-- PBC CHECKLISTS (Prepared by Client)
-- =============================================
create table public.pbc_requests (
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

-- =============================================
-- MESSAGES / COMMUNICATIONS
-- =============================================
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  engagement_id uuid references public.engagements(id) on delete cascade,
  client_id uuid references public.clients(id),
  sender_id uuid references public.profiles(id) not null,
  content text not null,
  is_read boolean default false,
  read_at timestamptz,
  parent_id uuid references public.messages(id),
  created_at timestamptz default now()
);

-- =============================================
-- INVOICES & BILLING
-- =============================================
create type invoice_status as enum ('draft', 'sent', 'paid', 'overdue', 'cancelled');

create table public.invoices (
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

create table public.invoice_items (
  id uuid default uuid_generate_v4() primary key,
  invoice_id uuid references public.invoices(id) on delete cascade,
  description text not null,
  quantity decimal(8,2) default 1,
  unit_price decimal(12,2) not null,
  amount decimal(12,2) not null,
  sort_order int default 0
);

-- =============================================
-- TIME TRACKING
-- =============================================
create table public.time_entries (
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

-- =============================================
-- NOTIFICATIONS
-- =============================================
create type notification_type as enum (
  'document_uploaded', 'message_received', 'invoice_sent', 'invoice_paid',
  'deadline_approaching', 'engagement_status_changed', 'pbc_completed', 'new_client'
);

create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  type notification_type,
  title text not null,
  message text,
  link text,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- =============================================
-- AUDIT LOG
-- =============================================
create table public.audit_log (
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

-- =============================================
-- BLOG / INSIGHTS (Public)
-- =============================================
create type post_status as enum ('draft', 'published', 'archived');

create table public.blog_posts (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  cover_image text,
  status post_status default 'draft',
  tags text[],
  author_id uuid references public.profiles(id),
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================
-- CONTACT FORM SUBMISSIONS
-- =============================================
create table public.contact_submissions (
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
create index idx_clients_status on public.clients(status);
create index idx_engagements_client on public.engagements(client_id);
create index idx_engagements_status on public.engagements(status);
create index idx_documents_engagement on public.documents(engagement_id);
create index idx_documents_client on public.documents(client_id);
create index idx_messages_engagement on public.messages(engagement_id);
create index idx_invoices_client on public.invoices(client_id);
create index idx_invoices_status on public.invoices(status);
create index idx_notifications_user on public.notifications(user_id, is_read);
create index idx_time_entries_engagement on public.time_entries(engagement_id);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================
alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.engagements enable row level security;
alter table public.documents enable row level security;
alter table public.pbc_requests enable row level security;
alter table public.messages enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_items enable row level security;
alter table public.time_entries enable row level security;
alter table public.notifications enable row level security;
alter table public.blog_posts enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.milestones enable row level security;

-- Profiles: users can see their own, auditors can see all
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Auditors can view all profiles" on public.profiles for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('auditor', 'admin'))
);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Clients: only auditors/admins can manage, clients see their own record
create policy "Auditors manage clients" on public.clients for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('auditor', 'admin'))
);
create policy "Clients view own record" on public.clients for select using (
  profile_id = auth.uid()
);

-- Engagements: auditors see all, clients see their own
create policy "Auditors manage engagements" on public.engagements for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('auditor', 'admin'))
);
create policy "Clients view own engagements" on public.engagements for select using (
  client_id in (select id from public.clients where profile_id = auth.uid())
);

-- Documents: auditors manage, clients access their own
create policy "Auditors manage documents" on public.documents for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('auditor', 'admin'))
);
create policy "Clients access own documents" on public.documents for select using (
  client_id in (select id from public.clients where profile_id = auth.uid())
);
create policy "Clients upload documents" on public.documents for insert with check (
  client_id in (select id from public.clients where profile_id = auth.uid())
);

-- Messages: parties in engagement
create policy "Engagement parties can message" on public.messages for all using (
  sender_id = auth.uid() or
  exists (select 1 from public.profiles where id = auth.uid() and role in ('auditor', 'admin')) or
  client_id in (select id from public.clients where profile_id = auth.uid())
);

-- Invoices: auditors manage, clients view their own
create policy "Auditors manage invoices" on public.invoices for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('auditor', 'admin'))
);
create policy "Clients view own invoices" on public.invoices for select using (
  client_id in (select id from public.clients where profile_id = auth.uid())
);

-- Notifications: users see own
create policy "Users see own notifications" on public.notifications for all using (user_id = auth.uid());

-- Blog: published posts public, drafts only auditors
create policy "Public can read published posts" on public.blog_posts for select using (status = 'published');
create policy "Auditors manage blog" on public.blog_posts for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('auditor', 'admin'))
);

-- Contact submissions: auditors only
create policy "Anyone can submit contact form" on public.contact_submissions for insert with check (true);
create policy "Auditors read submissions" on public.contact_submissions for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('auditor', 'admin'))
);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'client')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at before update on public.profiles for each row execute procedure public.handle_updated_at();
create trigger set_updated_at before update on public.clients for each row execute procedure public.handle_updated_at();
create trigger set_updated_at before update on public.engagements for each row execute procedure public.handle_updated_at();
create trigger set_updated_at before update on public.documents for each row execute procedure public.handle_updated_at();
create trigger set_updated_at before update on public.invoices for each row execute procedure public.handle_updated_at();

-- Auto-generate invoice numbers
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

create trigger before_invoice_insert
  before insert on public.invoices
  for each row
  when (new.invoice_number is null or new.invoice_number = '')
  execute procedure public.generate_invoice_number();

-- Update billable hours on engagement when time entry added
create or replace function public.update_engagement_hours()
returns trigger language plpgsql as $$
begin
  update public.engagements
  set billable_hours = (
    select coalesce(sum(hours), 0) from public.time_entries
    where engagement_id = new.engagement_id and is_billable = true
  )
  where id = new.engagement_id;
  return new;
end;
$$;

create trigger after_time_entry
  after insert or update or delete on public.time_entries
  for each row execute procedure public.update_engagement_hours();

-- =============================================
-- STORAGE BUCKETS
-- =============================================
-- Run these in Supabase dashboard > Storage:
-- insert into storage.buckets (id, name, public) values ('documents', 'documents', false);
-- insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);
-- insert into storage.buckets (id, name, public) values ('blog-images', 'blog-images', true);

-- Storage policies for documents bucket
-- create policy "Authenticated users can upload" on storage.objects for insert with check (bucket_id = 'documents' and auth.role() = 'authenticated');
-- create policy "Users can access own docs" on storage.objects for select using (bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]);

-- =============================================
-- SEED DATA (optional demo data)
-- =============================================
-- Insert demo data after creating your first auditor user:
-- See seed.sql for sample clients, engagements, etc.
