import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight, Sparkles, Building2, Users2, ShieldCheck, Trophy, Terminal, Award } from 'lucide-react';
import { HeroScene } from '../components/3d/HeroScene';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';

export const HomePage: React.FC = () => {
  const scrollToAbout = () => {
    const target = document.getElementById('about-preview');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const pastEvents = [
    {
      title: 'TechMate 2026',
      category: 'Flagship Hackathon',
      description: 'Competitive algorithmic sprint and full-stack innovation challenge hosted across university technical societies.',
      image: '/src/assets/images/event_techmate_1792351746451.jpg',
    },
    {
      title: 'RIFT Hackathon',
      category: 'Hardware & Systems',
      description: 'Intense 24-hour systems engineering and embedded systems sprint testing autonomous robotics and hardware prototypes.',
      image: '/src/assets/images/event_rift_hackathon_1792351747796.jpg',
    },
    {
      title: 'Snapchat Community Event',
      category: 'AR & Spatial Tech',
      description: 'Immersive augmented reality lens workshop and spatial interface builder sprint in collaboration with developer leaders.',
      image: '/src/assets/images/event_snapchat_event_1792351747191.jpg',
    },
    {
      title: 'Design Fusion — Season 3',
      category: 'Design & UX Sprint',
      description: 'Product architecture and human-computer interaction challenge transforming intricate software into elegant experiences.',
      image: '/src/assets/images/event_design_fusion_1792351747611.jpg',
    },
  ];

  const sponsorTiers = [
    { name: 'Title Sponsorship', highlight: 'Naming Rights & Prime Stage', desc: 'Marquee presence across all event stages, opening keynote, and priority talent recruitment booth.' },
    { name: 'Platinum Sponsorship', highlight: 'Workshop & Tech Tracks', desc: 'Dedicated problem statement track, product adoption workshop, and student resume database access.' },
    { name: 'Gold Sponsorship', highlight: 'Recruitment & Mentorship', desc: 'Active mentor seats on evaluation panel, API adoption challenge, and booth placement.' },
    { name: 'Silver Sponsorship', highlight: 'Community & Swags', desc: 'Brand recognition across media kits, merchandise, and student hacker swag packages.' },
    { name: 'In-Kind Partnerships', highlight: 'Tooling & Compute Credits', desc: 'API credits, cloud resources, hardware testing rigs, and refreshments for all participants.' },
  ];

  return (
    <div className="relative w-full bg-[#06152B] text-[#F5F7FC] overflow-x-hidden">
      {/* ============================================================ */}
      {/* 1. HERO — IMMERSIVE 3D EXPERIENCE                            */}
      {/* ============================================================ */}
      <section className="relative min-h-[92vh] sm:min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
        {/* Full-width 3D Background & Centerpiece Scene */}
        <div className="absolute inset-0 z-0 pointer-events-none md:pointer-events-auto">
          <HeroScene className="w-full h-full" />
        </div>

        {/* Ambient Radial Gradient Scrim to ensure 100% typographic contrast */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#06152B] via-[#06152B]/80 to-transparent pointer-events-none lg:w-3/5" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#06152B] via-transparent to-transparent pointer-events-none h-40 bottom-0" />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl space-y-6">
            {/* Eyebrow Label */}
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono font-bold tracking-widest uppercase text-[#168BFF]">
              <span>FUSION TECH CLUB PRESENTS</span>
              <span aria-hidden="true" className="text-[#FFD83D]">·</span>
              <span className="text-[#B9C7D9]">PW IOI NOIDA</span>
            </div>

            {/* Dominant Main Title */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.98] text-[#F5F7FC]">
              POKE<span className="text-[#FFD83D]">THON</span>
            </h1>

            {/* Tagline */}
            <p className="text-xl sm:text-2xl font-bold tracking-tight text-[#168BFF]">
              Catch Ideas. <span className="text-[#FFD83D]">Build Solutions.</span>
            </p>

            {/* Description */}
            <p className="text-base sm:text-lg text-[#B9C7D9] leading-relaxed max-w-xl text-pretty">
              A 24-hour offline innovation sprint bringing together students, developers, designers, and AI enthusiasts to turn bold ideas into real-world solutions.
            </p>

            {/* Call To Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link to="/register">
                <PrimaryButton variant="yellow" icon={<Zap className="w-4 h-4 fill-current" />}>
                  Register Now
                </PrimaryButton>
              </Link>
              <SecondaryButton
                variant="surface"
                onClick={scrollToAbout}
                icon={<ArrowRight className="w-4 h-4 text-[#168BFF]" />}
              >
                Explore the Experience
              </SecondaryButton>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. EVENT HIGHLIGHTS                                         */}
      {/* ============================================================ */}
      <section className="relative z-20 py-12 bg-[#040e1d] border-y border-[#168BFF]/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-[#168BFF]/15">
            <div className="pt-4 sm:pt-0 sm:px-6 first:pl-0">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#168BFF]">
                Event Format
              </span>
              <p className="text-xl sm:text-2xl font-black text-[#F5F7FC] tracking-tight mt-1">
                24-HOUR INNOVATION SPRINT
              </p>
            </div>

            <div className="pt-4 sm:pt-0 sm:px-6">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#168BFF]">
                Host Location
              </span>
              <p className="text-xl sm:text-2xl font-black text-[#F5F7FC] tracking-tight mt-1">
                NOIDA, INDIA
              </p>
            </div>

            <div className="pt-4 sm:pt-0 sm:px-6">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#168BFF]">
                Organized By
              </span>
              <p className="text-xl sm:text-2xl font-black text-[#F5F7FC] tracking-tight mt-1">
                FUSION TECH CLUB
              </p>
            </div>

            <div className="pt-4 sm:pt-0 sm:px-6">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#FFD83D]">
                Projected Reach
              </span>
              <p className="text-xl sm:text-2xl font-black text-[#FFD83D] tracking-tight mt-1">
                2,000+ PARTICIPANTS
              </p>
              <span className="text-[11px] text-[#B9C7D9]/70 font-mono block mt-0.5">
                As described in the presentation
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. ABOUT POKETHON PREVIEW                                   */}
      {/* ============================================================ */}
      <section id="about-preview" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Visual Composition */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden border border-[#168BFF]/30 bg-[#0B2342] shadow-2xl group">
                <img
                  src="/src/assets/images/pokethon_hero_stage_1792351095926.jpg"
                  alt="PokeThon Sprint Arena"
                  className="w-full h-[380px] sm:h-[450px] object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06152B] via-transparent to-transparent opacity-85" />

                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-[#06152B]/90 backdrop-blur-md border border-[#168BFF]/25">
                  <div className="text-xs font-mono text-[#FFD83D] uppercase tracking-wider">
                    PW Institute of Innovation
                  </div>
                  <div className="text-sm font-bold text-[#F5F7FC] mt-0.5">
                    Offline Technology Sprint & Mentorship Hub
                  </div>
                </div>
              </div>
            </div>

            {/* Right Editorial Text */}
            <div className="lg:col-span-6 space-y-6">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#168BFF]">
                About PokeThon
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#F5F7FC] tracking-tight leading-tight">
                BUILD. EXPLORE. COLLABORATE. REPEAT.
              </h2>

              <p className="text-base sm:text-lg text-[#B9C7D9] leading-relaxed">
                PokeThon is a 24-hour offline innovation sprint designed to bring together passionate builders. Organized by Fusion Tech Club at PW Institute of Innovation, Noida, it creates an environment where students push technical boundaries and transition theoretical knowledge into production-ready prototypes.
              </p>

              <div className="pt-2">
                <Link to="/about">
                  <PrimaryButton variant="yellow" icon={<ArrowRight className="w-4 h-4" />}>
                    Discover PokeThon
                  </PrimaryButton>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. PAST EVENTS PREVIEW                                      */}
      {/* ============================================================ */}
      <section className="py-24 bg-[#040e1d] border-t border-[#168BFF]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#168BFF] mb-2">
                Proven Track Record
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#F5F7FC] tracking-tight">
                Past Flagship Initiatives
              </h2>
            </div>
            <div className="mt-4 md:mt-0">
              <Link to="/events">
                <SecondaryButton variant="surface" icon={<ArrowRight className="w-4 h-4" />}>
                  Explore Past Events
                </SecondaryButton>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pastEvents.map((evt, idx) => (
              <div
                key={idx}
                className="group rounded-2xl overflow-hidden bg-[#0B2342] border border-[#168BFF]/20 hover:border-[#168BFF]/50 transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={evt.image}
                    alt={evt.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B2342] via-transparent to-transparent opacity-80" />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded bg-[#06152B]/85 backdrop-blur-md border border-[#168BFF]/30 text-xs font-mono font-bold text-[#FFD83D]">
                    {evt.category}
                  </div>
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="text-xl font-bold text-[#F5F7FC] group-hover:text-[#168BFF] transition-colors">
                    {evt.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#B9C7D9] leading-relaxed">
                    {evt.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. SPONSORSHIP PREVIEW                                      */}
      {/* ============================================================ */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#168BFF]">
              Sponsorship Opportunities
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#F5F7FC] tracking-tight mt-2">
              PARTNER WITH A GENERATION THAT BUILDS.
            </h2>
            <p className="text-base text-[#B9C7D9] mt-4 leading-relaxed">
              Support the next generation of engineers, gain early recruitment access, and showcase your developer tooling directly to elite student teams.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {sponsorTiers.map((tier, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl bg-[#0B2342] border border-[#168BFF]/20 hover:border-[#168BFF]/45 transition-colors space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#F5F7FC]">{tier.name}</h3>
                  <span className="text-[10px] font-mono text-[#168BFF] uppercase">Tier 0{idx + 1}</span>
                </div>
                <div className="text-xs font-semibold text-[#FFD83D]">{tier.highlight}</div>
                <p className="text-xs text-[#B9C7D9] leading-relaxed">{tier.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-start">
            <Link to="/sponsors">
              <PrimaryButton variant="blue" icon={<ArrowRight className="w-4 h-4" />}>
                Explore Sponsorship Opportunities
              </PrimaryButton>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. COMMUNITY PARTNERS PREVIEW                               */}
      {/* ============================================================ */}
      <section className="py-20 bg-[#040e1d] border-y border-[#168BFF]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-2xl bg-[#0B2342]/70 border border-[#168BFF]/25 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FFD83D]">
                Community Network
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#F5F7FC] tracking-tight">
                BUILD COMMUNITIES. CREATE IMPACT.
              </h2>
              <p className="text-sm sm:text-base text-[#B9C7D9] leading-relaxed">
                We empower university tech clubs, developer circles, and student communities through event cross-promotion, collaborative workshops, and exclusive offline sprint access.
              </p>
            </div>

            <div className="shrink-0">
              <Link to="/community-partners">
                <PrimaryButton variant="yellow" icon={<Users2 className="w-4 h-4" />}>
                  Become a Community Partner
                </PrimaryButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. PREVIOUS PARTNERS SHOWCASE                               */}
      {/* ============================================================ */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#168BFF]">
                Ecosystem Support
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#F5F7FC] tracking-tight mt-1">
                Supported by Industry & Academic Leaders
              </h2>
            </div>
            <div className="mt-4 md:mt-0">
              <Link to="/partners">
                <SecondaryButton variant="outline">
                  View Partners
                </SecondaryButton>
              </Link>
            </div>
          </div>

          {/* Clean horizontal partner marks */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl bg-[#0B2342]/50 border border-[#168BFF]/20 flex flex-col items-center justify-center text-center space-y-2">
              <Building2 className="w-8 h-8 text-[#168BFF]" />
              <p className="text-sm font-bold text-[#F5F7FC]">PW Institute of Innovation</p>
              <p className="text-[11px] text-[#B9C7D9] font-mono">Academic Host</p>
            </div>

            <div className="p-6 rounded-xl bg-[#0B2342]/50 border border-[#FFD83D]/25 flex flex-col items-center justify-center text-center space-y-2">
              <Zap className="w-8 h-8 text-[#FFD83D]" />
              <p className="text-sm font-bold text-[#F5F7FC]">Fusion Tech Club</p>
              <p className="text-[11px] text-[#B9C7D9] font-mono">Organizer</p>
            </div>

            <div className="p-6 rounded-xl bg-[#0B2342]/50 border border-[#168BFF]/20 flex flex-col items-center justify-center text-center space-y-2">
              <ShieldCheck className="w-8 h-8 text-[#168BFF]" />
              <p className="text-sm font-bold text-[#F5F7FC]">Developer Student Guilds</p>
              <p className="text-[11px] text-[#B9C7D9] font-mono">NCR Chapters</p>
            </div>

            <div className="p-6 rounded-xl bg-[#0B2342]/50 border border-[#168BFF]/20 flex flex-col items-center justify-center text-center space-y-2">
              <Trophy className="w-8 h-8 text-[#FFD83D]" />
              <p className="text-sm font-bold text-[#F5F7FC]">Open Innovation Council</p>
              <p className="text-[11px] text-[#B9C7D9] font-mono">Mentorship Network</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. FINAL CALL TO ACTION                                      */}
      {/* ============================================================ */}
      <section className="py-24 bg-gradient-to-b from-[#040e1d] to-[#06152B] border-t border-[#168BFF]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-10 sm:p-16 rounded-3xl bg-gradient-to-r from-[#0B2342] via-[#081a33] to-[#0B2342] border border-[#168BFF]/30 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-radial-glow pointer-events-none" />

            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest uppercase text-[#FFD83D]">
              <Sparkles className="w-4 h-4 fill-current" />
              <span>PokeThon 2026 Sprint</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#F5F7FC] tracking-tight max-w-2xl mx-auto">
              YOUR NEXT BIG IDEA STARTS HERE.
            </h2>

            <p className="text-base sm:text-lg text-[#B9C7D9] max-w-xl mx-auto leading-relaxed">
              Bring your curiosity, connect with fellow innovators, and explore what's possible at PokeThon.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link to="/register">
                <PrimaryButton variant="yellow" icon={<Zap className="w-4 h-4 fill-current" />}>
                  Register Now
                </PrimaryButton>
              </Link>
              <Link to="/contact">
                <SecondaryButton variant="surface">
                  Contact the Team
                </SecondaryButton>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
