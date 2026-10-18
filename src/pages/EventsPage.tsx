import React from 'react';
import { PageContainer } from '../components/ui/PageContainer';
import { Cpu, Shield, Coins, HeartPulse, Sparkles, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PrimaryButton } from '../components/ui/PrimaryButton';

export const EventsPage: React.FC = () => {
  const tracks = [
    {
      title: 'AI & Autonomous Agents',
      icon: <Cpu className="w-5 h-5 text-[#FFD83D]" />,
      desc: 'Build multi-agent workflows, multimodal reasoning tools, local edge models, and AI assistants addressing high-friction consumer or industrial challenges.',
      prize: '₹35,000 Bounty',
    },
    {
      title: 'Web3 & Decentralized Systems',
      icon: <Shield className="w-5 h-5 text-[#168BFF]" />,
      desc: 'Smart contracts, zero-knowledge proofs, decentralized identity, cross-chain protocols, and verifiable compute solutions.',
      prize: '₹30,000 Bounty',
    },
    {
      title: 'FinTech & Open Banking',
      icon: <Coins className="w-5 h-5 text-[#FFD83D]" />,
      desc: 'Next-gen fraud detection, UPI algorithmic layers, micro-investing rails, and financial inclusion interfaces.',
      prize: '₹30,000 Bounty',
    },
    {
      title: 'HealthTech & BioInformatics',
      icon: <HeartPulse className="w-5 h-5 text-[#168BFF]" />,
      desc: 'Predictive health monitors, emergency triage dispatchers, telemetry dashboards, and clinical workflow accelerators.',
      prize: '₹30,000 Bounty',
    },
    {
      title: 'Open Innovation',
      icon: <Sparkles className="w-5 h-5 text-[#FFD83D]" />,
      desc: 'Break the boundaries. IoT hardware hacks, developer tools, sustainable smart-city tech, or radical game engines.',
      prize: '₹25,000 Bounty',
    },
  ];

  const schedule = [
    { time: '09:00 AM', title: 'Check-In & Team Kit Distribution', description: 'Arrive at PW IOI Campus, grab your badges, swags, and hack stations.' },
    { time: '11:00 AM', title: 'Opening Ceremony & Keynote', description: 'Welcome addresses by Fusion Tech Club leads and chief guest.' },
    { time: '12:00 PM', title: 'Hacking Period Begins (T-24:00:00)', description: 'Sprint clock starts. Repositories initialized.' },
    { time: '04:00 PM', title: 'Mentorship Checkpoint 1', description: 'Domain mentors review architecture and offer guidance.' },
    { time: '08:00 PM', title: 'Dinner & Tech Break', description: 'Networking dinner, gaming zone, and quick trivia break.' },
    { time: '12:00 AM', title: 'Midnight Snack & Energy Refuel', description: 'Midnight pizza and caffeinated refreshments.' },
    { time: '06:00 AM', title: 'Mentorship Checkpoint 2 (Pitch Polish)', description: 'Final prototype debugging and deck refinement.' },
    { time: '12:00 PM', title: 'Hacking Concludes & Submissions', description: 'Hard stop. Code pushed to GitHub, live demos staged.' },
    { time: '02:00 PM', title: 'Live Pitching & Evaluation', description: 'Finalists present on stage before the jury panel.' },
    { time: '05:00 PM', title: 'Grand Awards & Closing Ceremony', description: 'Prize distribution, certificates, and closing party.' },
  ];

  return (
    <PageContainer
      badge="Tracks & Schedule"
      title="Sprint Challenges & 24H Timeline"
      description="Choose your battleground. Five specialized innovation tracks engineered to ignite ambitious software and hardware builds."
      maxWidth="xl"
    >
      {/* Tracks Section */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#F5F7FC]">5 Innovation Tracks</h2>
            <p className="text-xs text-[#B9C7D9] mt-1">Select one primary track for your team during registration</p>
          </div>
          <Link to="/register">
            <PrimaryButton variant="yellow">Apply for a Track</PrimaryButton>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map((t, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl bg-[#0B2342] border border-[#168BFF]/20 flex flex-col justify-between hover:border-[#168BFF]/60 transition-colors"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-[#06152B] border border-[#168BFF]/30 flex items-center justify-center">
                  {t.icon}
                </div>
                <h3 className="text-lg font-bold text-[#F5F7FC]">{t.title}</h3>
                <p className="text-xs text-[#B9C7D9] leading-relaxed">{t.desc}</p>
              </div>
              <div className="pt-6 mt-4 border-t border-[#168BFF]/15 flex items-center justify-between">
                <span className="text-xs font-mono text-[#FFD83D] font-bold">{t.prize}</span>
                <span className="text-xs text-[#168BFF] font-semibold">Track {idx + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 24-Hour Timeline */}
      <section className="p-8 rounded-xl bg-[#0B2342] border border-[#168BFF]/25 mb-12">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-[#FFD83D] mb-1">
            <Clock className="w-4 h-4" />
            <span>24-Hour Offline Schedule</span>
          </div>
          <h2 className="text-2xl font-bold text-[#F5F7FC]">Sprint Itinerary</h2>
        </div>

        <div className="relative pl-6 border-l-2 border-[#168BFF]/30 space-y-6">
          {schedule.map((item, i) => (
            <div key={i} className="relative group">
              {/* Dot */}
              <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-[#06152B] border-2 border-[#FFD83D] group-hover:bg-[#168BFF] transition-colors" />
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                <span className="text-xs font-mono font-bold text-[#168BFF] shrink-0 w-24">
                  {item.time}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-[#F5F7FC]">{item.title}</h4>
                  <p className="text-xs text-[#B9C7D9] mt-0.5 leading-relaxed">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageContainer>
  );
};
