import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.https://ablgzkhyhcyepwfttrya.supabase.co
const supabaseAnonKey = import.meta.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFibGd6a2h5aGN5ZXB3ZnR0cnlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5MTMyMDcsImV4cCI6MjA5MTQ4OTIwN30.xp0-5rLo2vSbBQS1iMs-5tn6MC1fvD_bP1L0oYnzeSE

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)
