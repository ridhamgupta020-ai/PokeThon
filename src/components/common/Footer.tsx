import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, MapPin, Mail, Calendar, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#040e1d] border-t border-[#168BFF]/20 text-[#B9C7D9] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#168BFF]/15">
          {/* Brand & Event Host Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3 text-2xl font-black text-[#F5F7FC]">
              <span className="w-8 h-8 rounded-lg bg-[#0B2342] border border-[#168BFF]/40 flex items-center justify-center text-[#FFD83D]">
                <Zap className="w-4 h-4 fill-[#FFD83D]/20" />
              </span>
              <span>
                POKE<span className="text-[#FFD83D]">THON</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-[#B9C7D9] max-w-sm">
              A 24-hour flagship offline innovation sprint bringing together student developers, designers, and innovators to build cutting-edge prototypes.
            </p>

            <div className="pt-2 space-y-2 text-xs font-mono">
              <div className="flex items-center gap-2 text-[#B9C7D9]">
                <MapPin className="w-4 h-4 text-[#168BFF] shrink-0" />
                <span>PW Institute of Innovation, Noida, Uttar Pradesh</span>
              </div>
              <div className="flex items-center gap-2 text-[#B9C7D9]">
                <Calendar className="w-4 h-4 text-[#FFD83D] shrink-0" />
                <span>24-Hour Offline Hackathon</span>
              </div>
              <div className="flex items-center gap-2 text-[#B9C7D9]">
                <Mail className="w-4 h-4 text-[#168BFF] shrink-0" />
                <span>contact@pokethon.tech</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5F7FC] mb-4">Event</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-[#FFD83D] transition-colors">
                  About PokeThon
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-[#FFD83D] transition-colors">
                  Tracks & Challenges
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-[#FFD83D] transition-colors">
                  Registration Portal
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#FFD83D] transition-colors">
                  Venue & Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Ecosystem Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5F7FC] mb-4">Ecosystem</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/sponsors" className="hover:text-[#FFD83D] transition-colors">
                  Sponsors & Perks
                </Link>
              </li>
              <li>
                <Link to="/community-partners" className="hover:text-[#FFD83D] transition-colors">
                  Community Partners
                </Link>
              </li>
              <li>
                <Link to="/partners" className="hover:text-[#FFD83D] transition-colors">
                  Academic Partners
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-[#FFD83D] transition-colors flex items-center gap-1">
                  <span>Organizer Console</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#168BFF]" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Organizer Credit */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5F7FC] mb-4">Organized By</h4>
            <div className="p-4 rounded-lg bg-[#0B2342]/60 border border-[#168BFF]/20 space-y-2">
              <p className="text-sm font-bold text-[#F5F7FC]">Fusion Tech Club</p>
              <p className="text-xs text-[#B9C7D9]">Student Tech Community</p>
              <p className="text-xs text-[#168BFF] pt-1">PW Institute of Innovation</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#B9C7D9]/70">
          <p>© {new Date().getFullYear()} PokeThon. Organized by Fusion Tech Club, PW IOI Noida. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-[#F5F7FC] transition-colors">
              Privacy Policy
            </Link>
            <span aria-hidden="true">·</span>
            <Link to="/terms" className="hover:text-[#F5F7FC] transition-colors">
              Terms & Code of Conduct
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
