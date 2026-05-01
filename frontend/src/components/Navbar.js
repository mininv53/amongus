import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n';
import { Menu, X } from 'lucide-react';

export const Navbar = () => {
  const { t, cycleLang, nextLangLabel } = useLanguage();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: t('nav_home') },
    { path: '/analyze', label: t('nav_analyze') },
    { path: '/dashboard', label: t('nav_dashboard') },
    { path: '/enterprise', label: t('nav_enterprise') },
  ];

  return (
    <nav
      className="sticky top-0 z-50 border-b border-white/5 bg-black/70 backdrop-blur-xl"
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" data-testid="nav-logo">
            <img
              src="/logo.jpg"
              alt="DeepGuard"
              className="w-9 h-9 rounded-full object-cover ring-1 ring-white/15"
            />
            <span className="text-lg font-semibold tracking-tight font-['Space_Grotesk'] text-white/95">
              DeepGuard
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                data-testid={`nav-link-${link.path.replace('/', '') || 'home'}`}
                className={`px-3.5 py-1.5 text-sm rounded-full transition-colors ${
                  isActive(link.path)
                    ? 'text-white bg-white/10'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <button
              onClick={cycleLang}
              data-testid="language-toggle"
              className="px-3 py-1.5 text-xs font-medium rounded-full border border-white/10 hover:border-white/30 transition-colors text-white/60 hover:text-white bg-white/[0.02]"
            >
              {nextLangLabel()}
            </button>

            {/* CTA */}
            <Link
              to="/analyze"
              data-testid="nav-run-scan-button"
              className="pill-cta hidden sm:inline-flex items-center gap-2 px-4 py-1.5 text-xs font-medium"
            >
              {t('nav_run_scan')}
            </Link>

            {/* Mobile menu */}
            <button
              className="md:hidden p-2 text-white/70 hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
              data-testid="mobile-menu-toggle"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/5 bg-black/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 text-sm rounded-full ${
                  isActive(link.path)
                    ? 'text-white bg-white/10'
                    : 'text-white/65 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/analyze"
              onClick={() => setMobileOpen(false)}
              className="pill-cta block w-full text-center px-4 py-2.5 mt-3 text-sm font-medium"
            >
              {t('nav_run_scan')}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
