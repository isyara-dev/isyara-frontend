import { createClient } from '@supabase/supabase-js';

// Menggunakan URL dan key langsung dari dokumentasi
const supabaseUrl = 'https://nyrnscpotfdoqqejwqae.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55cm5zY3BvdGZkb3FxZWp3cWFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5Mzc4MzAsImV4cCI6MjA2MjUxMzgzMH0.BsOfzZS8cQXf4VclbOmevgvxkTeYen6ytoPa4DQYfqw';

console.log('SUPABASE URL:', supabaseUrl);
console.log('SUPABASE KEY:', supabaseKey ? 'Key exists' : 'Key missing');

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase; 