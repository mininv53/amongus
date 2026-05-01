import React, { useState } from 'react';
import { useLanguage } from '../i18n';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Code2, Check, Send, Newspaper, Layers, Phone, ShieldCheck } from 'lucide-react';
import ParticleField from '../components/ParticleField';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

export default function Enterprise() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error(t('enterprise_required'));
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
        toast.success(t('enterprise_submitted'));
      } else {
        toast.error('Failed to submit form');
      }
    } catch (error) {
      toast.error('Failed to submit form');
    } finally {
      setSubmitting(false);
    }
  };

  const useCases = [
    { icon: Newspaper, title: t('enterprise_usecase1'), desc: t('enterprise_usecase1_desc') },
    { icon: Layers, title: t('enterprise_usecase2'), desc: t('enterprise_usecase2_desc') },
    { icon: Phone, title: t('enterprise_usecase3'), desc: t('enterprise_usecase3_desc') },
    { icon: ShieldCheck, title: t('enterprise_usecase4'), desc: t('enterprise_usecase4_desc') },
  ];

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden" data-testid="enterprise-hero">
        <div className="aurora-bg" />
        <ParticleField className="opacity-50" density={900} />
        <div className="container-page relative pt-16 sm:pt-20 pb-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card/60 backdrop-blur text-[11px] uppercase tracking-[0.16em] text-muted-foreground"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_2px_hsl(var(--primary))]" />
              {t('enterprise_eyebrow')}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="mt-6 font-serif text-4xl sm:text-5xl lg:text-6xl tighter"
            >
              {t('enterprise_title')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="mt-5 text-base sm:text-lg text-muted-foreground"
            >
              {t('enterprise_subtitle')}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Use cases + API code */}
      <section className="container-page py-16 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-start">
          <div className="space-y-3">
            {useCases.map((uc) => (
              <div
                key={uc.title}
                className="bento-card p-5 flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl border border-primary/30 bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <uc.icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold">{uc.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{uc.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bento-card overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-card/40">
              <Code2 className="w-4 h-4 text-primary" />
              <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
                example.py
              </span>
            </div>
            <pre className="p-5 text-xs font-mono text-muted-foreground overflow-x-auto leading-relaxed">
{`import requests

response = requests.post(
    "https://api.deepguard.ai/v1/analyze",
    headers={
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json",
    },
    json={
        "type": "image",
        "url": "https://example.com/photo.jpg",
        "language": "en",
    },
)

result = response.json()
print(f"Trust Score: {result['trust_score']}")
print(f"Verdict:     {result['verdict']}")
print(f"Signals:     {len(result['signals'])}")`}
            </pre>
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section
        className="container-page pb-24"
        data-testid="enterprise-contact"
      >
        <div className="max-w-xl mx-auto bento-card p-7 sm:p-9 halo-teal">
          <div className="text-center mb-6">
            <h2 className="font-serif text-3xl tighter">{t('enterprise_form_title')}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t('enterprise_form_subtitle')}</p>
          </div>

          {submitted ? (
            <div className="text-center p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-3">
                <Check className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm font-medium">{t('enterprise_submitted')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" data-testid="enterprise-form">
              <Field
                label={`${t('enterprise_name')} *`}
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                testId="enterprise-name-input"
              />
              <Field
                type="email"
                label={`${t('enterprise_email')} *`}
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                testId="enterprise-email-input"
              />
              <Field
                label={t('enterprise_company')}
                value={form.company}
                onChange={(v) => setForm({ ...form, company: v })}
                testId="enterprise-company-input"
              />
              <div>
                <label className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-1.5 block">
                  {t('enterprise_message')} *
                </label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  data-testid="enterprise-message-input"
                  className="w-full px-4 py-3 text-sm rounded-2xl bg-background/60 border border-border focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                data-testid="enterprise-submit-button"
                className="pill pill-primary w-full justify-center !py-3 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {submitting ? t('enterprise_submitting') : t('enterprise_submit')}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', testId }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-1.5 block">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-testid={testId}
        className="w-full px-4 py-3 text-sm rounded-2xl bg-background/60 border border-border focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
      />
    </div>
  );
}
