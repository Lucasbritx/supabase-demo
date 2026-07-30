# Supabase Realtime Todos

A small React + TypeScript + Vite demo that stores todos in Supabase and updates the UI through Supabase Realtime whenever rows change.

## Demo

[Watch the demo video](Supabase-demo.mov)

## What It Does

- Lists todos from a Supabase `todos` table.
- Adds new todos.
- Toggles todo completion.
- Subscribes to Postgres changes and refreshes automatically across browser sessions.

## Tech Stack

- React 19
- TypeScript
- Vite
- Supabase JavaScript client
- Supabase Postgres, Row Level Security, and Realtime

## Setup

Install dependencies:

```sh
npm install
```

Create a Supabase project, then add the app environment variables in `.env`:

```sh
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

You can find these values in the Supabase dashboard under project settings.

## Database

Run the SQL in [src/sqls/todos.sql](src/sqls/todos.sql) in the Supabase SQL editor. It creates the `todos` table, enables Row Level Security, and adds public demo policies for reading, inserting, and updating todos.

Because this is a public demo, the policies allow anonymous users to read, create, and update every todo. Tighten these policies before using this pattern in a production app.

## Realtime

The app listens for changes on the `public.todos` table. Enable Realtime for that table in the Supabase dashboard under Database replication, or add the table to the Realtime publication with SQL:

```sql
alter publication supabase_realtime add table todos;
```

## Development

Start the Vite dev server:

```sh
npm run dev
```

Build for production:

```sh
npm run build
```

Preview the production build:

```sh
npm run preview
```

Run linting:

```sh
npm run lint
```

## Project Structure

```text
src/
  App.tsx          React todo UI and Supabase Realtime subscription
  supabase.ts     Supabase client configured from Vite env variables
  sqls/todos.sql  Database schema and demo RLS policies
```
