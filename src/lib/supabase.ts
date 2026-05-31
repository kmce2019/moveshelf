import { createClient } from '@supabase/supabase-js';
import type { BoxInput, MoveBox } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Keep the app renderable so CSV and docs pages remain inspectable during setup.
  console.warn('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
}

type Database = {
  public: {
    Tables: {
      boxes: {
        Row: MoveBox;
        Insert: BoxInput & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<BoxInput> & { id?: string; created_at?: string; updated_at?: string };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export const supabase = createClient<Database>(
  supabaseUrl || 'https://example.supabase.co',
  supabaseAnonKey || 'missing-key',
);

export const publicAppUrl = (import.meta.env.VITE_PUBLIC_APP_URL || window.location.origin).replace(/\/$/, '');
