-- AI Recruitment Assistant — initial schema
-- Run once in the Supabase SQL Editor (Project > SQL Editor > New query).

create extension if not exists "pgcrypto";

create table if not exists candidates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  resume_storage_path text not null,
  parsed_profile jsonb,
  created_at timestamptz not null default now()
);

create table if not exists job_descriptions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  raw_text text not null,
  extracted_requirements jsonb,
  created_at timestamptz not null default now()
);

create table if not exists evaluations (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references candidates(id) on delete cascade,
  job_id uuid not null references job_descriptions(id) on delete cascade,
  match_score integer not null check (match_score >= 0 and match_score <= 100),
  score_rationale text,
  missing_skills jsonb not null default '[]'::jsonb,
  interview_questions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  evaluation_id uuid not null references evaluations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists evaluations_candidate_id_idx on evaluations(candidate_id);
create index if not exists evaluations_job_id_idx on evaluations(job_id);
create index if not exists chat_messages_evaluation_id_idx on chat_messages(evaluation_id);

-- RLS on, no policies: the app only ever reads/writes through server-side
-- API routes using the service_role key, which bypasses RLS. Enabling RLS
-- with no grants means the anon key is blocked from these tables even if
-- it were ever used client-side by mistake.
alter table candidates enable row level security;
alter table job_descriptions enable row level security;
alter table evaluations enable row level security;
alter table chat_messages enable row level security;

-- Private bucket for resume files. Access is via signed URLs generated
-- server-side (service_role), never a public URL — resumes are PII.
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false)
on conflict (id) do nothing;

-- This project doesn't have the usual default service_role grants on
-- public schema tables. RLS being enabled is not enough on its own —
-- service_role still needs explicit table privileges to bypass RLS.
grant usage on schema public to service_role;
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
alter default privileges in schema public grant all on tables to service_role;
alter default privileges in schema public grant all on sequences to service_role;
