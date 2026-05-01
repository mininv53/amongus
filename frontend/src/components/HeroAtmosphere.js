import React from 'react';

/**
 * Decorative atmospheric backdrop for the landing hero.
 * Pure SVG + CSS — no external image dependencies.
 *
 * Composition (back to front):
 *   1. Pitch black background (inherited from .atmosphere-bg on parent)
 *   2. Soft center spotlight (radial glow)
 *   3. Translucent horizon haze
 *   4. Floating flora silhouettes (dandelions, ferns, grass blades)
 *   5. Animated firefly particles
 */

const fireflies = [
  { left: '12%', top: '38%', delay: '0s' },
  { left: '22%', top: '62%', delay: '1.2s' },
  { left: '34%', top: '48%', delay: '0.6s' },
  { left: '44%', top: '70%', delay: '2.1s' },
  { left: '52%', top: '55%', delay: '1.8s' },
  { left: '58%', top: '36%', delay: '0.3s' },
  { left: '66%', top: '64%', delay: '2.5s' },
  { left: '74%', top: '46%', delay: '1.0s' },
  { left: '82%', top: '58%', delay: '0.9s' },
  { left: '90%', top: '40%', delay: '1.5s' },
  { left: '18%', top: '78%', delay: '2.8s' },
  { left: '78%', top: '80%', delay: '0.4s' },
];

const Dandelion = ({ size = 80 }) => (
  <svg width={size} height={size * 1.6} viewBox="0 0 80 128" fill="none">
    <line x1="40" y1="128" x2="40" y2="38" stroke="rgba(220,235,225,0.45)" strokeWidth="1" />
    <g stroke="rgba(230,245,235,0.55)" strokeWidth="0.8" strokeLinecap="round">
      {Array.from({ length: 18 }).map((_, i) => {
        const angle = (i * 360) / 18;
        const rad = (angle * Math.PI) / 180;
        const x2 = 40 + Math.cos(rad) * 22;
        const y2 = 32 + Math.sin(rad) * 22;
        return <line key={i} x1="40" y1="32" x2={x2} y2={y2} />;
      })}
    </g>
    <g fill="rgba(240,255,248,0.85)">
      {Array.from({ length: 18 }).map((_, i) => {
        const angle = (i * 360) / 18;
        const rad = (angle * Math.PI) / 180;
        const x = 40 + Math.cos(rad) * 22;
        const y = 32 + Math.sin(rad) * 22;
        return <circle key={i} cx={x} cy={y} r="1.4" />;
      })}
    </g>
    <circle cx="40" cy="32" r="2.5" fill="rgba(220,255,240,0.9)" />
  </svg>
);

const Fern = ({ size = 100 }) => (
  <svg width={size} height={size * 1.4} viewBox="0 0 100 140" fill="none">
    <path
      d="M50 140 C 50 110, 48 80, 50 50 C 52 30, 56 18, 60 6"
      stroke="rgba(140,200,170,0.55)"
      strokeWidth="1"
      fill="none"
    />
    {Array.from({ length: 10 }).map((_, i) => {
      const y = 130 - i * 12;
      const len = 6 + i * 2;
      return (
        <g key={i}>
          <path
            d={`M50 ${y} Q ${50 - len} ${y - 4}, ${50 - len * 1.6} ${y - 10}`}
            stroke="rgba(160,220,190,0.55)"
            strokeWidth="0.9"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={`M50 ${y} Q ${50 + len} ${y - 4}, ${50 + len * 1.6} ${y - 10}`}
            stroke="rgba(160,220,190,0.55)"
            strokeWidth="0.9"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      );
    })}
  </svg>
);

const Grass = ({ size = 60 }) => (
  <svg width={size} height={size * 1.6} viewBox="0 0 60 96" fill="none">
    {[0, 1, 2, 3, 4].map((i) => {
      const x = 10 + i * 10;
      const curve = i % 2 === 0 ? -8 : 8;
      return (
        <path
          key={i}
          d={`M${x} 96 Q ${x + curve} 60, ${x + curve / 2} 14`}
          stroke="rgba(170,220,200,0.5)"
          strokeWidth="1.1"
          fill="none"
          strokeLinecap="round"
        />
      );
    })}
  </svg>
);

const FloatingFlora = ({ children, style, rot = 0, delay = '0s' }) => (
  <div
    className="absolute pointer-events-none flora-sway"
    style={{
      ...style,
      // pass rotation as CSS var for the animation
      ['--rot']: `${rot}deg`,
      animationDelay: delay,
    }}
  >
    {children}
  </div>
);

export default function HeroAtmosphere() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
    >
      {/* Center radial spotlight */}
      <div
        className="absolute"
        style={{
          left: '50%',
          top: '58%',
          width: '900px',
          height: '600px',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="w-full h-full spotlight-glow rounded-full" />
      </div>

      {/* Subtle horizon haze */}
      <div
        className="absolute left-0 right-0 h-40"
        style={{
          bottom: '0',
          background: 'linear-gradient(to top, rgba(20,184,166,0.10), transparent)',
        }}
      />

      {/* Vignette top */}
      <div
        className="absolute inset-x-0 top-0 h-40"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.85), transparent)',
        }}
      />

      {/* Floating flora — left side */}
      <FloatingFlora style={{ left: '4%', bottom: '8%' }} rot={-6}>
        <Fern size={110} />
      </FloatingFlora>
      <FloatingFlora style={{ left: '12%', bottom: '4%' }} rot={4} delay="1.2s">
        <Dandelion size={70} />
      </FloatingFlora>
      <FloatingFlora style={{ left: '20%', bottom: '12%' }} rot={-3} delay="0.6s">
        <Grass size={70} />
      </FloatingFlora>
      <FloatingFlora style={{ left: '6%', bottom: '34%' }} rot={2} delay="2.4s">
        <Dandelion size={50} />
      </FloatingFlora>

      {/* Floating flora — right side */}
      <FloatingFlora style={{ right: '4%', bottom: '6%' }} rot={5} delay="1.8s">
        <Fern size={120} />
      </FloatingFlora>
      <FloatingFlora style={{ right: '14%', bottom: '4%' }} rot={-3} delay="0.8s">
        <Dandelion size={80} />
      </FloatingFlora>
      <FloatingFlora style={{ right: '24%', bottom: '10%' }} rot={3} delay="1.4s">
        <Grass size={80} />
      </FloatingFlora>
      <FloatingFlora style={{ right: '8%', bottom: '38%' }} rot={-4} delay="2.0s">
        <Dandelion size={45} />
      </FloatingFlora>

      {/* Front-row grass strip across the bottom */}
      <FloatingFlora style={{ left: '32%', bottom: '0' }} rot={0} delay="0.4s">
        <Grass size={90} />
      </FloatingFlora>
      <FloatingFlora style={{ left: '46%', bottom: '0' }} rot={0} delay="1.0s">
        <Grass size={70} />
      </FloatingFlora>
      <FloatingFlora style={{ left: '58%', bottom: '0' }} rot={0} delay="1.6s">
        <Grass size={80} />
      </FloatingFlora>

      {/* Fireflies */}
      {fireflies.map((f, i) => (
        <span
          key={i}
          className="firefly"
          style={{ left: f.left, top: f.top, animationDelay: f.delay }}
        />
      ))}
    </div>
  );
}
