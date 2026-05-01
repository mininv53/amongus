import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n';
import { motion } from 'framer-motion';
import { Shield, Image, Music, Link2, Search, Share2, ArrowRight, Layers } from 'lucide-react';
import HeroAtmosphere from '../components/HeroAtmosphere';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function Landing() {
  const { t } = useLanguage();

  const features = [
    { icon: Layers, title: t('feat_multimodel_title'), desc: t('feat_multimodel_desc'), color: 'text-primary' },
    { icon: Image, title: t('feat_image_title'), desc: t('feat_image_desc'), color: 'text-teal-400' },
    { icon: Music, title: t('feat_audio_title'), desc: t('feat_audio_desc'), color: 'text-lime-400' },
    { icon: Link2, title: t('feat_url_title'), desc: t('feat_url_desc'), color: 'text-sky-400' },
    { icon: Search, title: t('feat_signals_title'), desc: t('feat_signals_desc'), color: 'text-amber-400' },
    { icon: Share2, title: t('feat_share_title'), desc: t('feat_share_desc'), color: 'text-teal-400' },
  ];

  const steps = [
    { num: '01', title: t('how_step1_title'), desc: t('how_step1_desc') },
    { num: '02', title: t('how_step2_title'), desc: t('how_step2_desc') },
    { num: '03', title: t('how_step3_title'), desc: t('how_step3_desc') },
  ];

  const stats = [
    { value: '3', label: t('stat_models_label') },
    { value: t('stat_speed_value'), label: t('stat_speed_label') },
    { value: '3', label: t('stat_langs_label') },
    { value: '16+', label: t('stat_signals_label') },
  ];

  return (
    <div className="min-h-screen">
      {/* ==== HERO ==== */}
      <section
        className="relative atmosphere-bg overflow-hidden"
        data-testid="landing-hero"
      >
        {/* Decorative atmospheric backdrop */}
        <HeroAtmosphere />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 pt-24 pb-32 sm:pt-32 sm:pb-40">
          <motion.div {...fadeInUp} className="text-center">
            {/* Eyebrow pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm text-[11px] uppercase tracking-[0.16em] text-white/70 mb-10">
              <Shield className="w-3 h-3 text-primary" />
              <span>{t('hero_eyebrow')}</span>
            </div>

            {/* Heading: line 1 + serif glow pill */}
            <h1 className="font-semibold tracking-tight">
              <span className="block text-4xl sm:text-5xl lg:text-6xl text-white/95 leading-[1.05]">
                {t('hero_title')}
              </span>
              <span className="block mt-5 sm:mt-6">
                <span
                  className="font-serif italic text-5xl sm:text-6xl lg:text-7xl text-white hero-word-glow"
                >
                  {t('hero_title2')}
                </span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-8 text-base sm:text-lg text-white/65 max-w-xl mx-auto leading-relaxed">
              {t('hero_subtitle')}
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/analyze"
                data-testid="hero-cta-primary"
                className="pill-cta inline-flex items-center gap-2 px-7 py-3.5 text-sm font-medium"
              >
                {t('hero_cta')}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/enterprise"
                data-testid="hero-cta-secondary"
                className="pill-ghost inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium"
              >
                {t('hero_cta2')}
              </Link>
            </div>

            {/* Microcopy */}
            <p className="mt-5 text-xs text-white/40 tracking-wide">
              {t('hero_microcopy')}
            </p>
          </motion.div>
        </div>

        {/* Stat strip — sits over the bottom haze */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 -mt-12 sm:-mt-16 pb-16"
          data-testid="hero-stats"
        >
          <div className="stat-pill grid grid-cols-2 sm:grid-cols-4 gap-px overflow-hidden">
            {stats.map((s, i) => (
              <div
                key={i}
                className="px-5 py-4 sm:py-5 text-center bg-black/30 first:rounded-l-full last:rounded-r-full"
              >
                <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-white font-['Space_Grotesk']">
                  {s.value}
                </div>
                <div className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-white/55">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Hairline divider into next section */}
        <div className="relative z-10 hairline-divider mx-auto max-w-3xl" />
      </section>

      {/* ==== Features ==== */}
      <section className="py-20 sm:py-28 bg-background" data-testid="landing-features">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-14">
            <p className="text-[11px] uppercase tracking-[0.18em] text-primary/80 mb-3">
              {t('features_subtitle')}
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
              {t('features_title')}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="bento-card p-6 rounded-2xl border border-white/8 bg-white/[0.015] backdrop-blur-sm group"
              >
                <div className={`w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-4 ${feat.color}`}>
                  <feat.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold mb-1.5 text-white/95">{feat.title}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==== How it works ==== */}
      <section
        className="relative py-20 sm:py-28 atmosphere-bg overflow-hidden"
        data-testid="landing-how-it-works"
      >
        {/* Subtle starlight */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute"
            style={{
              left: '50%',
              top: '50%',
              width: '700px',
              height: '500px',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="w-full h-full spotlight-glow rounded-full opacity-50" />
          </div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
              {t('how_title')}
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 mb-14">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm flex items-center justify-center mx-auto mb-5 shadow-[0_0_28px_rgba(20,184,166,0.20)]">
                  <span className="text-sm font-semibold text-primary font-mono">{step.num}</span>
                </div>
                <h3 className="text-base font-semibold mb-2 text-white/95">{step.title}</h3>
                <p className="text-sm text-white/55 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </motion.div>
            ))}
          </div>
          {/* Disclaimer */}
          <div className="max-w-xl mx-auto p-4 rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] backdrop-blur-sm">
            <h4 className="text-sm font-semibold text-amber-400 mb-1">{t('how_disclaimer')}</h4>
            <p className="text-xs text-white/55 leading-relaxed">{t('how_disclaimer_text')}</p>
          </div>
        </div>
      </section>

      {/* ==== Pricing ==== */}
      <section className="py-20 sm:py-28 bg-background" data-testid="landing-pricing">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">{t('pricing_title')}</h2>
            <p className="mt-3 text-white/55">{t('pricing_subtitle')}</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Free */}
            <div className="p-6 rounded-2xl border border-white/8 bg-white/[0.015] backdrop-blur-sm" data-testid="landing-pricing-tier-free">
              <h3 className="text-lg font-semibold text-white/95">{t('pricing_free')}</h3>
              <p className="text-sm text-white/55 mt-1">{t('pricing_free_desc')}</p>
              <div className="mt-4 mb-6">
                <span className="text-3xl font-bold font-['Space_Grotesk'] text-white">$0</span>
              </div>
              <ul className="space-y-2.5 mb-6">
                {[t('pricing_free_f1'), t('pricing_free_f2'), t('pricing_free_f3'), t('pricing_free_f4')].map((f, i) => (
                  <li key={i} className="text-sm text-white/55">
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/analyze"
                className="pill-ghost block w-full text-center px-4 py-2.5 text-sm font-medium"
              >
                {t('pricing_cta_free')}
              </Link>
            </div>

            {/* Pro */}
            <div className="p-6 rounded-2xl pricing-highlight bg-card relative" data-testid="landing-pricing-tier-pro">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                {t('pricing_popular')}
              </div>
              <h3 className="text-lg font-semibold text-white/95">{t('pricing_pro')}</h3>
              <p className="text-sm text-white/55 mt-1">{t('pricing_pro_desc')}</p>
              <div className="mt-4 mb-6">
                <span className="text-3xl font-bold font-['Space_Grotesk'] text-white">{t('pricing_pro_price')}</span>
              </div>
              <ul className="space-y-2.5 mb-6">
                {[t('pricing_pro_f1'), t('pricing_pro_f2'), t('pricing_pro_f3'), t('pricing_pro_f4'), t('pricing_pro_f5')].map((f, i) => (
                  <li key={i} className="text-sm text-white/65">
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/analyze"
                className="pill-cta block w-full text-center px-4 py-2.5 text-sm font-medium"
              >
                {t('pricing_cta_pro')}
              </Link>
            </div>

            {/* Enterprise */}
            <div className="p-6 rounded-2xl border border-white/8 bg-white/[0.015] backdrop-blur-sm" data-testid="landing-pricing-tier-enterprise">
              <h3 className="text-lg font-semibold text-white/95">{t('pricing_enterprise')}</h3>
              <p className="text-sm text-white/55 mt-1">{t('pricing_enterprise_desc')}</p>
              <div className="mt-4 mb-6">
                <span className="text-3xl font-bold font-['Space_Grotesk'] text-white">{t('pricing_enterprise_price')}</span>
              </div>
              <ul className="space-y-2.5 mb-6">
                {[t('pricing_enterprise_f1'), t('pricing_enterprise_f2'), t('pricing_enterprise_f3'), t('pricing_enterprise_f4'), t('pricing_enterprise_f5')].map((f, i) => (
                  <li key={i} className="text-sm text-white/55">
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/enterprise"
                className="pill-ghost block w-full text-center px-4 py-2.5 text-sm font-medium"
              >
                {t('pricing_cta_enterprise')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==== Final CTA ==== */}
      <section className="relative py-24 sm:py-32 atmosphere-bg overflow-hidden" data-testid="landing-cta">
        {/* center glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute"
            style={{
              left: '50%',
              top: '50%',
              width: '700px',
              height: '400px',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="w-full h-full spotlight-glow rounded-full opacity-60" />
          </div>
        </div>

        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
            {t('cta_title')}
          </h2>
          <p className="mt-4 text-white/65">{t('cta_subtitle')}</p>
          <Link
            to="/analyze"
            data-testid="cta-button"
            className="pill-cta inline-flex items-center gap-2 mt-8 px-8 py-3.5 text-sm font-medium"
          >
            {t('cta_button')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
