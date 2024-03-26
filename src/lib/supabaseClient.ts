import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://kbbrkkuigxxsbnzeqwug.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiYnJra3VpZ3h4c2JuemVxd3VnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTE0NDYwOTEsImV4cCI6MjAyNzAyMjA5MX0.MEd9xicwFWIHnOPzLo5OuI9QFoNcrPj6BDkS3kgaK5k'
)
