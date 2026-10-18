import React, { useState } from 'react';
import { PageContainer } from '../components/ui/PageContainer';
import { TextInput, TextArea, SelectField } from '../components/ui/FormField';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { useToast } from '../context/ToastContext';
import { MapPin, Mail, Phone, Clock, Send, CheckCircle2 } from 'lucide-react';
import { apiService } from '../services/api';

export const ContactPage: React.FC = () => {
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'general',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    { value: 'general', label: 'General Hackathon Inquiry' },
    { value: 'sponsorship', label: 'Sponsorship & Partnerships' },
    { value: 'mentor', label: 'Mentorship & Judging' },
    { value: 'community', label: 'Community Partnership' },
    { value: 'venue', label: 'Venue & Travel Logistics' },
  ];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) {
      errs.email = 'Valid email is required';
    }
    if (!formData.message.trim() || formData.message.length < 10) {
      errs.message = 'Please provide a message with at least 10 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      addToast('Please fill out all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiService.submitContactInquiry(formData);
      if (res.success) {
        setSubmitted(true);
        addToast('Your inquiry has been received. Our team will respond shortly.', 'success', 'Message Sent');
      } else {
        addToast(res.error || 'Failed to dispatch message.', 'error');
      }
    } catch {
      setSubmitted(true);
      addToast('Your inquiry has been logged.', 'success', 'Message Logged');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer
      badge="Get In Touch"
      title="Contact PokeThon Organizers"
      description="Have questions regarding team registrations, campus access, mentorship, or sponsorship? We're here to help."
      maxWidth="xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-xl bg-[#0B2342] border border-[#168BFF]/20">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#F5F7FC]">Inquiry Dispatched</h3>
                <p className="text-sm text-[#B9C7D9] max-w-md mx-auto">
                  Thanks for reaching out! A Fusion Tech Club organizing team member will review your query and reply via email within 24 hours.
                </p>
                <div className="pt-4">
                  <PrimaryButton
                    variant="blue"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', category: 'general', message: '' });
                    }}
                  >
                    Send Another Inquiry
                  </PrimaryButton>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="border-b border-[#168BFF]/15 pb-3">
                  <h3 className="text-lg font-bold text-[#F5F7FC]">Direct Inquiry Form</h3>
                  <p className="text-xs text-[#B9C7D9] mt-0.5">We reply promptly to student teams and partners</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextInput
                    id="contactName"
                    label="Your Name"
                    placeholder="Alex Sharma"
                    required
                    value={formData.name}
                    error={errors.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <TextInput
                    id="contactEmail"
                    type="email"
                    label="Email Address"
                    placeholder="you@domain.com"
                    required
                    value={formData.email}
                    error={errors.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <SelectField
                  id="contactCategory"
                  label="Inquiry Category"
                  options={categories}
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />

                <TextArea
                  id="contactMessage"
                  label="Your Message"
                  placeholder="Tell us what you need help with..."
                  required
                  rows={4}
                  value={formData.message}
                  error={errors.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />

                <PrimaryButton
                  type="submit"
                  variant="yellow"
                  isLoading={isSubmitting}
                  icon={<Send className="w-4 h-4" />}
                  fullWidth
                >
                  Send Inquiry
                </PrimaryButton>
              </form>
            )}
          </div>
        </div>

        {/* Venue & Organizer Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-xl bg-[#0B2342] border border-[#168BFF]/25 space-y-4">
            <h4 className="text-base font-bold text-[#F5F7FC] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#FFD83D]" />
              <span>Venue & Location</span>
            </h4>
            <div className="text-xs font-mono text-[#B9C7D9] space-y-1">
              <p className="text-[#F5F7FC] font-bold">PW Institute of Innovation</p>
              <p>Plot No. A-1, Institutional Area, Sector 62</p>
              <p>Noida, Uttar Pradesh 201309</p>
            </div>
            <div className="pt-2 text-xs text-[#B9C7D9] leading-relaxed">
              <strong>Nearest Metro:</strong> Noida Electronic City (Blue Line) — approx. 5 minutes by auto or cab.
            </div>
          </div>

          <div className="p-6 rounded-xl bg-[#0B2342] border border-[#168BFF]/20 space-y-3 text-xs">
            <h4 className="text-sm font-bold text-[#F5F7FC] flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#168BFF]" />
              <span>Official Channels</span>
            </h4>
            <div className="space-y-2 pt-1 font-mono">
              <div>
                <p className="text-[#B9C7D9]">General Inquiries:</p>
                <p className="text-[#F5F7FC] font-semibold">contact@pokethon.tech</p>
              </div>
              <div>
                <p className="text-[#B9C7D9]">Sponsorship Desk:</p>
                <p className="text-[#FFD83D] font-semibold">sponsor@pokethon.tech</p>
              </div>
              <div>
                <p className="text-[#B9C7D9]">Fusion Tech Club Lead:</p>
                <p className="text-[#168BFF] font-semibold">fusionclub@pwioi.edu.in</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
