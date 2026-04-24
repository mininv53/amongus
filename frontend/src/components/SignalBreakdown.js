import React, { useState } from 'react';
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const SignalBreakdown = ({ signals = [] }) => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (idx) => {
    setExpanded(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const getImpactIcon = (impact) => {
    switch (impact) {
      case 'positive': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'negative': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <Minus className="w-4 h-4 text-amber-400" />;
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'positive': return 'border-green-500/20 bg-green-500/5';
      case 'negative': return 'border-red-500/20 bg-red-500/5';
      default: return 'border-amber-500/20 bg-amber-500/5';
    }
  };

  return (
    <div className="space-y-2" data-testid="signal-breakdown">
      {signals.map((signal, idx) => (
        <div
          key={idx}
          className={`border rounded-lg overflow-hidden transition-colors ${getImpactColor(signal.impact)}`}
        >
          <button
            onClick={() => toggleExpand(idx)}
            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              {getImpactIcon(signal.impact)}
              <span className="text-sm font-medium">{signal.signal}</span>
            </div>
            {expanded[idx] ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
          {expanded[idx] && (
            <div className="px-4 pb-3 pl-11">
              <p className="text-sm text-muted-foreground">{signal.detail}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SignalBreakdown;
