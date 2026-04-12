alter table public.papers
  add column if not exists arxiv_id text;

alter table public.papers
  add column if not exists external_ids jsonb;

alter table public.papers
  add column if not exists doi text;

create index if not exists idx_papers_arxiv_id on public.papers(arxiv_id);