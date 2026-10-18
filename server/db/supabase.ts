import { config } from '../config';

/**
 * Supabase PostgreSQL Database Interface & Utilities
 *
 * In Phase 1, we define client connectors, schema specifications, and
 * fallback in-memory adapters for local development when Supabase credentials
 * are not yet provisioned.
 */

export interface DatabaseAdapter {
  isConfigured: boolean;
  registrations: {
    insert: (data: any) => Promise<{ data: any; error: any }>;
    getAll: () => Promise<{ data: any[]; error: any }>;
    updateStatus: (id: string, status: string) => Promise<{ data: any; error: any }>;
  };
  inquiries: {
    insert: (data: any) => Promise<{ data: any; error: any }>;
  };
}

// In-Memory fallback store for Phase 1 development and local prototyping
const inMemoryRegistrations: any[] = [
  {
    id: 'REG-1001',
    teamName: 'CyberPikachu',
    leadName: 'Rohan Mehra',
    leadEmail: 'rohan@example.com',
    leadPhone: '+91 98765 43210',
    institution: 'PW IOI Noida',
    teamSize: 4,
    track: 'AI & Autonomous Agents',
    status: 'shortlisted',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'REG-1002',
    teamName: 'ZeroKnowledgeSquad',
    leadName: 'Ananya Gupta',
    leadEmail: 'ananya@example.com',
    leadPhone: '+91 98765 43211',
    institution: 'DTU Delhi',
    track: 'Web3 & Decentralized Systems',
    teamSize: 3,
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
];

const inMemoryInquiries: any[] = [];

/**
 * Supabase DB Client Provider
 */
export const db: DatabaseAdapter = {
  isConfigured: Boolean(
    config.supabase.url &&
    !config.supabase.url.includes('placeholder') &&
    config.supabase.anonKey &&
    !config.supabase.anonKey.includes('placeholder')
  ),

  registrations: {
    async insert(payload: any) {
      const record = {
        id: `REG-${Math.floor(1000 + Math.random() * 9000)}`,
        ...payload,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      inMemoryRegistrations.unshift(record);
      return { data: record, error: null };
    },

    async getAll() {
      return { data: inMemoryRegistrations, error: null };
    },

    async updateStatus(id: string, status: string) {
      const item = inMemoryRegistrations.find((r) => r.id === id);
      if (item) {
        item.status = status;
        return { data: item, error: null };
      }
      return { data: null, error: new Error('Record not found') };
    },
  },

  inquiries: {
    async insert(payload: any) {
      const record = {
        id: `INQ-${Date.now()}`,
        ...payload,
        createdAt: new Date().toISOString(),
      };
      inMemoryInquiries.unshift(record);
      return { data: record, error: null };
    },
  },
};

/**
 * Recommended PostgreSQL / Supabase Table DDL for subsequent phases
 */
export const SQL_SCHEMA_BLUEPRINT = `
-- PokeThon 2026 PostgreSQL Schema for Supabase

CREATE TABLE IF NOT EXISTS registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_number VARCHAR(32) UNIQUE NOT NULL,
  team_name VARCHAR(120) NOT NULL,
  lead_name VARCHAR(120) NOT NULL,
  lead_email VARCHAR(255) NOT NULL,
  lead_phone VARCHAR(32) NOT NULL,
  institution VARCHAR(255) NOT NULL,
  team_size INT NOT NULL CHECK (team_size BETWEEN 2 AND 4),
  track VARCHAR(80) NOT NULL,
  project_idea_abstract TEXT,
  github_url TEXT,
  portfolio_url TEXT,
  status VARCHAR(32) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL,
  category VARCHAR(80) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Public can insert; only Service Role or Admins can read
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
`;
