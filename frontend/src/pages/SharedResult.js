import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../i18n';
import { Loader2, ArrowLeft, Clock, FileType, AlertTriangle, ArrowRight } from 'lucide-react';
import TrustScoreGauge from '../components/TrustScoreGauge';
import SignalBreakdown from '../components/SignalBreakdown';
import ModelConsensus from '../components/ModelConsensus';
import ParticleField from '../components/ParticleField';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

export default function SharedResult() {
  const { id } = useParams();
  const { t } = useLanguage();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await fetch(`${API_URL}/api/analyses/${id}`);
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        setResult(data);
      } catch (err) {
        setError(t('shared_not_found'));
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [id, t]);

  const verdictTone = (verdict) => {
    if (!verdict) return { fg: 'text-muted-foreground', bg: 'bg-muted/20 border-border' };
    const v = verdict.toUpperCase();
    if (v.includes('AUTHENTIC') || v.includes('TRUSTWORTHY'))
      return { fg: 'text-emerald-300', bg: 'bg-emerald-500/10 border-emerald-500/25' };
    if (v.includes('UNCERTAIN'))
      return { fg: 'text-amber-300', bg: 'bg-amber-500/10 border-amber-500/25' };
    return { fg: 'text-red-300', bg: 'bg-red-500/10 border-red-500/25' };
  };

  if (loading) {
    return (
      <div className="container-page py-24">
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-page py-24 text-center">
        <p className="text-muted-foreground mb-5">{error}</p>
        <Link to="/analyze" className="pill pill-primary">
          {t('shared_back')}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const tone = verdictTone(result.verdict);

  return (
    <div className="relative">
      {/* Hero header */}
      <section className="relative overflow-hidden">
        <div className="aurora-bg" />
        <ParticleField className="opacity-50" density={900} />
        <div className="container-page relative pt-12 sm:pt-16 pb-6">
          <Link
            to="/analyze"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors mb-5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {t('shared_back')}
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <h1 className="font-serif text-4xl sm:text-5xl tighter">{t('shared_title')}</h1>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {result.created_at ? new Date(result.created_at).toLocaleString() : '-'}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <FileType className="w-3.5 h-3.5" />
                <span className="capitalize">{result.analysis_type}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page pb-20">
        <div className="max-w-3xl mx-auto space-y-5">
          {/* Score + Verdict */}
          <div className="bento-card p-6 sm:p-8 halo-teal">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <TrustScoreGauge score={result.trust_score || 0} />
              <div className="flex-1 text-center sm:text-left">
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-full border text-sm font-medium ${tone.bg} ${tone.fg}`}
                  data-testid="analysis-result-verdict"
                >
                  {result.verdict}
                </span>
                <p className="mt-3 text-sm text-muted-foreground">
                  {t('result_confidence')}:{' '}
                  <span className="text-foreground font-medium">
                    {((result.confidence || 0) * 100).toFixed(0)}%
                  </span>
                </p>
                <p className="mt-3 text-sm leading-relaxed">{result.summary}</p>
              </div>
            </div>
          </div>

          {result.model_results && result.model_results.length > 0 && (
            <div className="bento-card p-6">
              <ModelConsensus
                modelResults={result.model_results}
                consensusStrength={result.consensus_strength}
                modelsUsed={result.models_used}
                modelsTotal={result.models_total}
              />
            </div>
          )}

          <div className="bento-card p-6">
            <h3 className="text-base font-semibold mb-4">{t('result_signals')}</h3>
            <SignalBreakdown signals={result.top_signals || []} />
          </div>

          {result.recommendations && result.recommendations.length > 0 && (
            <div className="bento-card p-6">
              <h3 className="text-base font-semibold mb-3">{t('result_recommendations')}</h3>
              <ul className="space-y-2">
                {result.recommendations.map((rec) => (
                  <li
                    key={rec}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t('how_disclaimer_text')}
              </p>
            </div>
          </div>

          {/* CTA back to analyzer */}
          <div className="text-center pt-4">
            <Link to="/analyze" className="pill pill-primary">
              {t('shared_back')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
