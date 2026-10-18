import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap } from 'lucide-react';
import { PrimaryButton } from '../ui/PrimaryButton';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Past Events', path: '/events' },
    { label: 'Sponsors', path: '/sponsors' },
    { label: 'Community Partners', path: '/community-partners' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#06152B]/90 backdrop-blur-md border-b border-[#168BFF]/20 shadow-lg shadow-black/40 py-3.5'
            : 'bg-transparent border-b border-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-6">
            {/* Zone 1: Brand wordmark with restrained hover effect */}
            <Link
              to="/"
              className="flex items-center gap-3 text-2xl font-black tracking-tight text-[#F5F7FC] whitespace-nowrap shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168BFF] rounded-lg transition-transform duration-200 hover:scale-[1.02]"
              aria-label="PokeThon Home"
            >
              <span className="w-9 h-9 rounded-lg bg-[#0B2342] border border-[#168BFF]/40 flex items-center justify-center text-[#FFD83D] shadow-[0_0_15px_rgba(22,139,255,0.25)] group-hover:border-[#FFD83D] group-hover:shadow-[0_0_20px_rgba(255,216,61,0.35)] transition-all">
                <Zap className="w-5 h-5 fill-[#FFD83D]/20 transition-transform group-hover:rotate-6" />
              </span>
              <span className="tracking-tight">
                POKE<span className="text-[#FFD83D] transition-colors group-hover:text-[#ffe066]">THON</span>
              </span>
            </Link>

            {/* Zone 2: Navigation Links */}
            <nav
              className="hidden lg:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-[#B9C7D9]"
              aria-label="Main Navigation"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[#F5F7FC] ${
                    isActive(link.path)
                      ? 'text-[#FFD83D]'
                      : 'text-[#B9C7D9]'
                  }`}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#FFD83D] rounded-full shadow-[0_0_8px_#FFD83D]" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Zone 3: Primary Action & Mobile Hamburger */}
            <div className="flex items-center gap-3 shrink-0">
              <Link to="/register" tabIndex={-1}>
                <PrimaryButton variant="yellow" icon={<Zap className="w-4 h-4 fill-current" />}>
                  Register Now
                </PrimaryButton>
              </Link>

              {/* Mobile Drawer Trigger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg bg-[#0B2342] border border-[#168BFF]/30 text-[#B9C7D9] hover:text-[#F5F7FC] hover:border-[#168BFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168BFF] transition-colors"
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Accessible Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-black/70 backdrop-blur-sm transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed inset-y-0 right-0 w-full max-w-xs bg-[#06152B] border-l border-[#168BFF]/25 shadow-2xl p-6 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#168BFF]/15">
                <Link to="/" className="text-xl font-black text-[#F5F7FC] flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#FFD83D]" />
                  <span>
                    POKE<span className="text-[#FFD83D]">THON</span>
                  </span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-[#B9C7D9] hover:text-[#F5F7FC] hover:bg-[#0B2342] transition-colors"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-6 text-xs font-mono font-medium text-[#168BFF] uppercase tracking-wider px-3 mb-2">
                Sprint Navigation
              </div>

              <nav className="flex flex-col gap-1.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-between ${
                      isActive(link.path)
                        ? 'bg-[#168BFF]/15 text-[#FFD83D] border-l-2 border-[#FFD83D]'
                        : 'text-[#B9C7D9] hover:bg-[#0B2342] hover:text-[#F5F7FC]'
                    }`}
                  >
                    <span>{link.label}</span>
                  </Link>
                ))}
              </nav>
            </div>

            <div className="pt-6 border-t border-[#168BFF]/15 flex flex-col gap-3">
              <Link to="/register" className="w-full">
                <PrimaryButton variant="yellow" fullWidth icon={<Zap className="w-4 h-4 fill-current" />}>
                  Register Now
                </PrimaryButton>
              </Link>
              <div className="text-center text-xs text-[#B9C7D9]/60 font-mono">
                PW IOI · Fusion Tech Club
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
