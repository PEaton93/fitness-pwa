create table workout_logs (
  id bigint generated always as identity primary key,
  event_type text not null,
  day_index int,
  event_date date,
  payload jsonb,
  created_at timestamptz default now()
);

alter table workout_logs enable row level security;

create policy "anon insert only"
  on workout_logs for insert
  to anon
  with check (true);
