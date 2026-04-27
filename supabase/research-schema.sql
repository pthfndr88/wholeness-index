-- ─────────────────────────────────────────────────────────────────────────────
-- Wholeness Index — Research & Intelligence Layer
-- Sterizo Research Group / Pathfinder Educational Ltd
-- Add this to supabase/schema.sql or run separately after the base schema
-- ─────────────────────────────────────────────────────────────────────────────


-- ─── TABLE 1: RESEARCH TAGS ───────────────────────────────────────────────────
-- Opt-in demographic data collected at email capture
-- Entirely voluntary — used to slice archetype intelligence by sector/role

create table public.research_tags (
  id              uuid default uuid_generate_v4() primary key,
  result_id       uuid references public.results(id) on delete cascade,
  user_id         uuid references public.profiles(id) on delete set null,

  -- Sector
  sector          text, -- e.g. 'technology', 'education', 'healthcare',
                        -- 'finance', 'public_sector', 'ngo', 'legal',
                        -- 'consulting', 'creative', 'other'

  -- Role level
  role_level      text, -- 'individual_contributor', 'team_lead', 'manager',
                        -- 'senior_manager', 'director', 'vp', 'c_suite',
                        -- 'founder', 'freelance', 'student', 'other'

  -- Experience
  years_experience  integer, -- total years in professional work

  -- Geography
  country         text, -- ISO 3166-1 alpha-2, e.g. 'GB', 'US', 'NG', 'ZA'
  region          text, -- e.g. 'London', 'Manchester', 'Lagos', 'New York'

  -- Organisation size
  org_size        text, -- 'solo', '2_10', '11_50', '51_200',
                        -- '201_1000', '1001_5000', '5000_plus'

  -- Consent — must be true before storing any tag data
  consent_given   boolean not null default false,
  consent_at      timestamptz,

  created_at      timestamptz default now()
);

alter table public.research_tags enable row level security;

create policy "Users can insert own research tags"
  on public.research_tags for insert
  with check (auth.uid() = user_id AND consent_given = true);

create policy "Users can view own research tags"
  on public.research_tags for select
  using (auth.uid() = user_id);

-- Researchers (service role) can read all consented tags for aggregation
-- Access via service role client only — no RLS policy needed


-- ─── TABLE 2: ARCHETYPE SNAPSHOTS ────────────────────────────────────────────
-- Periodic aggregates of all results by archetype
-- Populated by the scheduled aggregation function below
-- One row per archetype per period

create table public.archetype_snapshots (
  id              uuid default uuid_generate_v4() primary key,
  snapshot_date   date not null,
  period          text not null check (period in ('weekly', 'monthly', 'quarterly')),
  archetype       text not null, -- 'seek', 'pow', 'gem', 'frag', 'aln'

  -- Sample
  n               integer not null default 0,
  n_rapid         integer not null default 0, -- from rapid classifier
  n_full          integer not null default 0, -- from full assessment

  -- Domain score averages (0–1)
  avg_i           float,
  avg_ch          float,
  avg_co          float,
  avg_im          float,

  -- Index averages
  avg_formation   float,
  avg_alignment   float,
  avg_structural  float,
  avg_cfs         float,

  -- Sub-domain averages (0–1) — full assessment only
  avg_i_selfconcept   float,
  avg_i_purpose       float,
  avg_i_belief        float,
  avg_i_values        float,
  avg_i_narrative     float,
  avg_ch_consistency  float,
  avg_ch_ethics       float,
  avg_ch_discipline   float,
  avg_ch_courage      float,
  avg_ch_integrity    float,
  avg_co_skills       float,
  avg_co_application  float,
  avg_co_problemsolving float,
  avg_co_learning     float,
  avg_co_execution    float,
  avg_im_recognition  float,
  avg_im_opportunity  float,
  avg_im_influence    float,
  avg_im_contribution float,
  avg_im_legacy       float,

  -- Distribution of confidence ratings
  avg_confidence      float,
  pct_high_confidence float, -- % with confidence >= 0.75

  -- Sector breakdown (jsonb — flexible for reporting)
  -- e.g. {"technology": 12, "education": 8, "finance": 5}
  sector_distribution   jsonb default '{}',
  role_level_distribution jsonb default '{}',
  country_distribution  jsonb default '{}',

  created_at      timestamptz default now(),

  unique (snapshot_date, period, archetype)
);

alter table public.archetype_snapshots enable row level security;

-- Public read — these are aggregated anonymous statistics
create policy "Anyone can read archetype snapshots"
  on public.archetype_snapshots for select
  using (true);

-- Only service role can insert/update (aggregation function)


-- ─── TABLE 3: COHORT ANALYTICS ────────────────────────────────────────────────
-- Per-engagement aggregate — powers coach reports and sector intelligence
-- One row per engagement, updated after each completion

create table public.cohort_analytics (
  id                  uuid default uuid_generate_v4() primary key,
  engagement_id       uuid references public.engagements(id) on delete cascade unique,

  -- Completion stats
  invited_count       integer default 0,
  completed_count     integer default 0,
  shared_count        integer default 0, -- shared with coach
  completion_rate     float,             -- completed / invited

  -- Archetype distribution (shared results only)
  -- e.g. {"seek": 8, "pow": 4, "gem": 6, "frag": 3, "aln": 2}
  archetype_distribution  jsonb default '{}',
  dominant_archetype      text,
  dominant_pct            float,

  -- Average scores across cohort (shared results only)
  avg_i               float,
  avg_ch              float,
  avg_co              float,
  avg_im              float,
  avg_formation       float,
  avg_alignment       float,
  avg_structural      float,
  avg_cfs             float,

  -- Most common gap — the sub-domain with lowest average score
  -- across all shared full assessment results in the cohort
  primary_gap_subdomain   text,
  primary_gap_score       float,

  -- Sector context (from research_tags if available)
  sector              text,
  org_size            text,

  -- Brief generation
  brief_generated     boolean default false,
  brief_generated_at  timestamptz,

  updated_at          timestamptz default now()
);

alter table public.cohort_analytics enable row level security;

create policy "Coaches can view analytics for own engagements"
  on public.cohort_analytics for select
  using (
    exists (
      select 1 from public.engagements e
      where e.id = engagement_id
      and e.coach_id = auth.uid()
    )
  );


-- ─── TABLE 4: INTELLIGENCE BRIEFS ────────────────────────────────────────────
-- Stores published and draft intelligence briefs and case studies
-- Content is rich text (markdown) — structured for MongoDB migration later
-- For now lives in Postgres; migrate content to MongoDB when volume grows

create table public.intelligence_briefs (
  id              uuid default uuid_generate_v4() primary key,

  -- Classification
  brief_type      text not null check (
                    brief_type in (
                      'archetype_brief',    -- per archetype, quarterly
                      'sector_report',      -- sector-specific findings
                      'case_study',         -- anonymised individual journey
                      'cohort_report',      -- engagement-level report
                      'research_paper'      -- Sterizo formal research output
                    )
                  ),

  -- Targeting
  archetype       text,         -- null if not archetype-specific
  sector          text,         -- null if not sector-specific
  engagement_id   uuid references public.engagements(id) on delete set null,
  snapshot_id     uuid references public.archetype_snapshots(id) on delete set null,

  -- Content
  title           text not null,
  subtitle        text,
  summary         text,         -- 2–3 sentence abstract
  body_markdown   text,         -- full brief content in markdown
  key_findings    jsonb,        -- structured array of finding strings
  -- e.g. ["Hidden Gems represent 34% of mid-career professionals",
  --        "Primary gap: Im_recognition (avg 0.38)"]

  -- Data provenance
  n_subjects      integer,      -- number of profiles this brief is based on
  period_start    date,
  period_end      date,
  snapshot_date   date,

  -- Publication
  status          text not null default 'draft'
                    check (status in ('draft', 'review', 'published', 'archived')),
  published_at    timestamptz,
  author          text default 'Sterizo Research Group',

  -- Tags for filtering and search
  tags            text[] default '{}',
  -- e.g. ['hidden-gem', 'visibility', 'mid-career', 'UK', 'leadership']

  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

alter table public.intelligence_briefs enable row level security;

-- Published briefs are public
create policy "Anyone can read published briefs"
  on public.intelligence_briefs for select
  using (status = 'published');

-- Coaches can read cohort reports for their own engagements
create policy "Coaches can read own cohort reports"
  on public.intelligence_briefs for select
  using (
    brief_type = 'cohort_report'
    and exists (
      select 1 from public.engagements e
      where e.id = engagement_id
      and e.coach_id = auth.uid()
    )
  );


-- ─── AGGREGATION FUNCTION ─────────────────────────────────────────────────────
-- Run this weekly via Supabase scheduled functions (pg_cron)
-- or trigger manually from the research admin dashboard
-- Creates/updates archetype_snapshots for the current period

create or replace function public.aggregate_archetype_snapshot(
  p_period text default 'monthly'
)
returns void
language plpgsql
security definer
as $$
declare
  v_snapshot_date date := current_date;
  v_archetype text;
  v_archetypes text[] := array['seek', 'pow', 'gem', 'frag', 'aln'];
begin
  foreach v_archetype in array v_archetypes loop

    insert into public.archetype_snapshots (
      snapshot_date,
      period,
      archetype,
      n,
      n_rapid,
      n_full,
      avg_i,
      avg_ch,
      avg_co,
      avg_im,
      avg_formation,
      avg_alignment,
      avg_structural,
      avg_cfs,
      avg_confidence,
      pct_high_confidence
    )
    select
      v_snapshot_date,
      p_period,
      v_archetype,
      count(*)::integer                                         as n,
      count(*) filter (where instrument = 'RAPID')::integer    as n_rapid,
      count(*) filter (where instrument = 'FULL')::integer     as n_full,
      round(avg(score_i)::numeric, 4)::float                   as avg_i,
      round(avg(score_ch)::numeric, 4)::float                  as avg_ch,
      round(avg(score_co)::numeric, 4)::float                  as avg_co,
      round(avg(score_im)::numeric, 4)::float                  as avg_im,
      round(avg(formation_score)::numeric, 4)::float           as avg_formation,
      round(avg(alignment_index)::numeric, 4)::float           as avg_alignment,
      round(avg(structural_index)::numeric, 4)::float          as avg_structural,
      round(
        avg(formation_score * alignment_index * structural_index)::numeric,
        4
      )::float                                                  as avg_cfs,
      round(avg(confidence)::numeric, 4)::float                as avg_confidence,
      round(
        (count(*) filter (where confidence >= 0.75)::float
        / nullif(count(*), 0)),
        4
      )::float                                                  as pct_high_confidence
    from public.results
    where archetype = v_archetype

    on conflict (snapshot_date, period, archetype)
    do update set
      n                   = excluded.n,
      n_rapid             = excluded.n_rapid,
      n_full              = excluded.n_full,
      avg_i               = excluded.avg_i,
      avg_ch              = excluded.avg_ch,
      avg_co              = excluded.avg_co,
      avg_im              = excluded.avg_im,
      avg_formation       = excluded.avg_formation,
      avg_alignment       = excluded.avg_alignment,
      avg_structural      = excluded.avg_structural,
      avg_cfs             = excluded.avg_cfs,
      avg_confidence      = excluded.avg_confidence,
      pct_high_confidence = excluded.pct_high_confidence;

  end loop;
end;
$$;


-- ─── COHORT ANALYTICS UPDATE FUNCTION ────────────────────────────────────────
-- Call this after each result is shared with a coach
-- Updates the cohort_analytics row for the engagement

create or replace function public.update_cohort_analytics(
  p_engagement_id uuid
)
returns void
language plpgsql
security definer
as $$
declare
  v_distribution  jsonb;
  v_dominant      text;
  v_dominant_pct  float;
  v_primary_gap   text;
  v_primary_score float;
begin
  -- Build archetype distribution from shared results
  select
    jsonb_object_agg(archetype, cnt)
  into v_distribution
  from (
    select archetype, count(*) as cnt
    from public.results
    where engagement_id = p_engagement_id
    and shared_with_coach = true
    group by archetype
  ) dist;

  -- Find dominant archetype
  select archetype, pct
  into v_dominant, v_dominant_pct
  from (
    select
      archetype,
      count(*)::float / nullif(sum(count(*)) over (), 0) as pct
    from public.results
    where engagement_id = p_engagement_id
    and shared_with_coach = true
    group by archetype
    order by count(*) desc
    limit 1
  ) dom;

  -- Upsert cohort_analytics
  insert into public.cohort_analytics (
    engagement_id,
    invited_count,
    completed_count,
    shared_count,
    completion_rate,
    archetype_distribution,
    dominant_archetype,
    dominant_pct,
    avg_i,
    avg_ch,
    avg_co,
    avg_im,
    avg_formation,
    avg_alignment,
    avg_structural,
    updated_at
  )
  select
    p_engagement_id,
    (select count(*) from public.invitations
     where engagement_id = p_engagement_id)::integer,
    (select count(*) from public.results
     where engagement_id = p_engagement_id)::integer,
    (select count(*) from public.results
     where engagement_id = p_engagement_id
     and shared_with_coach = true)::integer,
    (select count(*)::float from public.results
     where engagement_id = p_engagement_id)
    / nullif(
      (select count(*)::float from public.invitations
       where engagement_id = p_engagement_id), 0
    ),
    coalesce(v_distribution, '{}'),
    v_dominant,
    v_dominant_pct,
    round(avg(r.score_i)::numeric, 4)::float,
    round(avg(r.score_ch)::numeric, 4)::float,
    round(avg(r.score_co)::numeric, 4)::float,
    round(avg(r.score_im)::numeric, 4)::float,
    round(avg(r.formation_score)::numeric, 4)::float,
    round(avg(r.alignment_index)::numeric, 4)::float,
    round(avg(r.structural_index)::numeric, 4)::float,
    now()
  from public.results r
  where r.engagement_id = p_engagement_id
  and r.shared_with_coach = true

  on conflict (engagement_id)
  do update set
    invited_count           = excluded.invited_count,
    completed_count         = excluded.completed_count,
    shared_count            = excluded.shared_count,
    completion_rate         = excluded.completion_rate,
    archetype_distribution  = excluded.archetype_distribution,
    dominant_archetype      = excluded.dominant_archetype,
    dominant_pct            = excluded.dominant_pct,
    avg_i                   = excluded.avg_i,
    avg_ch                  = excluded.avg_ch,
    avg_co                  = excluded.avg_co,
    avg_im                  = excluded.avg_im,
    avg_formation           = excluded.avg_formation,
    avg_alignment           = excluded.avg_alignment,
    avg_structural          = excluded.avg_structural,
    updated_at              = now();

end;
$$;


-- ─── TRIGGER: AUTO-UPDATE COHORT ANALYTICS ON RESULT SHARE ───────────────────
-- Fires whenever shared_with_coach is set to true on a result

create or replace function public.trigger_cohort_analytics_update()
returns trigger
language plpgsql
security definer
as $$
begin
  if new.shared_with_coach = true
     and (old.shared_with_coach = false or old.shared_with_coach is null)
     and new.engagement_id is not null
  then
    perform public.update_cohort_analytics(new.engagement_id);
  end if;
  return new;
end;
$$;

create trigger on_result_shared
  after update on public.results
  for each row
  execute procedure public.trigger_cohort_analytics_update();


-- ─── SCHEDULED AGGREGATION (pg_cron) ─────────────────────────────────────────
-- Enable pg_cron in Supabase: Dashboard → Database → Extensions → pg_cron
-- Then run these once to schedule the jobs:

-- Weekly snapshot (every Monday at 02:00 UTC)
-- select cron.schedule(
--   'weekly-archetype-snapshot',
--   '0 2 * * 1',
--   $$ select public.aggregate_archetype_snapshot('weekly') $$
-- );

-- Monthly snapshot (1st of each month at 03:00 UTC)
-- select cron.schedule(
--   'monthly-archetype-snapshot',
--   '0 3 1 * *',
--   $$ select public.aggregate_archetype_snapshot('monthly') $$
-- );

-- Uncomment and run these in the SQL editor once pg_cron is enabled


-- ─── USEFUL RESEARCH QUERIES ──────────────────────────────────────────────────
-- These are ready-to-run queries for the research dashboard
-- Run in Supabase SQL editor or via service role client

-- 1. Archetype distribution across all completions
-- select archetype, count(*) as n,
--   round(count(*)::numeric / sum(count(*)) over () * 100, 1) as pct
-- from public.results
-- group by archetype order by n desc;

-- 2. Average domain scores by archetype
-- select archetype,
--   round(avg(score_i)::numeric, 3) as avg_identity,
--   round(avg(score_ch)::numeric, 3) as avg_character,
--   round(avg(score_co)::numeric, 3) as avg_competence,
--   round(avg(score_im)::numeric, 3) as avg_impact,
--   count(*) as n
-- from public.results
-- group by archetype order by archetype;

-- 3. Hidden Gem primary sub-domain gap
-- (requires full assessment results)
-- select archetype,
--   round(avg(score_i)::numeric, 3) as identity,
--   round(avg(score_im)::numeric, 3) as impact,
--   round(avg(score_im)::numeric, 3) -
--   round(avg(score_i)::numeric, 3) as identity_impact_gap
-- from public.results
-- where archetype = 'gem' and instrument = 'FULL'
-- group by archetype;

-- 4. Sector distribution (requires research_tags)
-- select rt.sector, r.archetype, count(*) as n
-- from public.results r
-- join public.research_tags rt on rt.result_id = r.id
-- where rt.consent_given = true
-- group by rt.sector, r.archetype
-- order by rt.sector, n desc;

-- 5. Formation score trends over time
-- select date_trunc('month', completed_at) as month,
--   archetype,
--   round(avg(formation_score)::numeric, 3) as avg_f,
--   count(*) as n
-- from public.results
-- where formation_score is not null
-- group by 1, 2 order by 1, 2;
