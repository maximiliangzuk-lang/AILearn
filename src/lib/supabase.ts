import { createClient } from '@supabase/supabase-js';

// Hier greifen wir auf die ENV-Variablen zu
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

// Erstelle den Supabase Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);