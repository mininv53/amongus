import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n';
import { Menu, X, Shield } from 'lucide-react';

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
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" data-testid="nav-logo">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <span className="text-lg font-semibold tracking-tight font-['Space_Grotesk']">DeepGuard</span>
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
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
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
              className="px-2.5 py-1.5 text-xs font-medium rounded-md border border-border hover:border-primary/50 transition-colors text-muted-foreground hover:text-foreground"
            >
              {nextLangLabel()}
            </button>

            {/* CTA */}
            <Link
              to="/analyze"
              data-testid="nav-run-scan-button"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 btn-press transition-colors"
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
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 text-sm rounded-md ${
                  isActive(link.path)
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/analyze"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center px-4 py-2 mt-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg"
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
