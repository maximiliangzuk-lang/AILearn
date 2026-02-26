import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.https://ypwlvraoiylnuksupsug.supabase.co!;
const supabaseAnonKey = import.meta.env.sb_publishable_hhON-fW5-IknPocpTzaL4w_GAPVVDsA!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);