import React from 'react';
import { PageContainer } from '../components/ui/PageContainer';

export const TermsPage: React.FC = () => {
  return (
    <PageContainer
      badge="Code of Conduct"
      title="Terms & Hackathon Guidelines"
      description="Rules of engagement for participants, mentors, judges, and attendees at PokeThon 2026."
      maxWidth="md"
    >
      <div className="p-8 rounded-xl bg-[#0B2342] border border-[#168BFF]/20 space-y-6 text-sm text-[#B9C7D9] leading-relaxed mb-16">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#F5F7FC]">1. Originality & Integrity</h2>
          <p>
            All core code, smart contracts, architectures, and design prototypes submitted for judging must be authored during the 24-hour sprint window. Open-source libraries, public packages, pre-existing models, and APIs are permitted provided they are credited in your README.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#F5F7FC]">2. Inclusive Code of Conduct</h2>
          <p>
            PokeThon is dedicated to a safe, welcoming, and harassment-free experience for everyone, regardless of gender, sexual orientation, disability, physical appearance, race, ethnicity, or technical experience level.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#F5F7FC]">3. Campus Rules & Security</h2>
          <p>
            Participants must follow all campus safety protocols at PW Institute of Innovation, Noida. Event badges must remain visible at all times. Damage to lab hardware or campus property will result in immediate disqualification and removal.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#F5F7FC]">4. Intellectual Property</h2>
          <p>
            Participants retain 100% full intellectual property ownership of the code, designs, and prototypes they construct during the hackathon.
          </p>
        </section>
      </div>
    </PageContainer>
  );
};
