const config = require('./config');

const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = config.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = config.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;

