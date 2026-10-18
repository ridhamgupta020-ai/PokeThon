import React, { useState } from 'react';
import { PageContainer } from '../components/ui/PageContainer';
import { ShieldCheck, Lock, Database, Search, Filter, RefreshCw, KeyRound } from 'lucide-react';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { TextInput } from '../components/ui/FormField';
import { useToast } from '../context/ToastContext';

export const AdminPage: React.FC = () => {
  const { addToast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessKey, setAccessKey] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample placeholder registrations for organizer inspection
  const [registrations] = useState([
    {
      id: 'REG-1001',
      teamName: 'CyberPikachu',
      leadName: 'Rohan Mehra',
      institution: 'PW IOI Noida',
      track: 'AI & Autonomous Agents',
      teamSize: 4,
      status: 'shortlisted',
    },
    {
      id: 'REG-1002',
      teamName: 'ZeroKnowledgeSquad',
      leadName: 'Ananya Gupta',
      institution: 'DTU Delhi',
      track: 'Web3 & Decentralized Systems',
      teamSize: 3,
      status: 'pending',
    },
    {
      id: 'REG-1003',
      teamName: 'PulsePulse',
      leadName: 'Vikram Seth',
      institution: 'IIT Roorkee',
      track: 'HealthTech & BioInformatics',
      teamSize: 4,
      status: 'confirmed',
    },
    {
      id: 'REG-1004',
      teamName: 'FinNova',
      leadName: 'Priya Sharma',
      institution: 'BITS Pilani',
      track: 'FinTech & Open Banking',
      teamSize: 2,
      status: 'pending',
    },
  ]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessKey.trim() === 'pokethon2026' || accessKey.trim() === 'admin') {
      setIsAuthenticated(true);
      addToast('Authenticated to PokeThon Organizer Console.', 'success', 'Session Established');
    } else {
      addToast('Invalid organizer access key. Try "pokethon2026" in Phase 1 preview.', 'error', 'Access Denied');
    }
  };

  const filteredRegistrations = registrations.filter(
    (r) =>
      r.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.track.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageContainer
      badge="Organizer Console"
      title="PokeThon Command Center"
      description="Administration portal for Fusion Tech Club leads, track judges, and venue coordinators."
      maxWidth="xl"
    >
      {!isAuthenticated ? (
        <div className="max-w-md mx-auto my-12 p-8 rounded-xl bg-[#0B2342] border border-[#168BFF]/30 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#06152B] border border-[#168BFF]/40 flex items-center justify-center text-[#FFD83D]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#F5F7FC]">Organizer Gate</h3>
              <p className="text-xs text-[#B9C7D9]">Restricted to authorized sprint leads</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <TextInput
              id="adminKey"
              type="password"
              label="Sprint Access Key"
              placeholder="Enter master key"
              leftIcon={<KeyRound className="w-4 h-4" />}
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              helperText="Phase 1 dev passkey: pokethon2026"
              required
            />

            <PrimaryButton type="submit" variant="yellow" fullWidth>
              Access Console
            </PrimaryButton>
          </form>
        </div>
      ) : (
        <div className="space-y-8 mb-16">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-[#0B2342] border border-[#168BFF]/20">
              <span className="text-xs font-mono text-[#B9C7D9]">Total Teams</span>
              <p className="text-2xl font-black text-[#FFD83D] mt-1 font-mono tabular-nums">48</p>
            </div>
            <div className="p-5 rounded-xl bg-[#0B2342] border border-[#168BFF]/20">
              <span className="text-xs font-mono text-[#B9C7D9]">Confirmed Slots</span>
              <p className="text-2xl font-black text-[#168BFF] mt-1 font-mono tabular-nums">26</p>
            </div>
            <div className="p-5 rounded-xl bg-[#0B2342] border border-[#168BFF]/20">
              <span className="text-xs font-mono text-[#B9C7D9]">Pending Review</span>
              <p className="text-2xl font-black text-amber-400 mt-1 font-mono tabular-nums">18</p>
            </div>
            <div className="p-5 rounded-xl bg-[#0B2342] border border-[#168BFF]/20">
              <span className="text-xs font-mono text-[#B9C7D9]">Waitlisted</span>
              <p className="text-2xl font-black text-[#B9C7D9] mt-1 font-mono tabular-nums">4</p>
            </div>
          </div>

          {/* Table Container */}
          <div className="p-6 rounded-xl bg-[#0B2342] border border-[#168BFF]/20 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-72">
                  <input
                    type="text"
                    placeholder="Search teams, leads, tracks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#06152B] border border-[#168BFF]/25 rounded-lg text-xs py-2 px-3 text-[#F5F7FC] placeholder-[#B9C7D9]/50 focus:outline-none focus:ring-1 focus:ring-[#168BFF]"
                  />
                  <Search className="w-3.5 h-3.5 text-[#B9C7D9] absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <SecondaryButton
                  onClick={() => addToast('Synchronized with Supabase DB replica.', 'info')}
                  icon={<RefreshCw className="w-3.5 h-3.5" />}
                  variant="surface"
                >
                  Sync DB
                </SecondaryButton>
                <SecondaryButton
                  onClick={() => setIsAuthenticated(false)}
                  variant="outline"
                >
                  Lock
                </SecondaryButton>
              </div>
            </div>

            {/* Registrations Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#168BFF]/20 text-[#B9C7D9] uppercase font-mono tracking-wider">
                    <th className="py-3 px-4">Reg ID</th>
                    <th className="py-3 px-4">Team</th>
                    <th className="py-3 px-4">Team Leader</th>
                    <th className="py-3 px-4">Institution</th>
                    <th className="py-3 px-4">Track</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#168BFF]/10 text-[#F5F7FC]">
                  {filteredRegistrations.map((row) => (
                    <tr key={row.id} className="hover:bg-[#06152B]/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-semibold text-[#168BFF]">{row.id}</td>
                      <td className="py-3.5 px-4 font-bold">{row.teamName}</td>
                      <td className="py-3.5 px-4">{row.leadName}</td>
                      <td className="py-3.5 px-4 text-[#B9C7D9]">{row.institution}</td>
                      <td className="py-3.5 px-4">{row.track}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`font-mono px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            row.status === 'confirmed'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : row.status === 'shortlisted'
                              ? 'bg-[#168BFF]/20 text-[#168BFF]'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};
