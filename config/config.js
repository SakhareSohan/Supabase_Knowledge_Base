require('dotenv').config();

module.exports = {
    app_port : process.env.app_port,
    app_host : process.env.app_host,

    db_host : process.env.db_host,
    db_name : process.env.db_name,
    db_username : process.env.db_username,
    db_port : process.env.db_port,
    db_password : process.env.db_password,
    supabase_token : process.env.supabase_token,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,

    GEMINI_API_KEY: process.env.GEMINI_API_KEY
}