import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Image as ImageIcon,
  Music,
  Link2,
  Layers,
  Search,
  Share2,
  Check,
} from 'lucide-react';
import { useLanguage } from '../i18n';
import ParticleField from '../components/ParticleField';
import StickyCTA from '../components/StickyCTA';
import useCountUp from '../hooks/useCountUp';
import { useStepReveal, useScrollProgress } from '../hooks/useScrollReveal';

function StatBlock({ value, decimals = 0, suffix = '', label }) {
  const ref = useCountUp(value, { decimals });
  return (
    <div className="text-center sm:text-left">
      <div className="flex items-baseline justify-center sm:justify-start gap-1">
        <span ref={ref} className="text-3xl sm:text-4xl font-semibold tracking-tight tighter">
          0
        </span>
        {suffix && (
          <span className="text-3xl sm:text-4xl font-semibold tracking-tight text-muted-foreground tighter">
            {suffix}
          </span>
        )}
      </div>
      <p className="mt-1 text-xs text-muted-foreground max-w-[16ch] mx-auto sm:mx-0 leading-snug">
        {label}
      </p>
    </div>
  );
}

function HeroDemo() {
  const ref = useScrollProgress();
  return (
    <div
      ref={ref}
      className="relative bento-card p-5 sm:p-6 halo-teal"
      style={{ '--progress': 0 }}
    >
      <div className="absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none">
        <div className="scanner-sheen absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-primary/12 to-transparent" />
      </div>

      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          <span className="ml-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-mono">
            scan_result.json
          </span>
        </div>

        <div className="space-y-3 font-mono text-[12.5px] leading-relaxed">
          <div className="text-muted-foreground">{'{'}</div>
          <div className="pl-4">
            <span className="text-primary">"trust_score"</span>:{' '}
            <span className="text-accent">81</span>,
          </div>
          <div className="pl-4">
            <span className="text-primary">"verdict"</span>:{' '}
            <span className="text-accent">"likely_authentic"</span>,
          </div>
          <div className="pl-4">
            <span className="text-primary">"models"</span>: [
          </div>
          <div className="pl-8">
            <span className="text-emerald-300">"GPT"</span>:{' '}
            <span className="text-accent">82</span>,
          </div>
          <div className="pl-8">
            <span className="text-orange-300">"Claude"</span>:{' '}
            <span className="text-accent">72</span>,
          </div>
          <div className="pl-8">
            <span className="text-sky-300">"Gemini"</span>:{' '}
            <span className="text-accent">88</span>
          </div>
          <div className="pl-4 text-muted-foreground">]</div>
          <div className="pl-4">
            <span className="text-primary">"consensus"</span>:{' '}
            <span className="text-emerald-300">"unanimous"</span>
          </div>
          <div className="text-muted-foreground">{'}'}</div>
        </div>

        {/* Scroll-driven trust gauge */}
        <div className="mt-6 pt-5 border-t border-border/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-mono">
              Trust Score
            </span>
            <span className="text-2xl font-semibold text-gradient-teal tabular-nums tighter">
              81
            </span>
          </div>
          <div className="relative h-2 rounded-full bg-card overflow-hidden border border-border/60">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-primary to-accent"
              style={{ width: 'calc(var(--progress, 0) * 81%)' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [inlineUrl, setInlineUrl] = useState('');
  const stepsRef = useStepReveal();

  const submitInline = (e) => {
    e?.preventDefault();
    const v = inlineUrl.trim();
    if (!v) {
      navigate('/analyze');
      return;
    }
    navigate(`/analyze?url=${encodeURIComponent(v)}`);
  };

  const features = [
    { icon: Layers, title: t('feat_multimodel_title'), desc: t('feat_multimodel_desc') },
    { icon: ImageIcon, title: t('feat_image_title'), desc: t('feat_image_desc') },
    { icon: Music, title: t('feat_audio_title'), desc: t('feat_audio_desc') },
    { icon: Link2, title: t('feat_url_title'), desc: t('feat_url_desc') },
    { icon: Search, title: t('feat_signals_title'), desc: t('feat_signals_desc') },
    { icon: Share2, title: t('feat_share_title'), desc: t('feat_share_desc') },
  ];

  const steps = [
    { num: '01', title: t('how_step1_title'), desc: t('how_step1_desc') },
    { num: '02', title: t('how_step2_title'), desc: t('how_step2_desc') },
    { num: '03', title: t('how_step3_title'), desc: t('how_step3_desc') },
  ];

  return (
    <div className="relative">
      {/* === Hero === */}
      <section className="relative overflow-hidden" data-testid="landing-hero">
        <div className="aurora-bg" />
        <ParticleField className="opacity-70" density={1400} />

        <div className="container-page relative pt-16 sm:pt-24 lg:pt-28 pb-16 sm:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card/60 backdrop-blur text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_2px_hsl(var(--primary))]" />
              {t('hero_eyebrow')}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-7 text-center font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] leading-[1.02] tighter"
          >
            <span className="block text-foreground">{t('hero_title_a')}</span>
            <span className="my-3 inline-flex items-center justify-center">
              <span className="glow-pill font-serif italic text-primary text-4xl sm:text-5xl lg:text-6xl xl:text-7xl">
                {t('hero_title_pill')}
              </span>
            </span>
            <span className="block text-foreground">{t('hero_title_b')}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-6 max-w-xl mx-auto text-center text-base sm:text-lg text-muted-foreground leading-relaxed"
          >
            {t('hero_subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22 }}
            className="mt-9 flex flex-col items-center gap-3"
          >
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/analyze" data-testid="hero-cta-primary" className="pill pill-primary">
                {t('hero_cta_primary')}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#how" data-testid="hero-cta-secondary" className="pill pill-ghost">
                {t('hero_cta_secondary')}
              </a>
            </div>
            <p className="text-xs text-muted-foreground">{t('hero_microcopy')}</p>
          </motion.div>

          {/* Inline mini-demo */}
          <motion.form
            onSubmit={submitInline}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.32 }}
            className="mt-10 max-w-xl mx-auto"
            data-testid="hero-inline-demo"
          >
            <p className="text-center text-xs text-muted-foreground mb-2">
              {t('hero_inline_label')}
            </p>
            <div className="flex items-center gap-2 p-1.5 pl-4 rounded-full border border-border bg-card/60 backdrop-blur halo-teal">
              <input
                value={inlineUrl}
                onChange={(e) => setInlineUrl(e.target.value)}
                type="url"
                inputMode="url"
                placeholder={t('hero_inline_placeholder')}
                className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground/70 outline-none"
                data-testid="hero-inline-input"
              />
              <button type="submit" className="pill pill-primary !py-2 !px-4" data-testid="hero-inline-submit">
                {t('hero_inline_button')}
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </motion.form>

          {/* Hero demo card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-14 sm:mt-16 max-w-3xl mx-auto"
          >
            <HeroDemo />
          </motion.div>
        </div>
      </section>

      {/* === Trust strip === */}
      <section className="relative" data-testid="landing-trust-strip">
        <div className="container-page">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 sm:gap-y-10 gap-x-6 py-10 sm:py-14 border-y border-border/60">
            <StatBlock value={3} label={t('stat_models')} />
            <StatBlock value={30} suffix="s" label={t('stat_speed')} />
            <StatBlock value={0} label={t('stat_signup')} />
            <StatBlock value={100} suffix="%" label={t('stat_proof')} />
          </div>
        </div>
      </section>

      {/* === Features === */}
      <section className="relative py-20 sm:py-28" data-testid="landing-features">
        <div className="container-page">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {t('features_eyebrow')}
            </span>
            <h2 className="mt-3 font-serif text-4xl sm:text-5xl tighter">
              {t('features_title')}
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
              {t('features_subtitle')}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
                className="bento-card p-6"
              >
                <div className="w-10 h-10 rounded-xl border border-primary/30 bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <feat.icon className="w-4 h-4" />
                </div>
                <h3 className="text-base font-semibold mb-1.5">{feat.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === How it works === */}
      <section
        id="how"
        className="relative py-20 sm:py-28 border-t border-border/60 bg-card/20"
        data-testid="landing-how-it-works"
      >
        <div className="container-page">
          <div className="text-center mb-14">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {t('how_eyebrow')}
            </span>
            <h2 className="mt-3 font-serif text-4xl sm:text-5xl tighter">{t('how_title')}</h2>
          </div>

          <div ref={stepsRef} className="relative grid sm:grid-cols-3 gap-8 sm:gap-6 max-w-5xl mx-auto">
            {/* Connecting timeline */}
            <div className="hidden sm:block absolute left-0 right-0 top-7 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            {steps.map((step) => (
              <div
                key={step.num}
                data-step={step.num}
                className="relative text-center transition-opacity"
                style={{ transition: 'opacity 0.5s ease, transform 0.5s ease' }}
              >
                <div className="relative w-14 h-14 mx-auto mb-5 rounded-full bg-card border border-border flex items-center justify-center">
                  <span className="text-xs font-mono text-primary">{step.num}</span>
                  <span className="absolute inset-0 rounded-full shadow-[0_0_22px_2px_hsl(var(--primary)/0.35)] pointer-events-none opacity-0 [.is-active_&]:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="max-w-2xl mx-auto mt-16 p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5">
            <p className="text-sm font-semibold text-amber-300 mb-1">{t('how_disclaimer')}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('how_disclaimer_text')}
            </p>
          </div>
        </div>
      </section>

      {/* === Pricing === */}
      <section className="relative py-20 sm:py-28" data-testid="landing-pricing">
        <div className="container-page">
          <div className="text-center mb-14">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {t('pricing_eyebrow')}
            </span>
            <h2 className="mt-3 font-serif text-4xl sm:text-5xl tighter">{t('pricing_title')}</h2>
            <p className="mt-4 max-w-xl mx-auto text-muted-foreground">{t('pricing_subtitle')}</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {/* Free */}
            <PricingCard
              name={t('pricing_free')}
              desc={t('pricing_free_desc')}
              price={t('pricing_free_price')}
              priceUnit={t('pricing_free_price_unit')}
              features={[
                t('pricing_free_f1'),
                t('pricing_free_f2'),
                t('pricing_free_f3'),
                t('pricing_free_f4'),
              ]}
              cta={t('pricing_cta_free')}
              to="/analyze"
              testId="landing-pricing-tier-free"
            />

            {/* Pro */}
            <PricingCard
              highlight
              badge={t('pricing_popular')}
              name={t('pricing_pro')}
              desc={t('pricing_pro_desc')}
              price={t('pricing_pro_price')}
              priceUnit={t('pricing_pro_price_unit')}
              features={[
                t('pricing_pro_f1'),
                t('pricing_pro_f2'),
                t('pricing_pro_f3'),
                t('pricing_pro_f4'),
                t('pricing_pro_f5'),
              ]}
              cta={t('pricing_cta_pro')}
              to="/enterprise"
              testId="landing-pricing-tier-pro"
            />

            {/* Enterprise */}
            <PricingCard
              name={t('pricing_enterprise')}
              desc={t('pricing_enterprise_desc')}
              price={t('pricing_enterprise_price')}
              priceUnit={t('pricing_enterprise_price_unit')}
              features={[
                t('pricing_enterprise_f1'),
                t('pricing_enterprise_f2'),
                t('pricing_enterprise_f3'),
                t('pricing_enterprise_f4'),
                t('pricing_enterprise_f5'),
              ]}
              cta={t('pricing_cta_enterprise')}
              to="/enterprise"
              testId="landing-pricing-tier-enterprise"
              ghost
            />
          </div>
        </div>
      </section>

      {/* === Final CTA === */}
      <section className="relative py-20 sm:py-28" data-testid="landing-cta">
        <div className="container-page">
          <div className="relative bento-card p-10 sm:p-14 text-center halo-teal overflow-hidden">
            <div className="aurora-bg" />
            <div className="relative">
              <h2 className="font-serif text-3xl sm:text-5xl tighter mb-4">{t('cta_title')}</h2>
              <p className="max-w-xl mx-auto text-muted-foreground mb-7">{t('cta_subtitle')}</p>
              <Link to="/analyze" className="pill pill-primary" data-testid="landing-cta-button">
                {t('cta_button')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <StickyCTA />
    </div>
  );
}

function PricingCard({ name, desc, price, priceUnit, features, cta, to, highlight, ghost, badge, testId }) {
  return (
    <div
      data-testid={testId}
      className={`bento-card p-7 flex flex-col ${highlight ? 'pricing-highlight' : ''}`}
    >
      {highlight && badge && (
        <span className="absolute top-4 right-4 text-[10px] uppercase tracking-[0.2em] px-2 py-1 rounded-full border border-primary/40 text-primary bg-primary/10">
          {badge}
        </span>
      )}
      <div className="mb-5">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm text-muted-foreground mt-1">{desc}</p>
      </div>
      <div className="flex items-baseline gap-2 mb-6">
        <span className="text-4xl font-semibold tighter">{price}</span>
        <span className="text-sm text-muted-foreground">{priceUnit}</span>
      </div>
      <ul className="space-y-2.5 mb-7 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Link
        to={to}
        className={`pill w-full justify-center ${ghost ? 'pill-ghost' : 'pill-primary'}`}
      >
        {cta}
      </Link>
    </div>
  );
}
