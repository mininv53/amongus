import React from 'react';
import { Shield, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const MODEL_ICONS = {
  'openai': { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  'anthropic': { color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
  'gemini': { color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
};

export const ModelConsensus = ({ modelResults = [], consensusStrength = '', modelsUsed = 0, modelsTotal = 0 }) => {
  if (!modelResults || modelResults.length === 0) return null;

  const getStrengthLabel = (strength) => {
    switch (strength) {
      case 'unanimous': return { label: 'Unanimous', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' };
      case 'majority': return { label: 'Majority', color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20' };
      case 'split': return { label: 'Split', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' };
      default: return { label: 'N/A', color: 'text-muted-foreground', bg: 'bg-muted/20' };
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-teal-400';
    if (score >= 40) return 'text-amber-400';
    return 'text-red-400';
  };

  const strength = getStrengthLabel(consensusStrength);

  return (
    <div className="space-y-3" data-testid="model-consensus">
      {/* Consensus header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold">Multi-Model Consensus</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium ${strength.bg} ${strength.color}`}>
            {strength.label}
          </span>
          <span className="text-xs text-muted-foreground">
            {modelsUsed}/{modelsTotal} models
          </span>
        </div>
      </div>

      {/* Per-model results */}
      <div className="grid gap-2">
        {modelResults.map((mr, i) => {
          const style = MODEL_ICONS[mr.provider] || MODEL_ICONS['openai'];
          return (
            <div
              key={i}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg border ${mr.success ? 'border-border bg-card/50' : 'border-red-500/20 bg-red-500/5'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-md border flex items-center justify-center ${style.bg}`}>
                  <span className={`text-[10px] font-bold ${style.color}`}>
                    {mr.provider === 'openai' ? 'GPT' : mr.provider === 'anthropic' ? 'CL' : 'GEM'}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium">{mr.label}</span>
                  {mr.success && (
                    <span className="text-xs text-muted-foreground ml-2">
                      {mr.verdict?.replace(/_/g, ' ')}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {mr.success ? (
                  <>
                    <span className={`text-sm font-bold font-mono ${getScoreColor(mr.trust_score)}`}>
                      {mr.trust_score}
                    </span>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </>
                ) : (
                  <>
                    <span className="text-xs text-red-400">Failed</span>
                    <XCircle className="w-4 h-4 text-red-400" />
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Score range indicator */}
      {modelsUsed >= 2 && (() => {
        const scores = modelResults.filter(m => m.success).map(m => m.trust_score);
        const min = Math.min(...scores);
        const max = Math.max(...scores);
        const spread = max - min;
        return (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/20">
            <AlertCircle className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Score range: {min}–{max} (spread: {spread} pts)
              {spread <= 10 ? ' — High agreement' : spread <= 20 ? ' — Moderate agreement' : ' — Models disagree'}
            </span>
          </div>
        );
      })()}
    </div>
  );
};

export default ModelConsensus;
