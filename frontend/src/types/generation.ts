export type LogoType = "logotipo" | "isotipo" | "imagotipo" | "isologo";

export type GenerationItem = {
  name: string;
  logo_type: LogoType;
  logo_url: string;
  logo_prompt: string;
};

/** Row shape for `public.generations` (see supabase/migrations/002_generations.sql). */
export type Generation = {
  id: string;
  user_id: string;
  idea: string;
  items: GenerationItem[];
  created_at: string;
};

/** Response from `POST {VITE_API_URL}/generate`. */
export type GenerateResponse = {
  id: string;
  idea: string;
  items: GenerationItem[];
};
