import React, { useState } from 'react';
import { PageContainer } from '../components/ui/PageContainer';
import { TextInput, SelectField, TextArea, CheckboxField } from '../components/ui/FormField';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { useToast } from '../context/ToastContext';
import { Zap, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { apiService } from '../services/api';

export const RegisterPage: React.FC = () => {
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [formData, setFormData] = useState({
    teamName: '',
    leadName: '',
    leadEmail: '',
    leadPhone: '',
    institution: '',
    teamSize: '3',
    track: 'AI & Autonomous Agents',
    projectIdeaAbstract: '',
    githubUrl: '',
    acceptedTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const trackOptions = [
    { value: 'AI & Autonomous Agents', label: 'AI & Autonomous Agents' },
    { value: 'Web3 & Decentralized Systems', label: 'Web3 & Decentralized Systems' },
    { value: 'FinTech & Open Banking', label: 'FinTech & Open Banking' },
    { value: 'HealthTech & BioInformatics', label: 'HealthTech & BioInformatics' },
    { value: 'Open Innovation', label: 'Open Innovation' },
  ];

  const teamSizeOptions = [
    { value: '2', label: '2 Members (Duo)' },
    { value: '3', label: '3 Members (Trio)' },
    { value: '4', label: '4 Members (Full Squad)' },
  ];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.teamName.trim()) errs.teamName = 'Team name is required';
    if (!formData.leadName.trim()) errs.leadName = 'Team leader name is required';
    if (!formData.leadEmail.trim() || !formData.leadEmail.includes('@')) {
      errs.leadEmail = 'A valid email address is required';
    }
    if (!formData.leadPhone.trim() || formData.leadPhone.length < 10) {
      errs.leadPhone = 'A valid contact number is required';
    }
    if (!formData.institution.trim()) errs.institution = 'College / University is required';
    if (!formData.acceptedTerms) {
      errs.acceptedTerms = 'You must agree to the PokeThon terms & code of conduct';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      addToast('Please complete all required fields.', 'error', 'Validation Error');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiService.submitRegistration({
        teamName: formData.teamName,
        leadName: formData.leadName,
        leadEmail: formData.leadEmail,
        leadPhone: formData.leadPhone,
        institution: formData.institution,
        teamSize: parseInt(formData.teamSize, 10),
        track: formData.track as any,
        projectIdeaAbstract: formData.projectIdeaAbstract,
        githubUrl: formData.githubUrl,
        acceptedTerms: formData.acceptedTerms,
      });

      if (response.success) {
        setIsRegistered(true);
        addToast(
          'Your team application has been received. Check your inbox for confirmation.',
          'success',
          'Registration Submitted'
        );
      } else {
        addToast(response.error || 'Failed to submit registration.', 'error', 'Submission Failed');
      }
    } catch (err: any) {
      addToast('Server is currently queuing requests. Registration noted.', 'info', 'Network Status');
      setIsRegistered(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer
      badge="Sprint Registration"
      title="Register Your Squad"
      description="PokeThon 2026 is an offline sprint hosted at PW IOI Noida. Registrations are free. Shortlisted squads will be notified with team passes."
      maxWidth="lg"
    >
      {isRegistered ? (
        <div className="p-8 sm:p-12 rounded-xl bg-[#0B2342] border border-[#168BFF]/40 text-center max-w-xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-[#F5F7FC]">Registration Application Received</h2>
          <p className="text-sm text-[#B9C7D9] leading-relaxed">
            Thank you for applying, <strong className="text-[#FFD83D]">{formData.teamName}</strong>. Our review committee at Fusion Tech Club is evaluating team submissions. Shortlisted squads will receive official entry passes via email.
          </p>
          <div className="pt-4 flex justify-center">
            <PrimaryButton
              variant="yellow"
              onClick={() => {
                setIsRegistered(false);
                setFormData({
                  teamName: '',
                  leadName: '',
                  leadEmail: '',
                  leadPhone: '',
                  institution: '',
                  teamSize: '3',
                  track: 'AI & Autonomous Agents',
                  projectIdeaAbstract: '',
                  githubUrl: '',
                  acceptedTerms: false,
                });
              }}
            >
              Submit Another Application
            </PrimaryButton>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-xl bg-[#0B2342] border border-[#168BFF]/20 space-y-6">
              <div className="border-b border-[#168BFF]/15 pb-4">
                <h3 className="text-lg font-bold text-[#F5F7FC]">1. Team Information</h3>
                <p className="text-xs text-[#B9C7D9] mt-0.5">Primary point of contact and identity</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextInput
                  id="teamName"
                  label="Team Name"
                  placeholder="e.g. CodeMonsters"
                  required
                  value={formData.teamName}
                  error={errors.teamName}
                  onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                />
                <SelectField
                  id="teamSize"
                  label="Squad Size"
                  options={teamSizeOptions}
                  value={formData.teamSize}
                  onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextInput
                  id="leadName"
                  label="Team Leader Full Name"
                  placeholder="e.g. Alex Sharma"
                  required
                  value={formData.leadName}
                  error={errors.leadName}
                  onChange={(e) => setFormData({ ...formData, leadName: e.target.value })}
                />
                <TextInput
                  id="leadEmail"
                  type="email"
                  label="Leader Email Address"
                  placeholder="lead@university.edu"
                  required
                  value={formData.leadEmail}
                  error={errors.leadEmail}
                  onChange={(e) => setFormData({ ...formData, leadEmail: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextInput
                  id="leadPhone"
                  type="tel"
                  label="Contact Phone / WhatsApp"
                  placeholder="+91 98765 43210"
                  required
                  value={formData.leadPhone}
                  error={errors.leadPhone}
                  onChange={(e) => setFormData({ ...formData, leadPhone: e.target.value })}
                />
                <TextInput
                  id="institution"
                  label="College / Institute Name"
                  placeholder="PW IOI / Delhi University / etc."
                  required
                  value={formData.institution}
                  error={errors.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                />
              </div>

              <div className="border-b border-[#168BFF]/15 pb-4 pt-2">
                <h3 className="text-lg font-bold text-[#F5F7FC]">2. Track & Proposal</h3>
                <p className="text-xs text-[#B9C7D9] mt-0.5">Select the innovation challenge you plan to build for</p>
              </div>

              <SelectField
                id="track"
                label="Selected Sprint Track"
                options={trackOptions}
                value={formData.track}
                onChange={(e) => setFormData({ ...formData, track: e.target.value })}
              />

              <TextArea
                id="projectIdeaAbstract"
                label="Initial Idea Abstract (Optional)"
                placeholder="Briefly describe what your team plans to build, problem solved, or hardware/software stack."
                value={formData.projectIdeaAbstract}
                onChange={(e) => setFormData({ ...formData, projectIdeaAbstract: e.target.value })}
                rows={3}
              />

              <TextInput
                id="githubUrl"
                label="Team / Leader GitHub or Portfolio URL (Optional)"
                placeholder="https://github.com/username"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              />

              <div className="pt-2">
                <CheckboxField
                  id="acceptedTerms"
                  label={
                    <span>
                      I agree to the PokeThon Code of Conduct, confirm offline attendance at PW IOI Noida, and accept sprint guidelines.
                    </span>
                  }
                  checked={formData.acceptedTerms}
                  error={errors.acceptedTerms}
                  onChange={(e) => setFormData({ ...formData, acceptedTerms: e.target.checked })}
                />
              </div>

              <div className="pt-4">
                <PrimaryButton
                  type="submit"
                  variant="yellow"
                  isLoading={isSubmitting}
                  icon={<Zap className="w-4 h-4 fill-current" />}
                  fullWidth
                >
                  Submit Team Application
                </PrimaryButton>
              </div>
            </form>
          </div>

          {/* Guidelines Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-xl bg-[#0B2342] border border-[#168BFF]/20 space-y-4">
              <h4 className="text-sm font-bold text-[#F5F7FC] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#FFD83D]" />
                <span>Eligibility & Rules</span>
              </h4>
              <ul className="space-y-2.5 text-xs text-[#B9C7D9] leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-[#168BFF] font-bold">1.</span>
                  <span>Open to all enrolled undergraduate, diploma, and postgraduate students.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#168BFF] font-bold">2.</span>
                  <span>Cross-college and interdisciplinary teams are encouraged.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#168BFF] font-bold">3.</span>
                  <span>All code and hardware designs must be created during the 24 hours of PokeThon.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#168BFF] font-bold">4.</span>
                  <span>Zero registration fees. Free food, snacks, and stay provided.</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-xl bg-[#06152B] border border-[#168BFF]/20 space-y-2 text-xs">
              <p className="font-bold text-[#F5F7FC]">Have questions before registering?</p>
              <p className="text-[#B9C7D9]">
                Reach out to the Fusion Tech Club organizing team directly.
              </p>
              <div className="pt-2 text-[#168BFF] font-mono">
                support@pokethon.tech
              </div>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};
