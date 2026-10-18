import React from 'react';
import { PageContainer } from '../components/ui/PageContainer';
import { Building2, Cpu, Globe2, Sparkles, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PrimaryButton } from '../components/ui/PrimaryButton';

export const PartnersPage: React.FC = () => {
  return (
    <PageContainer
      badge="Alliances & Network"
      title="Academic & Strategic Partners"
      description="PokeThon is backed by institutional rigor and industry expertise. Meet the organizations powering our 2026 sprint."
      maxWidth="xl"
    >
      <div className="space-y-12 mb-16">
        {/* Host Institution Marquee */}
        <div className="p-8 sm:p-10 rounded-xl bg-[#0B2342] border border-[#168BFF]/30 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-[#06152B] border border-[#168BFF]/40 flex items-center justify-center text-[#168BFF]">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FFD83D]">
                  Host Institution & Venue
                </span>
                <h3 className="text-2xl font-black text-[#F5F7FC]">PW Institute of Innovation</h3>
              </div>
            </div>
            <div className="text-xs font-mono text-[#168BFF] md:text-right">
              Campus Sector 62 · Noida, UP
            </div>
          </div>
          <p className="text-sm leading-relaxed text-[#B9C7D9]">
            PW Institute of Innovation provides world-class educational infrastructure, advanced engineering labs, and a vibrant community of passionate learners. As the host venue for PokeThon 2026, PW IOI provides high-speed enterprise connectivity, state-of-the-art auditorium spaces, and 24-hour campus security for all participants.
          </p>
        </div>

        {/* Strategic Domains */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-[#0B2342]/60 border border-[#168BFF]/20 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-[#06152B] border border-[#168BFF]/30 flex items-center justify-center text-[#168BFF]">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-[#F5F7FC]">Technology & Cloud</h4>
            <p className="text-xs text-[#B9C7D9] leading-relaxed">
              Cloud compute credits, API quotas, and platform SDKs provided to hacker teams during the 24-hour building period.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#0B2342]/60 border border-[#FFD83D]/25 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-[#06152B] border border-[#FFD83D]/40 flex items-center justify-center text-[#FFD83D]">
              <Globe2 className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-[#F5F7FC]">Outreach & Media</h4>
            <p className="text-xs text-[#B9C7D9] leading-relaxed">
              Curated tech publications, newsletter networks, and student media syndicates broadcasting live hackathon milestones.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#0B2342]/60 border border-[#168BFF]/20 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-[#06152B] border border-[#168BFF]/30 flex items-center justify-center text-[#168BFF]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-[#F5F7FC]">Incubation & Grants</h4>
            <p className="text-xs text-[#B9C7D9] leading-relaxed">
              Accelerators and angel syndicates offering pre-seed mentorship and fast-track interviews for winning teams.
            </p>
          </div>
        </div>

        {/* Partnership Inquiry Card */}
        <div className="p-8 rounded-xl bg-[#0B2342] border border-[#168BFF]/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-[#F5F7FC]">Interested in an Institutional Partnership?</h4>
            <p className="text-xs text-[#B9C7D9]">We welcome academic research groups, tech foundations, and tooling platforms.</p>
          </div>
          <Link to="/contact">
            <PrimaryButton variant="blue">Connect with Partnerships</PrimaryButton>
          </Link>
        </div>
      </div>
    </PageContainer>
  );
};
