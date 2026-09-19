// Micro-sparkline vectoriel SVG pour les cartes KPI du module Growth Hacking (style Influence & Dashboard)
import React from 'react';

export default function MiniSparkline({ data = [20, 35, 28, 45, 60, 52, 75], color = '#FF7900', height = 28, width = 72 }) {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 2;
  const h = height - padding * 2;
  const w = width - padding * 2;

  const points = data.map((val, idx) => {
    const x = padding + (idx / (data.length - 1)) * w;
    const y = padding + h - ((val - min) / range) * h;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  const firstPoint = points.split(' ')[0];
  const lastPoint = points.split(' ')[points.split(' ').length - 1];
  const fillArea = `${firstPoint} ${points} ${lastPoint.split(',')[0]},${height} ${firstPoint.split(',')[0]},${height}`;

  const cleanId = `growth-grad-${color.replace('#', '')}`;

  return (
    <div className="inline-flex items-center shrink-0" style={{ width, height }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        <defs>
          <linearGradient id={cleanId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <polygon points={fillArea} fill={`url(#${cleanId})`} />
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
        <circle
          cx={lastPoint.split(',')[0]}
          cy={lastPoint.split(',')[1]}
          r="2.5"
          fill={color}
        />
      </svg>
    </div>
  );
}
