import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight, Sparkles, Building2, Terminal, Code2, Palette, Cpu, Lightbulb, Users } from 'lucide-react';
import { AboutHeroScene } from '../components/3d/AboutHeroScene';
import { VisionScene } from '../components/3d/VisionScene';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';

export const AboutPage: React.FC = () => {
  const scrollToVision = () => {
    const el = document.getElementById('vision');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const experiencePillars = [
    {
      keyword: 'BUILD',
      tagline: 'From Concept to Execution',
      desc: 'Transform ideas into prototypes and working solutions. Rapidly engineer tangible software repositories and hardware rigs within 24 hours of focused teamwork.',
      color: '#168BFF',
    },
    {
      keyword: 'EXPLORE',
      tagline: 'Pushing Frontiers',
      desc: 'Experiment with emerging technologies and new approaches. Test bleeding-edge AI models, decentralization protocols, and novel hardware toolchains.',
      color: '#FFD83D',
    },
    {
      keyword: 'COLLABORATE',
      tagline: 'Radical Synergy',
      desc: 'Work with people from different backgrounds and disciplines. Pair engineers with designers and domain thinkers to solve multifaceted challenges.',
      color: '#168BFF',
    },
    {
      keyword: 'REPEAT',
      tagline: 'Relentless Evolution',
      desc: 'Learn from experimentation, improve ideas, and keep building. Carry the prototypes and shared camaraderie beyond the sprint into real ventures.',
      color: '#FFD83D',
    },
  ];

  const audienceGroups = [
    {
      role: 'Students',
      icon: <Users className="w-5 h-5 text-[#168BFF]" />,
      desc: 'Bring boundless curiosity, raw coding energy, and fresh perspectives to challenge established paradigms and build ambitious new tools.',
    },
    {
      role: 'Developers',
      icon: <Terminal className="w-5 h-5 text-[#FFD83D]" />,
      desc: 'Architect robust system backends, write clean APIs, interface with compute nodes, and ship functional software under sprint pressure.',
    },
    {
      role: 'Designers',
      icon: <Palette className="w-5 h-5 text-[#168BFF]" />,
      desc: 'Shape intuitive user interfaces, craft human-centric workflows, and ensure complex technical architectures become effortlessly usable.',
    },
    {
      role: 'AI Enthusiasts',
      icon: <Cpu className="w-5 h-5 text-[#FFD83D]" />,
      desc: 'Deploy autonomous agent workflows, fine-tune models, test multimodal interfaces, and integrate intelligent reasoning into real products.',
    },
    {
      role: 'Innovators',
      icon: <Lightbulb className="w-5 h-5 text-[#168BFF]" />,
      desc: 'Synthesize real-world problem statements, validate user viability, and guide prototype roadmaps toward lasting practical impact.',
    },
  ];

  return (
    <div className="relative w-full bg-[#06152B] text-[#F5F7FC] overflow-x-hidden">
      {/* ============================================================ */}
      {/* 1. ABOUT HERO SECTION (WITH 3D INNOVATION SCENE)             */}
      {/* ============================================================ */}
      <section className="relative min-h-[90vh] flex items-center pt-28 pb-16 overflow-hidden">
        {/* 3D Background */}
        <div className="absolute inset-0 z-0 pointer-events-none md:pointer-events-auto">
          <AboutHeroScene className="w-full h-full" />
        </div>

        {/* Contrast Scrims */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#06152B] via-[#06152B]/85 to-transparent pointer-events-none lg:w-3/5" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#06152B] via-transparent to-transparent pointer-events-none h-36 bottom-0" />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl space-y-6">
            {/* Small Label */}
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest uppercase text-[#168BFF]">
              <span>DISCOVER POKETHON</span>
              <span aria-hidden="true" className="text-[#FFD83D]">·</span>
              <span className="text-[#B9C7D9]">PW IOI NOIDA</span>
            </div>

            {/* Main Heading & Second Line */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.02]">
              MORE THAN A HACKATHON.
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#168BFF] via-[#5db1ff] to-[#FFD83D] mt-1">
                IT'S AN INNOVATION SPRINT.
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-[#B9C7D9] leading-relaxed max-w-xl">
              PokeThon is a 24-hour offline innovation sprint organized by Fusion Tech Club at PW Institute of Innovation, Noida. It brings together students, developers, designers, AI enthusiasts, and innovators to collaborate, experiment with technology, and build real-world solutions.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link to="/register">
                <PrimaryButton variant="yellow" icon={<Zap className="w-4 h-4 fill-current" />}>
                  Register Now
                </PrimaryButton>
              </Link>
              <SecondaryButton
                variant="surface"
                onClick={scrollToVision}
                icon={<ArrowRight className="w-4 h-4 text-[#168BFF]" />}
              >
                Explore Our Vision
              </SecondaryButton>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. WHAT IS POKETHON? (EDITORIAL TWO-COLUMN)                 */}
      {/* ============================================================ */}
      <section className="py-24 bg-[#040e1d] border-y border-[#168BFF]/15 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Editorial Content */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#168BFF]">
                Core Purpose
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#F5F7FC] tracking-tight">
                What Is PokeThon?
              </h2>

              <div className="space-y-4 text-base sm:text-lg text-[#B9C7D9] leading-relaxed">
                <p>
                  PokeThon is a <strong className="text-[#FFD83D] font-bold">24-hour offline innovation sprint</strong> organized by <strong className="text-[#F5F7FC] font-bold">Fusion Tech Club</strong> at <strong className="text-[#168BFF] font-bold">PW Institute of Innovation, Noida</strong>.
                </p>
                <p>
                  It brings together students, developers, designers, AI enthusiasts, and innovators in an environment focused on <strong className="text-[#FFD83D] font-bold">creativity, experimentation, and collaboration</strong>.
                </p>
                <p>
                  The goal is to <strong className="text-[#168BFF] font-bold">transform ideas into working solutions</strong> through teamwork and emerging technologies.
                </p>
              </div>

              <div className="pt-4 grid grid-cols-2 gap-4 border-t border-[#168BFF]/20 max-w-md">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-[#FFD83D] font-mono">24 Hours</div>
                  <div className="text-xs text-[#B9C7D9] mt-0.5">Non-stop offline sprint</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-[#168BFF] font-mono">PW IOI Campus</div>
                  <div className="text-xs text-[#B9C7D9] mt-0.5">Noida Sector 62, UP</div>
                </div>
              </div>
            </div>

            {/* Right Column: Event Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-[#168BFF]/30 bg-[#0B2342] shadow-2xl group">
                <img
                  src="/src/assets/images/pokethon_hero_stage_1792351095926.jpg"
                  alt="PokeThon Sprint at PW Institute of Innovation Noida"
                  className="w-full h-80 sm:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06152B] via-transparent to-transparent opacity-85" />

                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#06152B]/90 backdrop-blur-md border border-[#168BFF]/25">
                  <div className="text-xs font-mono text-[#FFD83D] uppercase">
                    Fusion Tech Club
                  </div>
                  <div className="text-sm font-bold text-[#F5F7FC] mt-0.5">
                    PW Institute of Innovation, Noida
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. OUR VISION SECTION (WITH 3D VISION SCENE)                 */}
      {/* ============================================================ */}
      <section id="vision" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left 3D Vision Sculpture */}
            <div className="lg:col-span-5 relative order-2 lg:order-1">
              <div className="relative rounded-2xl bg-[#0B2342]/70 border border-[#168BFF]/30 p-2 shadow-2xl overflow-hidden">
                <VisionScene className="w-full h-[380px]" />
                <div className="absolute bottom-3 left-4 right-4 text-center text-xs font-mono text-[#B9C7D9]/70">
                  Four Pillars: Innovation · Collaboration · Technology · Execution
                </div>
              </div>
            </div>

            {/* Right Vision Narrative */}
            <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#168BFF]">
                Our Vision
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#F5F7FC] tracking-tight leading-tight">
                Turn Bold Ideas Into Real-World Solutions.
              </h2>

              <p className="text-base sm:text-lg text-[#B9C7D9] leading-relaxed">
                Our vision is to provide a platform where diverse minds come together to experiment with emerging technologies, collaborate across disciplines, and turn ideas into working products.
              </p>

              <div className="p-6 rounded-xl bg-[#0B2342] border border-[#168BFF]/20 space-y-2">
                <h4 className="text-sm font-bold text-[#FFD83D] flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>The Spirit of Relentless Prototyping</span>
                </h4>
                <p className="text-xs sm:text-sm text-[#B9C7D9] leading-relaxed">
                  We believe that the most transformative software and hardware breakthroughs happen when student creators are given true autonomy, world-class compute, and the freedom to experiment without fear of failure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. THE POKETHON EXPERIENCE (BUILD. EXPLORE. COLLABORATE. REPEAT) */}
      {/* ============================================================ */}
      <section className="py-24 bg-[#040e1d] border-y border-[#168BFF]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FFD83D]">
              The Sprint Methodology
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#F5F7FC] tracking-tight mt-2">
              Build. Explore. Collaborate. Repeat.
            </h2>
            <p className="text-base text-[#B9C7D9] mt-3">
              The continuous rhythm that drives every team from kickoff to final deployment.
            </p>
          </div>

          {/* Continuous Integrated Flow (avoiding 4 identical small cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {experiencePillars.map((pillar, idx) => (
              <div
                key={idx}
                className="relative p-8 rounded-2xl bg-[#0B2342] border border-[#168BFF]/20 flex flex-col justify-between group hover:border-[#168BFF]/60 transition-all duration-300 shadow-xl"
              >
                {/* Yellow accent marker */}
                <div
                  className="w-12 h-1 rounded-full mb-6 transition-all group-hover:w-16"
                  style={{ backgroundColor: pillar.color }}
                />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black text-[#F5F7FC] tracking-tight">
                      {pillar.keyword}
                    </h3>
                    <span className="text-xs font-mono text-[#B9C7D9]/60">0{idx + 1}</span>
                  </div>

                  <div className="text-xs font-semibold text-[#FFD83D]">
                    {pillar.tagline}
                  </div>

                  <p className="text-xs sm:text-sm text-[#B9C7D9] leading-relaxed pt-2">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-[#168BFF]/10 text-[11px] font-mono text-[#168BFF]">
                  Phase {idx + 1} Velocity
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. WHO IS IT FOR?                                            */}
      {/* ============================================================ */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#168BFF]">
              Multidisciplinary Participation
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#F5F7FC] tracking-tight mt-2">
              Different Skills. One Shared Mission.
            </h2>
            <p className="text-base text-[#B9C7D9] mt-3">
              PokeThon gathers five complementary profiles to foster cross-pollination and robust problem-solving.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {audienceGroups.map((group, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl bg-[#0B2342] border border-[#168BFF]/20 flex flex-col justify-between hover:border-[#FFD83D]/50 transition-colors shadow-lg"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-lg bg-[#06152B] border border-[#168BFF]/30 flex items-center justify-center">
                    {group.icon}
                  </div>
                  <h3 className="text-lg font-bold text-[#F5F7FC]">{group.role}</h3>
                  <p className="text-xs text-[#B9C7D9] leading-relaxed">{group.desc}</p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#168BFF]/15 text-[10px] font-mono text-[#FFD83D]">
                  Role #{idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. EVENT HIGHLIGHTS (FACTUAL FROM PRESENTATION)             */}
      {/* ============================================================ */}
      <section className="py-16 bg-[#040e1d] border-y border-[#168BFF]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-[#168BFF]/15">
            <div className="pt-4 sm:pt-0 sm:px-6 first:pl-0 space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-[#168BFF]">
                Event Format
              </span>
              <p className="text-xl sm:text-2xl font-black text-[#F5F7FC]">
                24-Hour Offline Innovation Sprint
              </p>
            </div>

            <div className="pt-4 sm:pt-0 sm:px-6 space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-[#168BFF]">
                Organizer
              </span>
              <p className="text-xl sm:text-2xl font-black text-[#F5F7FC]">
                Fusion Tech Club
              </p>
            </div>

            <div className="pt-4 sm:pt-0 sm:px-6 space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-[#168BFF]">
                Location
              </span>
              <p className="text-xl sm:text-2xl font-black text-[#F5F7FC]">
                PW Institute of Innovation, Noida
              </p>
            </div>

            <div className="pt-4 sm:pt-0 sm:px-6 space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-[#FFD83D]">
                Community Scale
              </span>
              <p className="text-xl sm:text-2xl font-black text-[#FFD83D]">
                2,000+ Participants
              </p>
              <span className="text-[11px] text-[#B9C7D9]/70 font-mono block">
                As described in the presentation
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. WHY PARTNER WITH POKETHON?                               */}
      {/* ============================================================ */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-[#0B2342] via-[#081a33] to-[#0B2342] border border-[#168BFF]/30 flex flex-col lg:flex-row items-center justify-between gap-10 shadow-2xl">
            <div className="space-y-4 max-w-2xl">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#168BFF]">
                Strategic Collaboration
              </span>

              <h2 className="text-3xl sm:text-4xl font-black text-[#F5F7FC] tracking-tight">
                Connect With a Community That Builds.
              </h2>

              <p className="text-sm sm:text-base text-[#B9C7D9] leading-relaxed">
                PokeThon creates a connection with a young, digitally engaged audience. Sponsors can use the platform to increase brand visibility, support product adoption, explore recruitment opportunities, and engage with the innovation community.
              </p>
            </div>

            <div className="shrink-0">
              <Link to="/sponsors">
                <PrimaryButton variant="yellow" icon={<ArrowRight className="w-4 h-4" />}>
                  Explore Sponsorship Opportunities
                </PrimaryButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. FINAL CALL TO ACTION                                      */}
      {/* ============================================================ */}
      <section className="py-24 bg-gradient-to-b from-[#040e1d] to-[#06152B] border-t border-[#168BFF]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest uppercase text-[#FFD83D]">
              <Sparkles className="w-4 h-4 fill-current" />
              <span>PokeThon 2026</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#F5F7FC] tracking-tight">
              READY TO BUILD SOMETHING MEANINGFUL?
            </h2>

            <p className="text-base sm:text-lg text-[#B9C7D9] leading-relaxed">
              Bring your curiosity, explore new possibilities, and collaborate with fellow innovators at PokeThon.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link to="/register">
                <PrimaryButton variant="yellow" icon={<Zap className="w-4 h-4 fill-current" />}>
                  Register Now
                </PrimaryButton>
              </Link>
              <Link to="/events">
                <SecondaryButton variant="surface">
                  Explore Past Events
                </SecondaryButton>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
