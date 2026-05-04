import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n';
import { Menu, X } from 'lucide-react';

export const Navbar = () => {
  const { t, lang, cycleLang, nextLangLabel } = useLanguage();
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
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-background/72 backdrop-blur-2xl" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" data-testid="nav-logo">
            <img
              src="/logo.jpg"
              alt="DeepGuard"
              className="w-9 h-9 rounded-lg object-cover"
            />
            <span className="text-lg font-semibold tracking-tight">DeepGuard</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                data-testid={`nav-link-${link.path.replace('/', '') || 'home'}`}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  isActive(link.path)
                    ? 'text-sand bg-white/[0.06]'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.05]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <button
              onClick={cycleLang}
              data-testid="language-toggle"
              className="px-2.5 py-1.5 text-xs font-medium rounded-full border border-white/10 hover:border-sand/40 transition-colors text-muted-foreground hover:text-foreground"
            >
              {nextLangLabel()}
            </button>

            {/* CTA */}
            <Link
              to="/analyze"
              data-testid="nav-run-scan-button"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-sand text-stone-950 rounded-full hover:bg-white btn-press transition-colors"
            >
              {t('nav_run_scan')}
            </Link>

            {/* Mobile menu */}
            <button
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
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
        <div className="md:hidden border-t border-white/10 bg-background/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 text-sm rounded-md ${
                  isActive(link.path)
                    ? 'text-sand bg-white/[0.06]'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/analyze"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center px-4 py-2 mt-2 text-sm font-semibold bg-sand text-stone-950 rounded-full"
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
