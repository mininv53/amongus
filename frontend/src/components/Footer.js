import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n';
import { Shield } from 'lucide-react';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border bg-card/50" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="font-semibold font-['Space_Grotesk']">TruthLens</span>
            </div>
            <p className="text-sm text-muted-foreground">{t('footer_tagline')}</p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold mb-3">{t('footer_product')}</h4>
            <div className="space-y-2">
              <Link to="/analyze" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t('nav_analyze')}</Link>
              <Link to="/dashboard" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t('nav_dashboard')}</Link>
              <Link to="/enterprise" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">API</Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold mb-3">{t('footer_company')}</h4>
            <div className="space-y-2">
              <span className="block text-sm text-muted-foreground">About</span>
              <span className="block text-sm text-muted-foreground">Blog</span>
              <span className="block text-sm text-muted-foreground">Careers</span>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold mb-3">{t('footer_legal')}</h4>
            <div className="space-y-2">
              <span className="block text-sm text-muted-foreground">Privacy Policy</span>
              <span className="block text-sm text-muted-foreground">Terms of Service</span>
              <span className="block text-sm text-muted-foreground">Cookie Policy</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} TruthLens. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
