import React from 'react';
import { PageContainer } from '../components/ui/PageContainer';
import { Check, Download, Mail, Star, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';

export const SponsorsPage: React.FC = () => {
  const tiers = [
    {
      name: 'Title Partner',
      badge: 'Exclusive',
      description: 'Maximum brand presence, naming rights ("PokeThon powered by [Brand]"), keynote address, and first-access talent hiring booth.',
      features: [
        'Exclusive Event Co-Branding Across All Media',
        '15-Minute Keynote Slot at Opening Ceremony',
        'Dedicated Track Bounty & Judging Rights',
        'Dedicated Prime Recruiter Booth & Resume Book',
        'VIP Dinner with Institution Leadership',
      ],
      isPopular: true,
    },
    {
      name: 'Platinum Partner',
      badge: 'High Impact',
      description: 'High visibility, branded problem statement, product demonstration workshop, and premier recruitment access.',
      features: [
        'Dedicated Product Tech Talk Workshop (45 Mins)',
        'Track Partner Recognition with Custom Prize',
        'Full Student Resume & GitHub Database Access',
        'Premium Swag Bag Distribution Placement',
        'Mentor & Jury Seat on Evaluation Panel',
      ],
      isPopular: false,
    },
    {
      name: 'Gold Partner',
      badge: 'Targeted',
      description: 'Direct engagement with top student hackers, API/tool adoption push, and recruitment booth.',
      features: [
        'API / Tool Adoption Challenge & Mentorship Booth',
        'Direct Access to Participant Resumes',
        'Prominent Logo on Hackathon Stage & Website',
        'Social Media Feature Across Club Channels',
      ],
      isPopular: false,
    },
  ];

  return (
    <PageContainer
      badge="Partnership Prospectus"
      title="Sponsor PokeThon 2026"
      description="Connect directly with 300+ ambitious developers, creators, and engineers from PW IOI and premier technology institutes across India."
      maxWidth="xl"
    >
      {/* Overview Card */}
      <div className="p-8 rounded-xl bg-[#0B2342] border border-[#168BFF]/20 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-[#F5F7FC]">Looking to partner with our 2026 Sprint?</h3>
          <p className="text-sm text-[#B9C7D9] max-w-2xl">
            We offer tailored sponsorship tiers designed to meet your talent recruitment, developer advocacy, and brand awareness goals.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link to="/contact">
            <PrimaryButton variant="yellow" icon={<Mail className="w-4 h-4" />}>
              Contact Sponsorship Lead
            </PrimaryButton>
          </Link>
          <a href="#tiers">
            <SecondaryButton variant="surface">
              Explore Tiers
            </SecondaryButton>
          </a>
        </div>
      </div>

      {/* Tier Cards */}
      <div id="tiers" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {tiers.map((tier, idx) => (
          <div
            key={idx}
            className={`p-6 sm:p-8 rounded-xl flex flex-col justify-between transition-all ${
              tier.isPopular
                ? 'bg-[#0B2342] border-2 border-[#FFD83D] shadow-[0_0_30px_rgba(255,216,61,0.15)]'
                : 'bg-[#0B2342]/70 border border-[#168BFF]/20'
            }`}
          >
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#168BFF]">
                  {tier.badge}
                </span>
                {tier.isPopular && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-[#06152B] bg-[#FFD83D] px-2 py-0.5 rounded">
                    <Star className="w-3 h-3 fill-current" />
                    Marquee
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-black text-[#F5F7FC] mb-2">{tier.name}</h3>
              <p className="text-xs text-[#B9C7D9] leading-relaxed mb-6">{tier.description}</p>

              <div className="space-y-2.5 pt-4 border-t border-[#168BFF]/15">
                {tier.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-2.5 text-xs text-[#F5F7FC]">
                    <Check className="w-4 h-4 text-[#168BFF] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 mt-6">
              <Link to="/contact" className="w-full">
                <PrimaryButton
                  variant={tier.isPopular ? 'yellow' : 'blue'}
                  fullWidth
                >
                  Request Tier Brochure
                </PrimaryButton>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
};
