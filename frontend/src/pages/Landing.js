import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n';
import { motion } from 'framer-motion';
import { Shield, Image, Music, Link2, Search, Share2, Globe, ArrowRight, Check, AlertTriangle, Layers } from 'lucide-react';

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

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative hero-gradient" data-testid="landing-hero">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-28 lg:py-36">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeInUp}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-medium mb-6">
                <Shield className="w-3.5 h-3.5" />
                Multi-Model AI Deepfake Detection
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight">
                {t('hero_title')}<br />
                <span className="text-primary">{t('hero_title2')}</span>
              </h1>
              <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-lg leading-relaxed">
                {t('hero_subtitle')}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/analyze"
                  data-testid="hero-cta-primary"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 btn-press transition-colors"
                >
                  {t('hero_cta')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/enterprise"
                  data-testid="hero-cta-secondary"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium border border-border rounded-lg hover:border-primary/50 hover:bg-card/50 transition-colors"
                >
                  {t('hero_cta2')}
                </Link>
              </div>
            </motion.div>

            {/* Demo Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative p-6 rounded-2xl border border-border bg-card/80 backdrop-blur glow-teal">
                <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                  <div className="scanner-sheen absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-primary/8 to-transparent" />
                </div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                    <span className="ml-2 text-xs text-muted-foreground font-mono">analysis_result.json</span>
                  </div>
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex gap-2">
                      <span className="text-muted-foreground">{'{'}</span>
                    </div>
                    <div className="flex gap-2 pl-4">
                      <span className="text-primary">"consensus_score"</span>:
                      <span className="text-lime-400">81</span>,
                    </div>
                    <div className="flex gap-2 pl-4">
                      <span className="text-primary">"models"</span>:
                      <span className="text-muted-foreground">[</span>
                    </div>
                    <div className="flex gap-2 pl-8">
                      <span className="text-emerald-400">"GPT-5.1"</span>: <span className="text-lime-400">82</span>,
                    </div>
                    <div className="flex gap-2 pl-8">
                      <span className="text-orange-400">"Claude 4.5"</span>: <span className="text-lime-400">72</span>,
                    </div>
                    <div className="flex gap-2 pl-8">
                      <span className="text-blue-400">"Gemini 2.5"</span>: <span className="text-lime-400">88</span>
                    </div>
                    <div className="flex gap-2 pl-4">
                      <span className="text-muted-foreground">]</span>,
                    </div>
                    <div className="flex gap-2 pl-4">
                      <span className="text-primary">"consensus"</span>:
                      <span className="text-green-400">"unanimous"</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-muted-foreground">{'}'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Social proof - removed for clean prototype look */}
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24" data-testid="landing-features">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">{t('features_title')}</h2>
            <p className="mt-3 text-muted-foreground">{t('features_subtitle')}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bento-card p-5 rounded-xl border border-border bg-card/50 group"
              >
                <div className={`w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center mb-3 ${feat.color}`}>
                  <feat.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold mb-1.5">{feat.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-24 bg-card/30" data-testid="landing-how-it-works">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">{t('how_title')}</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 mb-12">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-sm font-semibold text-primary font-mono">{step.num}</span>
                </div>
                <h3 className="text-base font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
          {/* Disclaimer */}
          <div className="max-w-xl mx-auto p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-amber-400 mb-1">{t('how_disclaimer')}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{t('how_disclaimer_text')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 sm:py-24" data-testid="landing-pricing">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">{t('pricing_title')}</h2>
            <p className="mt-3 text-muted-foreground">{t('pricing_subtitle')}</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Free */}
            <div className="p-6 rounded-xl border border-border bg-card/50" data-testid="landing-pricing-tier-free">
              <h3 className="text-lg font-semibold">{t('pricing_free')}</h3>
              <p className="text-sm text-muted-foreground mt-1">{t('pricing_free_desc')}</p>
              <div className="mt-4 mb-6">
                <span className="text-3xl font-bold font-['Space_Grotesk']">$0</span>
              </div>
              <ul className="space-y-2.5 mb-6">
                {[t('pricing_free_f1'), t('pricing_free_f2'), t('pricing_free_f3'), t('pricing_free_f4')].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/analyze" className="block w-full text-center px-4 py-2.5 text-sm font-medium border border-border rounded-lg hover:border-primary/50 transition-colors">
                {t('pricing_cta_free')}
              </Link>
            </div>

            {/* Pro */}
            <div className="p-6 rounded-xl pricing-highlight bg-card relative" data-testid="landing-pricing-tier-pro">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                {t('pricing_popular')}
              </div>
              <h3 className="text-lg font-semibold">{t('pricing_pro')}</h3>
              <p className="text-sm text-muted-foreground mt-1">{t('pricing_pro_desc')}</p>
              <div className="mt-4 mb-6">
                <span className="text-3xl font-bold font-['Space_Grotesk']">{t('pricing_pro_price')}</span>
              </div>
              <ul className="space-y-2.5 mb-6">
                {[t('pricing_pro_f1'), t('pricing_pro_f2'), t('pricing_pro_f3'), t('pricing_pro_f4'), t('pricing_pro_f5')].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/analyze" className="block w-full text-center px-4 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 btn-press transition-colors">
                {t('pricing_cta_pro')}
              </Link>
            </div>

            {/* Enterprise */}
            <div className="p-6 rounded-xl border border-border bg-card/50" data-testid="landing-pricing-tier-enterprise">
              <h3 className="text-lg font-semibold">{t('pricing_enterprise')}</h3>
              <p className="text-sm text-muted-foreground mt-1">{t('pricing_enterprise_desc')}</p>
              <div className="mt-4 mb-6">
                <span className="text-3xl font-bold font-['Space_Grotesk']">{t('pricing_enterprise_price')}</span>
              </div>
              <ul className="space-y-2.5 mb-6">
                {[t('pricing_enterprise_f1'), t('pricing_enterprise_f2'), t('pricing_enterprise_f3'), t('pricing_enterprise_f4'), t('pricing_enterprise_f5')].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/enterprise" className="block w-full text-center px-4 py-2.5 text-sm font-medium border border-border rounded-lg hover:border-primary/50 transition-colors">
                {t('pricing_cta_enterprise')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-24 bg-card/50" data-testid="landing-cta">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">{t('cta_title')}</h2>
          <p className="mt-4 text-muted-foreground">{t('cta_subtitle')}</p>
          <Link
            to="/analyze"
            data-testid="cta-button"
            className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 btn-press transition-colors"
          >
            {t('cta_button')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
