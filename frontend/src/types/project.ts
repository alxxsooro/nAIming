/** Row shape for `public.projects` (see supabase/migrations/001_projects.sql). */
export type Project = {
  id: string;
  user_id: string;
  name: string;
  tagline: string | null;
  logo_url: string | null;
  brief: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};
