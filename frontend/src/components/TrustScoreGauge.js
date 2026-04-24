import React, { useEffect, useRef } from 'react';

export const TrustScoreGauge = ({ score = 0, size = 180, strokeWidth = 10 }) => {
  const circleRef = useRef(null);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  const getColor = (s) => {
    if (s >= 80) return 'hsl(150, 70%, 45%)';
    if (s >= 60) return 'hsl(168, 78%, 45%)';
    if (s >= 40) return 'hsl(38, 92%, 55%)';
    if (s >= 20) return 'hsl(25, 90%, 55%)';
    return 'hsl(0, 78%, 55%)';
  };

  const getLabel = (s) => {
    if (s >= 80) return 'High Trust';
    if (s >= 60) return 'Moderate Trust';
    if (s >= 40) return 'Low Trust';
    if (s >= 20) return 'Suspicious';
    return 'Critical';
  };

  useEffect(() => {
    if (circleRef.current) {
      circleRef.current.style.strokeDashoffset = circumference;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (circleRef.current) {
            circleRef.current.style.transition = 'stroke-dashoffset 1.5s ease-out';
            circleRef.current.style.strokeDashoffset = circumference - progress;
          }
        });
      });
    }
  }, [score, circumference, progress]);

  const color = getColor(score);

  return (
    <div className="flex flex-col items-center gap-3" data-testid="trust-score-gauge">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(165, 18%, 12%)"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            ref={circleRef}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold font-['Space_Grotesk']" style={{ color }}>
            {score}
          </span>
          <span className="text-xs text-muted-foreground mt-0.5">/100</span>
        </div>
      </div>
      <span className="text-sm font-medium" style={{ color }}>{getLabel(score)}</span>
    </div>
  );
};

export default TrustScoreGauge;
