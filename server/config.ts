import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isDev: (process.env.NODE_ENV || 'development') === 'development',
  
  // Supabase PostgreSQL Configuration
  supabase: {
    url: process.env.SUPABASE_URL || 'https://placeholder-project.supabase.co',
    anonKey: process.env.SUPABASE_ANON_KEY || 'placeholder-anon-key',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },

  // Admin Security
  admin: {
    accessKey: process.env.ADMIN_ACCESS_KEY || 'pokethon2026',
    jwtSecret: process.env.JWT_SECRET || 'pokethon-development-secret-key-2026',
  },

  // Event Metadata
  event: {
    name: 'PokeThon 2026',
    host: 'Fusion Tech Club',
    institution: 'PW Institute of Innovation, Noida',
    durationHours: 24,
    venue: 'Sector 62, Noida, UP, India',
  },
};
