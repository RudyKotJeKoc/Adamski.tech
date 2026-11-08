import React, { useEffect, useRef, useState } from 'react';

const LINE = '#8e9a67';
const LINE_SOFT = 'rgba(142,154,103,0.35)';
const AMBER = '#d9a441';
const SAND = '#c3b99b';
const FILL = 'rgba(29,34,30,0.72)';

const Frame: React.FC<{ active?: boolean }> = ({ active }) => (
  <>
    <rect x="0.5" y="0.5" width="199" height="199" fill={FILL} stroke={active ? AMBER : LINE} strokeWidth="1" />
    <path d="M0 12V0h12M188 0h12v12M200 188v12h-12M12 200H0v-12" fill="none" stroke={active ? AMBER : SAND} strokeWidth="1.6" />
  </>
);

/** Płyta bazowa: siatka konstrukcyjna z podziałką. */
const LayerBase: React.FC = () => (
  <svg viewBox="0 0 200 200" aria-hidden="true">
    <rect x="0.5" y="0.5" width="199" height="199" fill="rgba(16,19,17,0.85)" stroke={LINE_SOFT} />
    {Array.from({ length: 9 }, (_, i) => (i + 1) * 20).map((p) => (
      <g key={p} stroke="rgba(142,154,103,0.16)" strokeWidth="0.6">
        <line x1={p} y1="0" x2={p} y2="200" />
        <line x1="0" y1={p} x2="200" y2={p} />
      </g>
    ))}
    {Array.from({ length: 41 }, (_, i) => i * 5).map((p) => (
      <line key={`t${p}`} x1={p} y1="200" x2={p} y2={p % 20 === 0 ? 192 : 196} stroke={LINE_SOFT} strokeWidth="0.6" />
    ))}
    <circle cx="100" cy="100" r="7" fill="none" stroke={AMBER} strokeWidth="0.8" />
    <path d="M100 86v28M86 100h28" stroke={AMBER} strokeWidth="0.6" />
  </svg>
);

/** Warstwa automatyki: sterownik, ścieżki sygnałowe i złącza I/O. */
const LayerAutomation: React.FC<{ active: boolean }> = ({ active }) => {
  const pins = [78, 90, 102, 114];
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true">
      <Frame active={active} />
      <rect x="72" y="72" width="56" height="56" fill="rgba(37,44,36,0.95)" stroke={SAND} strokeWidth="1.1" />
      <rect x="80" y="80" width="40" height="40" fill="none" stroke={LINE_SOFT} strokeWidth="0.6" />
      {pins.map((p) => (
        <g key={p} stroke={SAND} strokeWidth="1">
          <line x1="66" y1={p + 4} x2="72" y2={p + 4} />
          <line x1="128" y1={p + 4} x2="134" y2={p + 4} />
          <line x1={p + 4} y1="66" x2={p + 4} y2="72" />
          <line x1={p + 4} y1="128" x2={p + 4} y2="134" />
        </g>
      ))}
      <g fill="none" stroke={LINE} strokeWidth="1.1">
        <path d="M66 82H40V30H18" />
        <path d="M66 106H30v40H14" />
        <path d="M134 82h30V24h18" />
        <path d="M134 118h22v48h26" />
        <path d="M82 66V36h-30V14" />
        <path d="M118 134v34h30v18" />
      </g>
      <g fill="none" stroke={AMBER} strokeWidth="1.3">
        <path className="trace-flow" d="M66 82H40V30H18" />
        <path className="trace-flow trace-flow--slow" d="M134 118h22v48h26" />
      </g>
      {[
        [18, 30],
        [14, 146],
        [182, 24],
        [182, 166],
        [52, 14],
        [148, 186]
      ].map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x - 4} y={y - 4} width="8" height="8" fill="#171b18" stroke={SAND} strokeWidth="1" />
      ))}
      <text x="100" y="104" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="8" fill={SAND} letterSpacing="1.5">
        PLC
      </text>
    </svg>
  );
};

/** Warstwa MIM: komora pieca, strefy grzewcze i profil termiczny. */
const LayerMim: React.FC<{ active: boolean }> = ({ active }) => (
  <svg viewBox="0 0 200 200" aria-hidden="true">
    <Frame active={active} />
    <g className="spin-slow">
      {Array.from({ length: 36 }, (_, i) => i * 10).map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const r1 = deg % 30 === 0 ? 70 : 74;
        return (
          <line
            key={deg}
            x1={100 + Math.cos(rad) * r1}
            y1={100 + Math.sin(rad) * r1}
            x2={100 + Math.cos(rad) * 80}
            y2={100 + Math.sin(rad) * 80}
            stroke={deg % 30 === 0 ? SAND : LINE_SOFT}
            strokeWidth="1"
          />
        );
      })}
    </g>
    <circle cx="100" cy="100" r="62" fill="none" stroke={LINE} strokeWidth="1.1" />
    <circle cx="100" cy="100" r="46" fill="none" stroke={LINE} strokeWidth="0.8" strokeDasharray="4 4" />
    <circle cx="100" cy="100" r="28" fill="rgba(217,164,65,0.08)" stroke={AMBER} strokeWidth="1.1" />
    <circle cx="100" cy="100" r="9" fill={AMBER} opacity="0.85" />
    <path d="M24 176h30l22-34h30l18-28h52" fill="none" stroke={AMBER} strokeWidth="1.4" />
    <path d="M24 186h152" stroke={LINE_SOFT} strokeWidth="0.8" />
  </svg>
);

/** Warstwa robotyki: ramię manipulatora, przeguby i zasięg pracy. */
const LayerRobotics: React.FC<{ active: boolean }> = ({ active }) => (
  <svg viewBox="0 0 200 200" aria-hidden="true">
    <Frame active={active} />
    <path d="M22 160A78 78 0 0 1 178 160" fill="none" stroke={LINE_SOFT} strokeWidth="1" strokeDasharray="3 5" />
    <path d="M44 160A56 56 0 0 1 156 160" fill="none" stroke={LINE_SOFT} strokeWidth="0.8" strokeDasharray="2 6" />
    <rect x="80" y="160" width="40" height="14" fill="rgba(37,44,36,0.95)" stroke={SAND} strokeWidth="1" />
    <g stroke={LINE} strokeWidth="7" strokeLinecap="square" opacity="0.55">
      <line x1="100" y1="160" x2="72" y2="104" />
      <line x1="72" y1="104" x2="128" y2="62" />
    </g>
    <g stroke={SAND} strokeWidth="1.2">
      <line x1="100" y1="160" x2="72" y2="104" />
      <line x1="72" y1="104" x2="128" y2="62" />
      <path d="M128 62l12-4M128 62l8 10M140 58l6 6M136 72l7 2" fill="none" />
    </g>
    {[
      [100, 160],
      [72, 104],
      [128, 62]
    ].map(([x, y]) => (
      <g key={`${x}-${y}`}>
        <circle cx={x} cy={y} r="7" fill="#171b18" stroke={AMBER} strokeWidth="1.3" />
        <circle cx={x} cy={y} r="2.2" fill={AMBER} />
      </g>
    ))}
    <path className="trace-flow trace-flow--slow" d="M128 62L150 30" stroke={AMBER} strokeWidth="1" fill="none" />
    <circle cx="150" cy="30" r="4" fill="none" stroke={AMBER} />
  </svg>
);

const LAYERS = [LayerAutomation, LayerMim, LayerRobotics];

type HeroSchematicProps = { layers: string[]; title: string; subtitle?: string };

export const HeroSchematic: React.FC<HeroSchematicProps> = ({ layers, title, subtitle }) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const readoutRef = useRef<HTMLSpanElement | null>(null);
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const count = Math.max(layers.length, 1);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || hovering) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % count), 3200);
    return () => window.clearInterval(id);
  }, [count, hovering]);

  useEffect(() => {
    const root = rootRef.current;
    const section = root?.closest('section');
    if (!root || !section) return;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;

    let frame = 0;
    let nx = 0;
    let ny = 0;

    const apply = () => {
      frame = 0;
      root.style.setProperty('--rx', `${(-ny * 7).toFixed(2)}deg`);
      root.style.setProperty('--ry', `${(nx * 9).toFixed(2)}deg`);
      if (readoutRef.current) {
        const fmt = (v: number) => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(2)}`;
        readoutRef.current.textContent = `X ${fmt(nx)}  Y ${fmt(-ny)}`;
      }
    };

    const onMove = (event: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      nx = 0;
      ny = 0;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    section.addEventListener('pointermove', onMove, { passive: true });
    section.addEventListener('pointerleave', onLeave);
    return () => {
      section.removeEventListener('pointermove', onMove);
      section.removeEventListener('pointerleave', onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={rootRef} className="schematic" aria-hidden="true">
      <div className="schematic__stage">
        <div className="schematic__shadow" />
        <div className="schematic__layer schematic__layer--base" style={{ '--i': 0 } as React.CSSProperties}>
          <LayerBase />
        </div>
        {layers.map((label, i) => {
          const Layer = LAYERS[i % LAYERS.length];
          return (
            <div
              key={`${label}-${i}`}
              className={`schematic__layer ${active === i ? 'is-active' : ''}`}
              style={{ '--i': i + 1 } as React.CSSProperties}
            >
              <Layer active={active === i} />
            </div>
          );
        })}
      </div>

      <div className="schematic__hud">
        <p className="schematic__title">
          {title}
          {subtitle && <span className="mt-1 block text-neutral-500">{subtitle}</span>}
        </p>
        <p className="schematic__readout">
          <span ref={readoutRef}>X +0.00  Y +0.00</span>
          <br />
          {`LAYERS ${String(count).padStart(2, '0')}`}
        </p>
        <ul className="schematic__legend" onPointerLeave={() => setHovering(false)}>
          {layers
            .map((label, i) => ({ label, i }))
            .reverse()
            .map(({ label, i }) => (
              <li
                key={`${label}-${i}`}
                className={`schematic__legend-item ${active === i ? 'is-active' : ''}`}
                onPointerEnter={() => {
                  setHovering(true);
                  setActive(i);
                }}
              >
                <span className={`led ${active === i ? '' : 'led--off'}`} />
                <span className="text-neutral-500">{`L${i + 1}`}</span>
                <span>{label}</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

/** Wariant na telefony: zamiast modelu 3D — kompaktowa lista modułów z mini-schematami. */
export const HeroModules: React.FC<{ layers: string[] }> = ({ layers }) => (
  <ul className="hero-modules" aria-hidden="true">
    {layers.map((label, i) => {
      const Layer = LAYERS[i % LAYERS.length];
      return (
        <li key={`${label}-${i}`} className="panel panel--sm panel--ghost hero-module">
          <Layer active={i === 0} />
          <span className="min-w-0">
            <span className="block hud-label text-neutral-500">{`Module L${i + 1}`}</span>
            <span className="block font-heading text-sm font-semibold uppercase tracking-[0.08em] text-neutral-50 truncate">
              {label}
            </span>
          </span>
          <span className={`led ${i === 0 ? 'led--blink' : 'led--olive'}`} />
        </li>
      );
    })}
  </ul>
);
