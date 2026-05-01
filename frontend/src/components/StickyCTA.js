import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../i18n';

/**
 * StickyCTA — fades in once the user scrolls past the hero on the landing
 * page. Single, persistent retention hook that always says where to click.
 */
export default function StickyCTA() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.6);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Link
      to="/analyze"
      data-visible={visible}
      data-testid="sticky-cta"
      className="sticky-cta pill pill-primary"
    >
      {t('sticky_cta')}
      <ArrowUpRight className="w-4 h-4" />
    </Link>
  );
}
