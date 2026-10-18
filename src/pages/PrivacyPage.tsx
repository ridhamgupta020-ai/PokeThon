import React from 'react';
import { PageContainer } from '../components/ui/PageContainer';

export const PrivacyPage: React.FC = () => {
  return (
    <PageContainer
      badge="Legal & Trust"
      title="Privacy Policy"
      description="How PokeThon and Fusion Tech Club at PW IOI handle team registrations and participant data."
      maxWidth="md"
    >
      <div className="p-8 rounded-xl bg-[#0B2342] border border-[#168BFF]/20 space-y-6 text-sm text-[#B9C7D9] leading-relaxed mb-16">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#F5F7FC]">1. Information Collection</h2>
          <p>
            When registering for PokeThon 2026, we collect your name, institutional email address, phone/WhatsApp contact, university name, project abstract, and optional portfolio/GitHub links.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#F5F7FC]">2. Purpose of Use</h2>
          <p>
            Your information is used strictly to communicate hackathon logistics, issue offline campus entry badges at PW IOI Noida, verify student status, evaluate project submissions, and connect finalists with recruiting sponsor partners when opted in.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#F5F7FC]">3. Data Security & Storage</h2>
          <p>
            Registration records are securely managed through our backend database with strict role-based access control. We do not sell or monetize personal student data.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#F5F7FC]">4. Contact & Inquiries</h2>
          <p>
            If you wish to update or delete your team record, contact privacy@pokethon.tech or visit our contact page.
          </p>
        </section>
      </div>
    </PageContainer>
  );
};
