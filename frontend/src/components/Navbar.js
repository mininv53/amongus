import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n';
import { Menu, X, Shield } from 'lucide-react';

export const Navbar = () => {
  const { t, lang, setLang, LANG_ORDER, LANG_LABELS } = useLanguage();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: t('nav_home') },
    { path: '/analyze', label: t('nav_analyze') },
    { path: '/dashboard', label: t('nav_dashboard') },
    { path: '/enterprise', label: t('nav_enterprise') },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-colors ${
        scrolled
          ? 'border-b border-border/60 bg-background/75 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
      data-testid="navbar"
    >
      <div className="container-page">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" data-testid="nav-logo">
            <span className="relative w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/40">
              <Shield className="w-4 h-4 text-primary" />
              <span className="absolute inset-0 rounded-xl shadow-[0_0_22px_2px_hsl(var(--primary)/0.35)] pointer-events-none" />
            </span>
            <span className="text-base font-semibold tracking-tight">DeepGuard</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                data-testid={`nav-link-${link.path.replace('/', '') || 'home'}`}
                className={`px-3 py-2 text-sm rounded-full transition-colors ${
                  isActive(link.path)
                    ? 'text-foreground bg-card/70 border border-border'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Segmented language toggle */}
            <div className="segmented" role="tablist" aria-label="Language">
              {LANG_ORDER.map((code) => (
                <button
                  key={code}
                  type="button"
                  role="tab"
                  aria-selected={lang === code}
                  data-active={lang === code}
                  onClick={() => setLang(code)}
                  data-testid={`lang-${code}`}
                  className="segmented-item"
                >
                  {LANG_LABELS[code]}
                </button>
              ))}
            </div>

            {/* CTA */}
            <Link
              to="/analyze"
              data-testid="nav-run-scan-button"
              className="hidden sm:inline-flex pill pill-primary"
            >
              {t('nav_run_scan')}
            </Link>

            {/* Mobile menu */}
            <button
              type="button"
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
              data-testid="mobile-menu-toggle"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <div className="container-page py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 text-sm rounded-md ${
                  isActive(link.path)
                    ? 'text-foreground bg-card/70'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/analyze"
              onClick={() => setMobileOpen(false)}
              className="mt-2 inline-flex pill pill-primary w-full justify-center"
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
