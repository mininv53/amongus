import React, { useState, useCallback } from 'react';
import { useLanguage } from '../i18n';
import { toast } from 'sonner';
import { Image, Music, Link2, Loader2, ArrowRight, Share2, Copy, RotateCcw, Info } from 'lucide-react';
import TrustScoreGauge from '../components/TrustScoreGauge';
import SignalBreakdown from '../components/SignalBreakdown';
import DropzoneUpload from '../components/DropzoneUpload';
import ModelConsensus from '../components/ModelConsensus';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

export default function Analyzer() {
  const { t, lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('image');
  const [selectedFile, setSelectedFile] = useState(null);
  const [urlInput, setUrlInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  const analysisSteps = [
    { label: lang === 'ru' ? 'Загрузка файла...' : 'Uploading content...' },
    { label: lang === 'ru' ? 'GPT-5.1 анализ...' : 'GPT-5.1 analysis...' },
    { label: lang === 'ru' ? 'Claude Sonnet 4.5 анализ...' : 'Claude Sonnet 4.5 analysis...' },
    { label: lang === 'ru' ? 'Gemini 2.5 Pro анализ...' : 'Gemini 2.5 Pro analysis...' },
    { label: lang === 'ru' ? 'Консенсус моделей...' : 'Multi-model consensus...' },
  ];

  const handleAnalyze = useCallback(async () => {
    setIsAnalyzing(true);
    setResult(null);
    setCurrentStep(0);

    try {
      let response;

      // Step animation
      const stepInterval = setInterval(() => {
        setCurrentStep(prev => Math.min(prev + 1, 4));
      }, 4000);

      if (activeTab === 'image' || activeTab === 'audio') {
        if (!selectedFile) {
          toast.error(lang === 'ru' ? 'Выберите файл' : 'Please select a file');
          setIsAnalyzing(false);
          clearInterval(stepInterval);
          return;
        }
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('language', lang);

        response = await fetch(`${API_URL}/api/analyze/${activeTab}`, {
          method: 'POST',
          body: formData,
        });
      } else {
        if (!urlInput.trim()) {
          toast.error(lang === 'ru' ? 'Введите URL' : 'Please enter a URL');
          setIsAnalyzing(false);
          clearInterval(stepInterval);
          return;
        }
        response = await fetch(`${API_URL}/api/analyze/url`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: urlInput.trim(), language: lang }),
        });
      }

      clearInterval(stepInterval);
      setCurrentStep(4);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Analysis failed (${response.status})`);
      }

      const data = await response.json();
      setResult(data);
      toast.success(lang === 'ru' ? 'Анализ завершён!' : 'Analysis complete!');
    } catch (error) {
      toast.error(error.message || 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  }, [activeTab, selectedFile, urlInput, lang]);

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
      toast.success(t('copied'));
    }
  };

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

  const tabs = [
    { id: 'image', icon: Image, label: t('tab_image') },
    { id: 'audio', icon: Music, label: t('tab_audio') },
    { id: 'url', icon: Link2, label: t('tab_url') },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-16">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight" data-testid="analyzer-title">
          {t('analyzer_title')}
        </h1>
        <p className="mt-2 text-muted-foreground">{t('analyzer_subtitle')}</p>
      </div>

      {!result ? (
        <>
          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-xl bg-card border border-border mb-6" data-testid="analyzer-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSelectedFile(null); setUrlInput(''); }}
                data-testid={`tab-${tab.id}`}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Upload area */}
          <div className="mb-6">
            {activeTab === 'url' ? (
              <div className="space-y-3">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder={t('url_placeholder')}
                  data-testid="analyzer-url-input"
                  className="w-full px-4 py-3 text-sm rounded-xl bg-card border border-border focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 font-mono placeholder:font-sans"
                />
                <p className="text-xs text-muted-foreground">{t('url_hint')}</p>
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
            disabled={isAnalyzing || (activeTab !== 'url' && !selectedFile) || (activeTab === 'url' && !urlInput.trim())}
            data-testid="analyze-button"
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed btn-press transition-colors"
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
            <div className="mt-6 p-4 rounded-xl border border-border bg-card" data-testid="scan-timeline">
              <div className="space-y-3">
                {analysisSteps.map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono ${
                      currentStep > i
                        ? 'bg-primary/20 text-primary'
                        : currentStep === i
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {currentStep > i ? '\u2713' : i + 1}
                    </div>
                    <span className={`text-sm ${
                      currentStep >= i ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
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
          <div className="mt-8 p-4 rounded-xl border border-border bg-card/50">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold mb-2">{t('edu_title')}</h4>
                <div className="space-y-1">
                  <p className="text-xs text-green-400">{t('edu_80_100')}</p>
                  <p className="text-xs text-teal-400">{t('edu_60_80')}</p>
                  <p className="text-xs text-amber-400">{t('edu_40_60')}</p>
                  <p className="text-xs text-orange-400">{t('edu_20_40')}</p>
                  <p className="text-xs text-red-400">{t('edu_0_20')}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Results */
        <div className="space-y-6" data-testid="analysis-result">
          {/* Score + Verdict */}
          <div className="p-6 rounded-2xl border border-border bg-card">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <TrustScoreGauge score={result.trust_score || 0} />
              <div className="flex-1 text-center sm:text-left">
                <div className={`inline-flex items-center px-3 py-1.5 rounded-full border text-sm font-medium ${getVerdictBg(result.verdict)} ${getVerdictColor(result.verdict)}`} data-testid="analysis-result-verdict">
                  {t(`verdict_${result.verdict}`) || result.verdict}
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {t('result_confidence')}: <span className="text-foreground font-medium">{((result.confidence || 0) * 100).toFixed(0)}%</span>
                </p>
                <p className="mt-3 text-sm leading-relaxed" data-testid="analysis-result-summary">
                  {result.summary}
                </p>
              </div>
            </div>
          </div>

          {/* Multi-Model Consensus */}
          {result.model_results && result.model_results.length > 0 && (
            <div className="p-6 rounded-2xl border border-border bg-card">
              <ModelConsensus
                modelResults={result.model_results}
                consensusStrength={result.consensus_strength}
                modelsUsed={result.models_used}
                modelsTotal={result.models_total}
              />
            </div>
          )}

          {/* Signals */}
          <div className="p-6 rounded-2xl border border-border bg-card">
            <h3 className="text-base font-semibold mb-4">{t('result_signals')}</h3>
            <SignalBreakdown signals={result.top_signals || []} />
          </div>

          {/* Recommendations */}
          {result.recommendations && result.recommendations.length > 0 && (
            <div className="p-6 rounded-2xl border border-border bg-card">
              <h3 className="text-base font-semibold mb-3">{t('result_recommendations')}</h3>
              <ul className="space-y-2">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
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
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 btn-press transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              {t('result_new_scan')}
            </button>
            <button
              onClick={handleCopyLink}
              data-testid="copy-link-button"
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-border rounded-lg hover:border-primary/50 transition-colors"
            >
              <Copy className="w-4 h-4" />
              {t('result_copy_link')}
            </button>
            {result.public_id && (
              <a
                href={`/r/${result.public_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-border rounded-lg hover:border-primary/50 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                {t('result_share')}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
