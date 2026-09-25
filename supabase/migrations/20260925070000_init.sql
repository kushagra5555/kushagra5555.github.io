create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  child_details jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'parent_student', 'instructor')),
  created_at timestamptz not null default now(),
  primary key (user_id, role)
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  short_description text,
  description text,
  age_min int,
  age_max int,
  duration_label text,
  format text,
  price_paise int not null default 0,
  display_price text not null default '',
  currency text not null default 'INR',
  active boolean not null default true,
  published boolean not null default false,
  enquiry_only boolean not null default false,
  review_required boolean not null default false,
  cover_image_url text,
  gallery jsonb not null default '[]'::jsonb,
  trainer_name text,
  access_instructions text,
  access_url text,
  themes text[] not null default '{}'::text[],
  outcomes text[] not null default '{}'::text[],
  schedule jsonb,
  seo jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.course_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text,
  sort_order int not null default 0,
  published boolean not null default false,
  review_required boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.course_modules(id) on delete cascade,
  title text not null,
  description text,
  lesson_type text not null default 'text',
  body text,
  external_url text,
  media_url text,
  thumbnail_url text,
  sort_order int not null default 0,
  published boolean not null default false,
  review_required boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.course_media (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  media_type text not null,
  storage_path text,
  public_url text,
  title text,
  alt_text text,
  review_required boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.live_sessions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  start_at timestamptz,
  end_at timestamptz,
  timezone text,
  meeting_url text,
  capacity int,
  notes text,
  attendance_status text,
  review_required boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete restrict,
  verified_email text not null,
  amount_paise int not null,
  currency text not null default 'INR',
  status text not null default 'pending',
  razorpay_order_id text not null unique,
  razorpay_payment_id text unique,
  created_at timestamptz not null default now(),
  verified_at timestamptz
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  source_payment_id uuid references public.payments(id),
  status text not null default 'active',
  audit_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, course_id, status)
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  area_of_interest text,
  message text,
  source text,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  target_type text not null,
  target_id text,
  reason text,
  payload jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null,
  review_required boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  author_name text,
  author_role text,
  source text,
  published boolean not null default false,
  review_required boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  scope text not null default 'general',
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  published boolean not null default false,
  review_required boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.legal_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  body text not null,
  status text not null default 'draft',
  review_required boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.user_roles ur where ur.user_id = uid and ur.role = 'admin'
  );
$$;

create or replace function public.has_active_enrollment(uid uuid, c_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.enrollments e where e.user_id = uid and e.course_id = c_id and e.status = 'active'
  );
$$;

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.courses enable row level security;
alter table public.course_modules enable row level security;
alter table public.lessons enable row level security;
alter table public.course_media enable row level security;
alter table public.live_sessions enable row level security;
alter table public.payments enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.enquiries enable row level security;
alter table public.admin_audit_logs enable row level security;
alter table public.site_settings enable row level security;
alter table public.testimonials enable row level security;
alter table public.faqs enable row level security;
alter table public.legal_pages enable row level security;

create policy profiles_self_read on public.profiles for select using (auth.uid() = id or public.is_admin(auth.uid()));
create policy profiles_self_write on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);

create policy user_roles_read_self on public.user_roles for select using (auth.uid() = user_id or public.is_admin(auth.uid()));
create policy user_roles_admin_all on public.user_roles for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy courses_public_read on public.courses for select using (published = true and active = true);
create policy courses_admin_all on public.courses for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy modules_public_read on public.course_modules
for select using (
  published = true and exists (
    select 1 from public.courses c where c.id = course_id and c.published = true and c.active = true
  )
);
create policy modules_enrolled_read on public.course_modules
for select using (public.has_active_enrollment(auth.uid(), course_id));
create policy modules_admin_all on public.course_modules for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy lessons_public_read on public.lessons
for select using (
  published = true and exists (
    select 1 from public.course_modules m join public.courses c on c.id = m.course_id
    where m.id = module_id and m.published = true and c.published = true and c.active = true
  )
);
create policy lessons_enrolled_read on public.lessons
for select using (
  exists (
    select 1 from public.course_modules m
    where m.id = module_id and public.has_active_enrollment(auth.uid(), m.course_id)
  )
);
create policy lessons_admin_all on public.lessons for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy media_enrolled_read on public.course_media
for select using (public.has_active_enrollment(auth.uid(), course_id) or public.is_admin(auth.uid()));
create policy media_admin_all on public.course_media for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy sessions_enrolled_read on public.live_sessions
for select using ((published = true and public.has_active_enrollment(auth.uid(), course_id)) or public.is_admin(auth.uid()));
create policy sessions_admin_all on public.live_sessions for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy payments_self_read on public.payments for select using (auth.uid() = user_id or public.is_admin(auth.uid()));
create policy payments_no_client_writes on public.payments for insert with check (false);
create policy payments_no_client_updates on public.payments for update using (false) with check (false);
create policy payments_no_client_delete on public.payments for delete using (false);

create policy enrollments_self_read on public.enrollments for select using (auth.uid() = user_id or public.is_admin(auth.uid()));
create policy enrollments_no_client_writes on public.enrollments for insert with check (false);
create policy enrollments_no_client_updates on public.enrollments for update using (false) with check (false);
create policy enrollments_no_client_delete on public.enrollments for delete using (false);

create policy progress_self_all on public.lesson_progress
for all using (auth.uid() = user_id or public.is_admin(auth.uid())) with check (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy enquiries_create on public.enquiries for insert with check (auth.uid() = user_id or user_id is null);
create policy enquiries_read_self on public.enquiries for select using (auth.uid() = user_id or public.is_admin(auth.uid()));
create policy enquiries_admin_update on public.enquiries for update using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy logs_admin_read on public.admin_audit_logs for select using (public.is_admin(auth.uid()));
create policy logs_admin_write on public.admin_audit_logs for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy settings_public_read on public.site_settings for select using (published = true);
create policy settings_admin_all on public.site_settings for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy testimonials_public_read on public.testimonials for select using (published = true);
create policy testimonials_admin_all on public.testimonials for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy faqs_public_read on public.faqs for select using (published = true);
create policy faqs_admin_all on public.faqs for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy legal_public_read on public.legal_pages for select using (status = 'published');
create policy legal_admin_all on public.legal_pages for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
