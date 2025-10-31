import React, { useId, useMemo } from 'react';

export type RadarChartAxis = { id: string; label: string; value: number; description?: string };

export type RadarChartProps = {
  title: string;
  axes: RadarChartAxis[];
  maxValue: number;
  valueLabel?: string;
};

const clamp = (value: number, max: number) => Math.max(0, Math.min(value, max));

type AxisPoint = {
  id: string;
  label: string;
  description?: string;
  line: { x: number; y: number };
  text: { x: number; y: number; anchor: 'start' | 'middle' | 'end' };
};

export const RadarChart: React.FC<RadarChartProps> = ({ title, axes, maxValue, valueLabel = 'Score' }) => {
  const chartId = useId();
  const sanitizedMax = maxValue > 0 ? maxValue : 1;
  const usableAxes = axes.filter((axis) => typeof axis.value === 'number');
  const hasPolygon = usableAxes.length >= 3;

  const size = 320;
  const center = size / 2;
  const radius = center - 36;
  const levels = 4;

  const { polygons, dataPoints, axisPoints, descText } = useMemo(() => {
    if (!hasPolygon) {
      return { polygons: [] as string[], dataPoints: '', axisPoints: [] as AxisPoint[], descText: '' };
    }
    const angleSlice = (Math.PI * 2) / usableAxes.length;

    const createPoint = (ratio: number, index: number) => {
      const angle = angleSlice * index - Math.PI / 2;
      const r = radius * ratio;
      const x = center + Math.cos(angle) * r;
      const y = center + Math.sin(angle) * r;
      return { x, y, angle };
    };

    const polygons = Array.from({ length: levels }, (_, level) => {
      const ratio = ((level + 1) / levels) * 0.98;
      return usableAxes
        .map((_, idx) => {
          const point = createPoint(ratio, idx);
          return `${point.x},${point.y}`;
        })
        .join(' ');
    });

    const axisPoints: AxisPoint[] = usableAxes.map((axis, idx) => {
      const linePoint = createPoint(1, idx);
      const labelPoint = createPoint(1.12, idx);
      let textAnchor: 'start' | 'middle' | 'end' = 'middle';
      if (linePoint.angle > -Math.PI / 2 && linePoint.angle < Math.PI / 2) textAnchor = 'start';
      if (linePoint.angle > Math.PI / 2 || linePoint.angle < -Math.PI / 2) textAnchor = 'end';
      return {
        id: axis.id,
        label: axis.label,
        description: axis.description,
        line: { x: linePoint.x, y: linePoint.y },
        text: { x: labelPoint.x, y: labelPoint.y, anchor: textAnchor }
      };
    });

    const dataPoints = usableAxes
      .map((axis, idx) => {
        const ratio = clamp(axis.value, sanitizedMax) / sanitizedMax;
        const point = createPoint(ratio * 0.98, idx);
        return `${point.x},${point.y}`;
      })
      .join(' ');

    const descText = usableAxes
      .map((axis) => `${axis.label}: ${axis.value}/${sanitizedMax}${axis.description ? ` (${axis.description})` : ''}`)
      .join(', ');

    return { polygons, dataPoints, axisPoints, descText };
  }, [usableAxes, sanitizedMax, radius, hasPolygon]);

  if (!hasPolygon) {
    return (
      <figure aria-labelledby={`${chartId}-title`} className="radar-chart">
        <figcaption id={`${chartId}-title`} className="font-heading text-base font-semibold text-neutral-50">
          {title}
        </figcaption>
        <ul className="mt-3 space-y-2 text-sm text-neutral-200" role="list">
          {usableAxes.map((axis) => (
            <li key={axis.id} className="flex items-start justify-between gap-4">
              <span>{axis.label}</span>
              <span>{axis.value}</span>
            </li>
          ))}
        </ul>
      </figure>
    );
  }

  return (
    <figure aria-labelledby={`${chartId}-title`} className="radar-chart">
      <figcaption id={`${chartId}-title`} className="font-heading text-base font-semibold text-neutral-50">
        {title}
      </figcaption>
      <svg
        role="img"
        aria-labelledby={`${chartId}-title ${chartId}-desc`}
        viewBox={`0 0 ${size} ${size}`}
        className="mt-4 h-auto w-full"
      >
        <title id={`${chartId}-title`}>{title}</title>
        <desc id={`${chartId}-desc`}>{descText}</desc>
        <g stroke="rgba(148, 163, 184, 0.25)" strokeWidth="1">
          {polygons.map((points, idx) => (
            <polygon key={`grid-${idx}`} points={points} fill="none" />
          ))}
        </g>
        <g stroke="rgba(148, 163, 184, 0.35)" strokeWidth="1">
          {axisPoints.map((axis) => (
            <line key={`axis-${axis.id}`} x1={center} y1={center} x2={axis.line.x} y2={axis.line.y} />
          ))}
        </g>
        <polygon points={dataPoints} fill="rgba(56, 189, 248, 0.32)" stroke="#38bdf8" strokeWidth="1.5" />
        {axisPoints.map((axis) => (
          <text
            key={`label-${axis.id}`}
            x={axis.text.x}
            y={axis.text.y}
            textAnchor={axis.text.anchor}
            fill="rgba(226, 232, 240, 0.92)"
            className="text-[0.7rem]"
          >
            {axis.label}
          </text>
        ))}
      </svg>
      <noscript>
        <table className="mt-4 w-full text-left text-sm text-neutral-200" aria-label={title}>
          <thead>
            <tr>
              <th scope="col" className="border-b border-surface-border px-2 py-1 font-medium">
                {title}
              </th>
              <th scope="col" className="border-b border-surface-border px-2 py-1 font-medium text-right">
                {valueLabel}
              </th>
            </tr>
          </thead>
          <tbody>
            {usableAxes.map((axis) => (
              <tr key={`row-${axis.id}`}>
                <th scope="row" className="border-b border-surface-border px-2 py-1 font-normal">
                  {axis.label}
                </th>
                <td className="border-b border-surface-border px-2 py-1 text-right">
                  {axis.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </noscript>
    </figure>
  );
};

export default RadarChart;
