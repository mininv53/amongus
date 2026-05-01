import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n';
import { Shield } from 'lucide-react';

export const Footer = () => {
  const { t, lang, setLang, LANG_ORDER, LANG_LABELS } = useLanguage();

  return (
    <footer className="relative border-t border-border/60 bg-background/40" data-testid="footer">
      <div className="container-page py-12 sm:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="relative w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/40">
                <Shield className="w-4 h-4 text-primary" />
              </span>
              <span className="font-semibold tracking-tight">DeepGuard</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">{t('footer_tagline')}</p>
          </div>

          {/* Product */}
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">
              {t('footer_product')}
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/analyze" className="link-underline text-muted-foreground">
                  {t('nav_analyze')}
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="link-underline text-muted-foreground">
                  {t('nav_dashboard')}
                </Link>
              </li>
              <li>
                <Link to="/enterprise" className="link-underline text-muted-foreground">
                  {t('nav_enterprise')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">
              {t('footer_resources')}
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="link-underline text-muted-foreground">
                  {t('how_eyebrow')}
                </Link>
              </li>
              <li>
                <Link to="/" className="link-underline text-muted-foreground">
                  {t('pricing_eyebrow')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company + lang */}
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">
              {t('footer_company')}
            </p>
            <ul className="space-y-2 text-sm mb-5">
              <li>
                <span className="text-muted-foreground">{t('footer_about')}</span>
              </li>
              <li>
                <span className="text-muted-foreground">{t('footer_privacy')}</span>
              </li>
              <li>
                <span className="text-muted-foreground">{t('footer_terms')}</span>
              </li>
            </ul>
            <div className="segmented" role="tablist" aria-label="Language">
              {LANG_ORDER.map((code) => (
                <button
                  key={code}
                  type="button"
                  role="tab"
                  aria-selected={lang === code}
                  data-active={lang === code}
                  onClick={() => setLang(code)}
                  className="segmented-item"
                >
                  {LANG_LABELS[code]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="section-divider mt-10 mb-6" />
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-xs text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} DeepGuard. All rights reserved.</span>
          <span>{t('footer_madeby')}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
