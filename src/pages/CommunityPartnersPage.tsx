import React from 'react';
import { PageContainer } from '../components/ui/PageContainer';
import { Users, Heart, Share2, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PrimaryButton } from '../components/ui/PrimaryButton';

export const CommunityPartnersPage: React.FC = () => {
  const perks = [
    {
      title: 'Guaranteed Hacker Allocations',
      desc: 'Exclusive reserved slots for your top members to skip the general waitlist and attend the offline sprint.',
      icon: <Users className="w-5 h-5 text-[#FFD83D]" />,
    },
    {
      title: 'Community Co-Branding',
      desc: 'Your club logo featured prominently across PokeThon materials, digital passes, and event stage backdrops.',
      icon: <Share2 className="w-5 h-5 text-[#168BFF]" />,
    },
    {
      title: 'Recognition & Leadership Accolades',
      desc: 'Special recognition certificates for community leads and priority invitations to future Fusion Tech Club summits.',
      icon: <Award className="w-5 h-5 text-[#FFD83D]" />,
    },
  ];

  return (
    <PageContainer
      badge="Ecosystem Growth"
      title="Community Partners"
      description="PokeThon thrives on student-led synergy. We collaborate with developer circles, university clubs, and open-source groups nationwide."
      maxWidth="xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        <div className="lg:col-span-8 space-y-8">
          <div className="p-8 rounded-xl bg-[#0B2342] border border-[#168BFF]/20 space-y-4">
            <h2 className="text-2xl font-bold text-[#F5F7FC]">Uniting Tech Communities Across India</h2>
            <p className="text-sm leading-relaxed text-[#B9C7D9]">
              Are you the lead of a college coding society, design collective, or open-source community? Join PokeThon as an official Community Partner. Empower your peers with direct access to mentors, compute resources, and a 24-hour sprint at PW IOI Noida.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {perks.map((p, i) => (
              <div key={i} className="p-6 rounded-xl bg-[#0B2342]/70 border border-[#168BFF]/20 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-[#06152B] border border-[#168BFF]/30 flex items-center justify-center">
                  {p.icon}
                </div>
                <h3 className="text-base font-bold text-[#F5F7FC]">{p.title}</h3>
                <p className="text-xs text-[#B9C7D9] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>

          {/* Call to action box */}
          <div className="p-8 rounded-xl bg-gradient-to-r from-[#0B2342] to-[#081a33] border border-[#168BFF]/30 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-[#F5F7FC]">Register Your Community</h3>
              <p className="text-xs text-[#B9C7D9] mt-1">Applications are reviewed within 48 hours by the Fusion Tech outreach team.</p>
            </div>
            <Link to="/contact">
              <PrimaryButton variant="yellow" icon={<ArrowRight className="w-4 h-4" />}>
                Apply as Partner
              </PrimaryButton>
            </Link>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-xl bg-[#0B2342] border border-[#168BFF]/20 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#168BFF]">
              <Heart className="w-4 h-4 text-rose-400 fill-current" />
              <span>Partner Community Network</span>
            </div>
            <h4 className="text-lg font-bold text-[#F5F7FC]">Who Can Join?</h4>
            <ul className="space-y-2 text-xs text-[#B9C7D9] leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-[#FFD83D]">•</span>
                <span>University coding & engineering societies</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FFD83D]">•</span>
                <span>Developer Student Clubs (GDSC, ACM, IEEE chapters)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FFD83D]">•</span>
                <span>Open source guilds & tech Discord communities</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FFD83D]">•</span>
                <span>AI & Web3 student hacker groups</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
