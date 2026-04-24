import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../i18n';
import { Loader2, ArrowLeft, Clock, FileType, AlertTriangle } from 'lucide-react';
import TrustScoreGauge from '../components/TrustScoreGauge';
import SignalBreakdown from '../components/SignalBreakdown';
import ModelConsensus from '../components/ModelConsensus';

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

  const getVerdictColor = (verdict) => {
    if (!verdict) return 'text-muted-foreground';
    if (verdict.includes('AUTHENTIC') || verdict.includes('TRUSTWORTHY')) return 'text-green-400';
    if (verdict.includes('UNCERTAIN')) return 'text-amber-400';
    return 'text-red-400';
  };

  const getVerdictBg = (verdict) => {
    if (!verdict) return 'bg-muted/20';
    if (verdict.includes('AUTHENTIC') || verdict.includes('TRUSTWORTHY')) return 'bg-green-500/10 border-green-500/20';
    if (verdict.includes('UNCERTAIN')) return 'bg-amber-500/10 border-amber-500/20';
    return 'bg-red-500/10 border-red-500/20';
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-20">
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-20 text-center">
        <p className="text-muted-foreground mb-4">{error}</p>
        <Link to="/analyze" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm">
          <ArrowLeft className="w-4 h-4" />
          {t('shared_back')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link to="/analyze" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {t('shared_back')}
          </Link>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">{t('shared_title')}</h1>
        </div>
      </div>

      {/* Meta info */}
      <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          <span>{t('shared_analyzed')}: {result.created_at ? new Date(result.created_at).toLocaleString() : '-'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <FileType className="w-4 h-4" />
          <span>{t('shared_type')}: <span className="capitalize text-foreground">{result.analysis_type}</span></span>
        </div>
      </div>

      {/* Score + Verdict */}
      <div className="p-6 rounded-2xl border border-border bg-card mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <TrustScoreGauge score={result.trust_score || 0} />
          <div className="flex-1 text-center sm:text-left">
            <div className={`inline-flex items-center px-3 py-1.5 rounded-full border text-sm font-medium ${getVerdictBg(result.verdict)} ${getVerdictColor(result.verdict)}`} data-testid="analysis-result-verdict">
              {t(`verdict_${result.verdict}`) || result.verdict}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {t('result_confidence')}: <span className="text-foreground font-medium">{((result.confidence || 0) * 100).toFixed(0)}%</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed">{result.summary}</p>
          </div>
        </div>
      </div>

      {/* Multi-Model Consensus */}
      {result.model_results && result.model_results.length > 0 && (
        <div className="p-6 rounded-2xl border border-border bg-card mb-6">
          <ModelConsensus
            modelResults={result.model_results}
            consensusStrength={result.consensus_strength}
            modelsUsed={result.models_used}
            modelsTotal={result.models_total}
          />
        </div>
      )}

      {/* Signals */}
      <div className="p-6 rounded-2xl border border-border bg-card mb-6">
        <h3 className="text-base font-semibold mb-4">{t('result_signals')}</h3>
        <SignalBreakdown signals={result.top_signals || []} />
      </div>

      {/* Recommendations */}
      {result.recommendations && result.recommendations.length > 0 && (
        <div className="p-6 rounded-2xl border border-border bg-card mb-6">
          <h3 className="text-base font-semibold mb-3">{t('result_recommendations')}</h3>
          <ul className="space-y-2">
            {result.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-primary">&rarr;</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer */}
      <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">{t('shared_disclaimer')}</p>
        </div>
      </div>
    </div>
  );
}
