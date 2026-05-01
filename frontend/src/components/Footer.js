import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer
      className="relative border-t border-white/5 bg-black overflow-hidden"
      data-testid="footer"
    >
      {/* Soft horizon glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12">
        {/* Top row: brand mark + tagline */}
        <div className="flex flex-col items-center gap-4 mb-10">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.jpg"
              alt="DeepGuard"
              className="w-7 h-7 rounded-full object-cover ring-1 ring-white/10"
            />
            <span className="font-semibold font-['Space_Grotesk'] text-white/95">
              DeepGuard
            </span>
          </div>
          <p className="text-sm text-white/50">{t('footer_tagline')}</p>
        </div>

        {/* Mid row: links */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mb-8">
          <Link
            to="/analyze"
            className="text-sm text-white/55 hover:text-white transition-colors"
          >
            {t('nav_analyze')}
          </Link>
          <Link
            to="/dashboard"
            className="text-sm text-white/55 hover:text-white transition-colors"
          >
            {t('nav_dashboard')}
          </Link>
          <Link
            to="/enterprise"
            className="text-sm text-white/55 hover:text-white transition-colors"
          >
            API
          </Link>
        </div>

        {/* Bottom row: three-zone brand marks (left/center/right) — like reference */}
        <div className="grid grid-cols-2 sm:grid-cols-3 items-center gap-3 pt-6 border-t border-white/5 text-[11px] uppercase tracking-[0.18em] text-white/35">
          <span className="text-left">deepguard.io</span>
          <span className="hidden sm:block text-center">{t('footer_brand_tag')}</span>
          <span className="text-right">{t('footer_made_with')}</span>
        </div>

        {/* Copyright */}
        <p className="mt-6 text-xs text-white/30 text-center">
          &copy; {new Date().getFullYear()} DeepGuard
        </p>
      </div>
    </footer>
  );
};

export default Footer;
