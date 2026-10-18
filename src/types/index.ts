/**
 * PokeThon 2026 Type Definitions
 */

export type EventTrack = 'AI & Autonomous Agents' | 'Web3 & Decentralized Systems' | 'FinTech & Open Banking' | 'HealthTech & BioInformatics' | 'Open Innovation';

export interface RegistrationPayload {
  teamName: string;
  leadName: string;
  leadEmail: string;
  leadPhone: string;
  institution: string;
  teamSize: number;
  track: EventTrack;
  projectIdeaAbstract?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  acceptedTerms: boolean;
}

export interface RegistrationRecord extends RegistrationPayload {
  id: string;
  registrationNumber: string;
  status: 'pending' | 'shortlisted' | 'confirmed' | 'waitlisted' | 'rejected';
  createdAt: string;
}

export interface SponsorPerk {
  title: string;
  tier: 'Title' | 'Powered By' | 'Platinum' | 'Gold' | 'Community';
  description: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
