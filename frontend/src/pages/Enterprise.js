import React, { useState } from 'react';
import { useLanguage } from '../i18n';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Code2, Phone, Users, Newspaper, Webhook, Layers, Headphones, Send, Check } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

export default function Enterprise() {
  const { t, lang } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error(lang === 'ru' ? 'Заполните обязательные поля' : 'Please fill required fields');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setSubmitted(true);
        toast.success(t('enterprise_submitted'));
      }
    } catch (error) {
      toast.error('Failed to submit form');
    } finally {
      setSubmitting(false);
    }
  };

  const useCases = [
    { icon: Phone, title: t('enterprise_usecase1'), desc: t('enterprise_usecase1_desc') },
    { icon: Users, title: t('enterprise_usecase2'), desc: t('enterprise_usecase2_desc') },
    { icon: Newspaper, title: t('enterprise_usecase3'), desc: t('enterprise_usecase3_desc') },
  ];

  const integrations = [
    { icon: Webhook, title: 'Webhook Events', desc: 'Real-time notifications for every analysis completion' },
    { icon: Layers, title: 'Batch Processing', desc: 'Analyze thousands of files in parallel via our queue system' },
    { icon: Headphones, title: 'Dedicated Support', desc: '99.9% uptime SLA with 24/7 engineering support' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative hero-gradient py-16 sm:py-24" data-testid="enterprise-hero">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
                {t('enterprise_title')}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                {t('enterprise_subtitle')}
              </p>
              <p className="mt-3 text-muted-foreground">
                {t('enterprise_hero_desc')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* API Code snippet */}
      <section className="py-16 sm:py-24" data-testid="enterprise-api">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight mb-4">{t('enterprise_api_title')}</h2>
              <p className="text-muted-foreground mb-6">
                {lang === 'ru' ? 'Один API-вызов для проверки любого медиа на подлинность.' : 'One API call to verify any media for authenticity.'}
              </p>
              {/* Use cases */}
              <div className="space-y-4">
                {useCases.map((uc, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-card/50 transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <uc.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">{uc.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{uc.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Code snippet */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
                <Code2 className="w-4 h-4 text-primary" />
                <span className="text-xs font-mono text-muted-foreground">example.py</span>
              </div>
              <pre className="p-4 text-xs font-mono text-muted-foreground overflow-x-auto">
{`import requests

response = requests.post(
    "https://api.deepguard.ai/v1/analyze",
    headers={
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json"
    },
    json={
        "type": "image",
        "url": "https://example.com/photo.jpg",
        "language": "en"
    }
)

result = response.json()
print(f"Trust Score: {result['trust_score']}")
print(f"Verdict: {result['verdict']}")
print(f"Signals: {len(result['signals'])}")`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Integration cards */}
      <section className="py-16 sm:py-24 bg-card/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid sm:grid-cols-3 gap-4">
            {integrations.map((int, i) => (
              <div key={i} className="p-5 rounded-xl border border-border bg-card/50 bento-card">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <int.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold mb-1">{int.title}</h3>
                <p className="text-sm text-muted-foreground">{int.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section className="py-16 sm:py-24" data-testid="enterprise-contact">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">{t('enterprise_contact_title')}</h2>
            <p className="mt-2 text-muted-foreground text-sm">{t('enterprise_contact_subtitle')}</p>
          </div>

          {submitted ? (
            <div className="text-center p-8 rounded-xl border border-primary/30 bg-primary/5">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Check className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm font-medium">{t('enterprise_submitted')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" data-testid="enterprise-form">
              <div>
                <label className="text-sm font-medium mb-1 block">{t('enterprise_name')} *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  data-testid="enterprise-name-input"
                  className="w-full px-4 py-2.5 text-sm rounded-lg bg-card border border-border focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">{t('enterprise_email')} *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  data-testid="enterprise-email-input"
                  className="w-full px-4 py-2.5 text-sm rounded-lg bg-card border border-border focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">{t('enterprise_company')}</label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  data-testid="enterprise-company-input"
                  className="w-full px-4 py-2.5 text-sm rounded-lg bg-card border border-border focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">{t('enterprise_message')} *</label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  data-testid="enterprise-message-input"
                  className="w-full px-4 py-2.5 text-sm rounded-lg bg-card border border-border focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                data-testid="enterprise-submit-button"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 btn-press transition-colors"
              >
                <Send className="w-4 h-4" />
                {t('enterprise_submit')}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
