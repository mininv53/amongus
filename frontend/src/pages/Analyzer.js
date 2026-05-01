import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../i18n';
import { toast } from 'sonner';
import {
  Image as ImageIcon,
  Music,
  Link2,
  Loader2,
  ArrowRight,
  Share2,
  Copy,
  RotateCcw,
  Info,
  Check,
} from 'lucide-react';
import TrustScoreGauge from '../components/TrustScoreGauge';
import SignalBreakdown from '../components/SignalBreakdown';
import DropzoneUpload from '../components/DropzoneUpload';
import ModelConsensus from '../components/ModelConsensus';
import ParticleField from '../components/ParticleField';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

export default function Analyzer() {
  const { t, lang } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('image');
  const [selectedFile, setSelectedFile] = useState(null);
  const [urlInput, setUrlInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const autorunRef = useRef(false);

  const analysisSteps = [
    { label: t('analyze_step_upload') },
    { label: t('analyze_step_gpt') },
    { label: t('analyze_step_claude') },
    { label: t('analyze_step_gemini') },
    { label: t('analyze_step_consensus') },
  ];

  const tabs = [
    { id: 'image', icon: ImageIcon, label: t('tab_image') },
    { id: 'audio', icon: Music, label: t('tab_audio') },
    { id: 'url', icon: Link2, label: t('tab_url') },
  ];

  const runAnalyze = useCallback(
    async ({ tab, file, urlValue }) => {
      setIsAnalyzing(true);
      setResult(null);
      setCurrentStep(0);

      const stepInterval = setInterval(() => {
        setCurrentStep((prev) => Math.min(prev + 1, 4));
      }, 4000);

      try {
        let response;
        if (tab === 'image' || tab === 'audio') {
          if (!file) {
            toast.error(lang === 'ru' ? 'Выберите файл' : 'Please select a file');
            return;
          }
          const formData = new FormData();
          formData.append('file', file);
          formData.append('language', lang);
          response = await fetch(`${API_URL}/api/analyze/${tab}`, {
            method: 'POST',
            body: formData,
          });
        } else {
          const trimmed = (urlValue || '').trim();
          if (!trimmed) {
            toast.error(lang === 'ru' ? 'Введите URL' : 'Please enter a URL');
            return;
          }
          response = await fetch(`${API_URL}/api/analyze/url`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: trimmed, language: lang }),
          });
        }

        setCurrentStep(4);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || `Analysis failed (${response.status})`);
        }

        const data = await response.json();
        setResult(data);
      } catch (error) {
        toast.error(error.message || 'Analysis failed');
      } finally {
        clearInterval(stepInterval);
        setIsAnalyzing(false);
      }
    },
    [lang],
  );

  // Pick up ?url= from query string and auto-run on first mount
  useEffect(() => {
    if (autorunRef.current) return;
    const queryUrl = searchParams.get('url');
    if (queryUrl) {
      autorunRef.current = true;
      setActiveTab('url');
      setUrlInput(queryUrl);
      runAnalyze({ tab: 'url', urlValue: queryUrl });
      // Clean the param so refreshes don't re-trigger
      const next = new URLSearchParams(searchParams);
      next.delete('url');
      setSearchParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnalyze = () =>
    runAnalyze({ tab: activeTab, file: selectedFile, urlValue: urlInput });

  const handleNewScan = () => {
    setResult(null);
    setSelectedFile(null);
    setUrlInput('');
    setCurrentStep(0);
  };

  const handleCopyLink = () => {
    if (result?.public_id) {
      const shareUrl = `${window.location.origin}/r/${result.public_id}`;
      navigator.clipboard.writeText(shareUrl);
      toast.success(t('result_link_copied'));
    }
  };

  const verdictTone = (verdict) => {
    if (!verdict) return { fg: 'text-muted-foreground', bg: 'bg-muted/20 border-border' };
    const v = verdict.toUpperCase();
    if (v.includes('AUTHENTIC') || v.includes('TRUSTWORTHY'))
      return { fg: 'text-emerald-300', bg: 'bg-emerald-500/10 border-emerald-500/25' };
    if (v.includes('UNCERTAIN'))
      return { fg: 'text-amber-300', bg: 'bg-amber-500/10 border-amber-500/25' };
    return { fg: 'text-red-300', bg: 'bg-red-500/10 border-red-500/25' };
  };

  return (
    <div className="relative">
      {/* Hero header */}
      <section className="relative overflow-hidden">
        <div className="aurora-bg" />
        <ParticleField className="opacity-50" density={900} />
        <div className="container-page relative pt-12 sm:pt-16 pb-6 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card/60 backdrop-blur text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_2px_hsl(var(--primary))]" />
            {t('analyzer_eyebrow')}
          </span>
          <h1
            className="mt-6 font-serif text-4xl sm:text-5xl tighter"
            data-testid="analyzer-title"
          >
            {t('analyzer_title')}
          </h1>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">{t('analyzer_subtitle')}</p>
        </div>
      </section>

      <section className="container-page pb-20">
        <div className="max-w-3xl mx-auto">
          {!result ? (
            <div className="bento-card p-6 sm:p-8">
              {/* Tabs */}
              <div className="segmented w-full justify-stretch mb-6" data-testid="analyzer-tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    data-active={activeTab === tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSelectedFile(null);
                      setUrlInput('');
                    }}
                    data-testid={`tab-${tab.id}`}
                    className="segmented-item flex-1 gap-2"
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Upload area */}
              <div className="mb-5">
                {activeTab === 'url' ? (
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder={t('url_placeholder')}
                      data-testid="analyzer-url-input"
                      className="w-full px-4 py-3.5 text-sm rounded-2xl bg-background/60 border border-border focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono placeholder:font-sans placeholder:text-muted-foreground/70 transition-colors"
                    />
                    <p className="text-xs text-muted-foreground pl-1">{t('url_hint')}</p>
                  </div>
                ) : (
                  <DropzoneUpload
                    type={activeTab}
                    onFileSelect={setSelectedFile}
                    disabled={isAnalyzing}
                  />
                )}
              </div>

              {/* Analyze button */}
              <button
                onClick={handleAnalyze}
                disabled={
                  isAnalyzing ||
                  (activeTab !== 'url' && !selectedFile) ||
                  (activeTab === 'url' && !urlInput.trim())
                }
                data-testid="analyze-button"
                className="pill pill-primary w-full justify-center !py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('analyzing')}
                  </>
                ) : (
                  <>
                    {t('analyze_button')}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Analysis steps */}
              {isAnalyzing && (
                <div
                  className="mt-6 p-5 rounded-2xl border border-border bg-card/60"
                  data-testid="scan-timeline"
                >
                  <div className="space-y-3">
                    {analysisSteps.map((step, i) => (
                      <div key={step.label} className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-mono ${
                            currentStep > i
                              ? 'bg-primary/20 text-primary'
                              : currentStep === i
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {currentStep > i ? <Check className="w-3.5 h-3.5" /> : i + 1}
                        </div>
                        <span
                          className={`text-sm ${
                            currentStep >= i ? 'text-foreground' : 'text-muted-foreground'
                          }`}
                        >
                          {step.label}
                        </span>
                        {currentStep === i && (
                          <Loader2 className="w-3 h-3 animate-spin text-primary ml-auto" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education card */}
              <div className="mt-7 p-5 rounded-2xl border border-border bg-card/40">
                <div className="flex items-start gap-3">
                  <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold mb-2">{t('edu_title')}</p>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      <li className="text-emerald-300">{t('edu_80_100')}</li>
                      <li className="text-primary">{t('edu_60_80')}</li>
                      <li className="text-amber-300">{t('edu_40_60')}</li>
                      <li className="text-orange-300">{t('edu_20_40')}</li>
                      <li className="text-red-300">{t('edu_0_20')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* === Results === */
            <div className="space-y-6" data-testid="analysis-result">
              {/* Score + Verdict */}
              <div className="bento-card p-6 sm:p-8 halo-teal">
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  <TrustScoreGauge score={result.trust_score || 0} />
                  <div className="flex-1 text-center sm:text-left">
                    {(() => {
                      const tone = verdictTone(result.verdict);
                      return (
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full border text-sm font-medium ${tone.bg} ${tone.fg}`}
                          data-testid="analysis-result-verdict"
                        >
                          {result.verdict}
                        </span>
                      );
                    })()}
                    <p className="mt-3 text-sm text-muted-foreground">
                      {t('result_confidence')}:{' '}
                      <span className="text-foreground font-medium">
                        {((result.confidence || 0) * 100).toFixed(0)}%
                      </span>
                    </p>
                    <p
                      className="mt-3 text-sm leading-relaxed"
                      data-testid="analysis-result-summary"
                    >
                      {result.summary}
                    </p>
                  </div>
                </div>
              </div>

              {/* Multi-Model Consensus */}
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

              {/* Signals */}
              <div className="bento-card p-6">
                <h3 className="text-base font-semibold mb-4">{t('result_signals')}</h3>
                <SignalBreakdown signals={result.top_signals || []} />
              </div>

              {/* Recommendations */}
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

              {/* Actions */}
              <div className="flex flex-wrap gap-3" data-testid="result-share-bar">
                <button
                  onClick={handleNewScan}
                  data-testid="new-scan-button"
                  className="pill pill-primary"
                >
                  <RotateCcw className="w-4 h-4" />
                  {t('result_new_scan')}
                </button>
                <button
                  onClick={handleCopyLink}
                  data-testid="copy-link-button"
                  className="pill pill-ghost"
                >
                  <Copy className="w-4 h-4" />
                  {t('result_copy_link')}
                </button>
                {result.public_id && (
                  <a
                    href={`/r/${result.public_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pill pill-ghost"
                  >
                    <Share2 className="w-4 h-4" />
                    {t('result_share')}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
