import 'react-native-url-polyfill/auto';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  'https://uzxymzfyzowtzyxzfoeb.supabase.co';

const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6eHltemZ5em93dHp5eHpmb2ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMjE4NTYsImV4cCI6MjA5Mzc5Nzg1Nn0.lQOYIdVPwUAeO7P_p_S0zVA8tNWrXybtuzSEP0HX02g';

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);