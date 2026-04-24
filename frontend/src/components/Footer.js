import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border bg-card/50" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <img
                src="/logo.jpg"
                alt="DeepGuard"
                className="w-8 h-8 rounded-lg object-cover"
              />
              <span className="font-semibold font-['Space_Grotesk']">DeepGuard</span>
            </div>
            <p className="text-sm text-muted-foreground">{t('footer_tagline')}</p>
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap gap-6">
            <Link to="/analyze" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('nav_analyze')}</Link>
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('nav_dashboard')}</Link>
            <Link to="/enterprise" className="text-sm text-muted-foreground hover:text-foreground transition-colors">API</Link>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} DeepGuard
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
