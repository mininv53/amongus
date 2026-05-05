import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  AudioWaveform,
  BadgeCheck,
  Camera,
  Fingerprint,
  Globe2,
  Layers,
  ScanSearch,
  Share2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: 'easeOut' }
};

export default function Landing() {
  const { t } = useLanguage();

  const features = [
    { icon: Layers, title: t('feat_multimodel_title'), desc: t('feat_multimodel_desc'), color: 'text-copper' },
    { icon: Camera, title: t('feat_image_title'), desc: t('feat_image_desc'), color: 'text-sand' },
    { icon: AudioWaveform, title: t('feat_audio_title'), desc: t('feat_audio_desc'), color: 'text-sage' },
    { icon: Globe2, title: t('feat_url_title'), desc: t('feat_url_desc'), color: 'text-sky-200' },
    { icon: Fingerprint, title: t('feat_signals_title'), desc: t('feat_signals_desc'), color: 'text-amber-200' },
    { icon: Share2, title: t('feat_share_title'), desc: t('feat_share_desc'), color: 'text-stone-200' },
  ];

  const steps = [
    { num: '01', title: t('how_step1_title'), desc: t('how_step1_desc') },
    { num: '02', title: t('how_step2_title'), desc: t('how_step2_desc') },
    { num: '03', title: t('how_step3_title'), desc: t('how_step3_desc') },
  ];

  const plans = [
    {
      title: t('pricing_free'),
      desc: t('pricing_free_desc'),
      price: '$0',
      items: [t('pricing_free_f1'), t('pricing_free_f2'), t('pricing_free_f3'), t('pricing_free_f4')],
      cta: t('pricing_cta_free'),
      to: '/analyze',
      testId: 'landing-pricing-tier-free'
    },
    {
      title: t('pricing_pro'),
      desc: t('pricing_pro_desc'),
      price: t('pricing_pro_price'),
      items: [t('pricing_pro_f1'), t('pricing_pro_f2'), t('pricing_pro_f3'), t('pricing_pro_f4'), t('pricing_pro_f5')],
      cta: t('pricing_cta_pro'),
      to: '/analyze',
      featured: true,
      testId: 'landing-pricing-tier-pro'
    },
    {
      title: t('pricing_enterprise'),
      desc: t('pricing_enterprise_desc'),
      price: t('pricing_enterprise_price'),
      items: [t('pricing_enterprise_f1'), t('pricing_enterprise_f2'), t('pricing_enterprise_f3'), t('pricing_enterprise_f4'), t('pricing_enterprise_f5')],
      cta: t('pricing_cta_enterprise'),
      to: '/enterprise',
      testId: 'landing-pricing-tier-enterprise'
    }
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      <section className="relative isolate min-h-[calc(100vh-4rem)] hero-gradient" data-testid="landing-hero">
        <div className="absolute inset-0 -z-10 evidence-grid" />
        <div className="absolute left-[8%] top-24 hidden h-32 w-32 rounded-full border border-white/10 bg-white/[0.03] blur-sm lg:block" />
        <div className="absolute bottom-20 right-[12%] hidden h-52 w-52 rounded-full border border-copper/20 bg-copper/10 blur-2xl lg:block" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-24 lg:py-28">
          <div className="grid lg:grid-cols-[1.02fr_0.98fr] gap-12 lg:gap-16 items-center">
            <motion.div {...fadeInUp} className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-white/12 bg-white/[0.06] text-stone-200 text-xs font-medium mb-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <ScanSearch className="w-3.5 h-3.5 text-copper" />
                {t('hero_badge')}
              </div>
              <h1 className="max-w-4xl font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-[-0.055em] leading-[0.86] text-balance">
                {t('hero_title')}<br />
                <span className="text-gradient-soft">{t('hero_title2')}</span>
              </h1>
              <p className="mt-7 text-base sm:text-lg text-muted-foreground max-w-xl leading-8">
                {t('hero_subtitle')}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  to="/analyze"
                  data-testid="hero-cta-primary"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold bg-sand text-stone-950 rounded-full hover:bg-white btn-press transition-colors shadow-[0_18px_60px_rgba(232,214,177,0.18)]"
                >
                  {t('hero_cta')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/enterprise"
                  data-testid="hero-cta-secondary"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium border border-white/12 bg-white/[0.04] rounded-full hover:border-sand/40 hover:bg-white/[0.07] transition-colors"
                >
                  {t('hero_cta2')}
                </Link>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-3 max-w-xl">
                {[
                  ['3', t('hero_stat_models')],
                  ['42s', t('hero_stat_time')],
                  ['0', t('hero_stat_signup')]
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 backdrop-blur">
                    <p className="font-serif text-3xl tracking-tight text-sand">{value}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24, rotate: 1.5 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease: 'easeOut' }}
              className="relative min-h-[520px]"
            >
              <div className="case-board absolute inset-0 rounded-[2rem] border border-white/12 bg-[#211b16]/80 p-5 shadow-2xl backdrop-blur">
                <div className="absolute inset-0 rounded-[2rem] case-board-texture" />
                <div className="relative h-full">
                  <div className="absolute left-6 top-6 rotate-[-5deg] w-56 sm:w-64 evidence-photo">
                    <div className="aspect-[4/3] rounded-t-sm bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.55),transparent_18%),linear-gradient(135deg,#2b1e18,#b05e36_45%,#111)]" />
                    <div className="bg-stone-100 px-3 py-2 text-stone-900">
                      <p className="font-hand text-lg leading-none">{t('case_photo_caption')}</p>
                    </div>
                  </div>

                  <div className="absolute right-5 top-11 rotate-[4deg] w-52 sm:w-60 evidence-note">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-copper">{t('case_note_label')}</p>
                    <p className="mt-2 font-serif text-2xl leading-7 text-stone-50">{t('case_note_title')}</p>
                    <p className="mt-3 text-sm leading-6 text-stone-300">{t('case_note_body')}</p>
                  </div>

                  <div className="absolute left-[18%] top-[45%] h-[1px] w-[62%] rotate-[13deg] bg-red-400/55 shadow-[0_0_18px_rgba(248,113,113,0.28)]" />
                  <div className="absolute left-[30%] top-[28%] h-[1px] w-[50%] rotate-[-23deg] bg-red-300/45" />
                  <div className="pin left-[25%] top-[38%]" />
                  <div className="pin right-[18%] top-[31%]" />
                  <div className="pin left-[42%] bottom-[28%]" />

                  <div className="absolute left-4 bottom-7 rotate-[3deg] w-64 rounded-2xl border border-white/12 bg-black/55 p-4 backdrop-blur-md">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{t('case_consensus')}</span>
                      <span className="text-sage">81/100</span>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full w-[81%] rounded-full bg-gradient-to-r from-copper via-sand to-sage" />
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                      {['GPT', 'Claude', 'Gemini'].map((name, index) => (
                        <div key={name} className="rounded-xl border border-white/10 bg-white/[0.04] px-2 py-2">
                          <p className="text-[10px] text-muted-foreground">{name}</p>
                          <p className="font-mono text-sm text-stone-100">{[82, 72, 88][index]}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="absolute right-5 bottom-8 rotate-[-6deg] w-52 rounded-xl border border-stone-900/20 bg-[#f1e7d2] p-4 text-stone-900 shadow-xl">
                    <p className="font-hand text-2xl">{t('case_margin_title')}</p>
                    <p className="mt-2 text-xs leading-5">{t('case_margin_body')}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative py-18 sm:py-24" data-testid="landing-features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="max-w-2xl mb-12">
            <p className="text-xs uppercase tracking-[0.22em] text-copper mb-3">{t('features_eyebrow')}</p>
            <h2 className="font-serif text-4xl sm:text-5xl tracking-[-0.045em]">{t('features_title')}</h2>
            <p className="mt-4 text-muted-foreground leading-7">{t('features_subtitle')}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="bento-card group min-h-[210px] p-6 rounded-[1.35rem] border border-white/10 bg-white/[0.035]"
              >
                <div className={`w-11 h-11 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center mb-5 ${feat.color}`}>
                  <feat.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feat.title}</h3>
                <p className="text-sm text-muted-foreground leading-7">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-18 sm:py-24 bg-black/20" data-testid="landing-how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-copper mb-3">{t('how_eyebrow')}</p>
              <h2 className="font-serif text-4xl sm:text-5xl tracking-[-0.045em]">{t('how_title')}</h2>
              <div className="mt-8 rounded-2xl border border-amber-300/18 bg-amber-300/[0.06] p-5">
                <h4 className="text-sm font-semibold text-amber-100 mb-2">{t('how_disclaimer')}</h4>
                <p className="text-sm text-muted-foreground leading-7">{t('how_disclaimer_text')}</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  className="relative min-h-[240px] rounded-[1.4rem] border border-white/10 bg-card/70 p-5"
                >
                  <span className="font-serif text-5xl text-white/12">{step.num}</span>
                  <h3 className="mt-10 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-7">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-18 sm:py-24" data-testid="landing-pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.22em] text-copper mb-3">{t('pricing_eyebrow')}</p>
            <h2 className="font-serif text-4xl sm:text-5xl tracking-[-0.045em]">{t('pricing_title')}</h2>
            <p className="mt-4 text-muted-foreground">{t('pricing_subtitle')}</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.title}
                className={`relative p-6 rounded-[1.5rem] border bg-white/[0.035] ${plan.featured ? 'pricing-highlight border-sand/50' : 'border-white/10'}`}
                data-testid={plan.testId}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-6 px-3 py-1 bg-sand text-stone-950 text-xs font-semibold rounded-full">
                    {t('pricing_popular')}
                  </div>
                )}
                <h3 className="text-xl font-semibold">{plan.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-6">{plan.desc}</p>
                <div className="mt-6 mb-7">
                  <span className="font-serif text-5xl tracking-[-0.06em]">{plan.price}</span>
                </div>
                <ul className="space-y-3 mb-7">
                  {plan.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <BadgeCheck className="w-4 h-4 mt-0.5 text-sage shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={plan.to}
                  className={`block w-full text-center px-4 py-3 text-sm font-semibold rounded-full transition-colors ${
                    plan.featured
                      ? 'bg-sand text-stone-950 hover:bg-white'
                      : 'border border-white/12 hover:border-sand/40 hover:bg-white/[0.05]'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 sm:py-28 bg-card/50" data-testid="landing-cta">
        <div className="absolute inset-0 evidence-grid opacity-40" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <Sparkles className="mx-auto mb-5 w-6 h-6 text-copper" />
          <h2 className="font-serif text-4xl sm:text-6xl tracking-[-0.055em]">{t('cta_title')}</h2>
          <p className="mt-5 text-muted-foreground leading-7">{t('cta_subtitle')}</p>
          <Link
            to="/analyze"
            data-testid="cta-button"
            className="inline-flex items-center gap-2 mt-9 px-8 py-3.5 text-sm font-semibold bg-sand text-stone-950 rounded-full hover:bg-white btn-press transition-colors"
          >
            {t('cta_button')}
            <ShieldCheck className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
