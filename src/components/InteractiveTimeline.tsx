import React, { useState, useId } from 'react';

type TimelineMilestone = {
  id: string;
  period: string;
  role: string;
  context?: string;
  summary: string;
  highlights?: string[];
};

interface InteractiveTimelineProps {
  milestones: TimelineMilestone[];
  label: string;
}

interface ParsedDate {
  year: number;
  month: number;
  isCurrent: boolean;
}

const monthsMap: Record<string, number> = {
  'Jan': 1, 'Feb': 2, 'Mrt': 3, 'Mar': 3, 'Apr': 4, 'Mei': 5, 'May': 5,
  'Jun': 6, 'Jul': 7, 'Aug': 8, 'Sep': 9, 'Okt': 10, 'Oct': 10, 'Nov': 11, 'Dec': 12
};

const parseDate = (dateStr: string): ParsedDate => {
  if (dateStr.toLowerCase().includes('heden') || dateStr.toLowerCase().includes('present')) {
    return { year: new Date().getFullYear(), month: new Date().getMonth() + 1, isCurrent: true };
  }

  const parts = dateStr.trim().split(' ');
  const month = monthsMap[parts[0]] || 1;
  const year = parseInt(parts[1]) || new Date().getFullYear();

  return { year, month, isCurrent: false };
};

const parsePeriod = (period: string) => {
  const [startStr, endStr] = period.split('–').map(s => s.trim());
  const start = parseDate(startStr);
  const end = parseDate(endStr);

  return { start, end };
};

const calculateDuration = (start: ParsedDate, end: ParsedDate): number => {
  return (end.year - start.year) * 12 + (end.month - start.month);
};

export const InteractiveTimeline: React.FC<InteractiveTimelineProps> = ({ milestones, label }) => {
  const [activeId, setActiveId] = useState<string>(milestones[0]?.id ?? '');
  const timelineId = useId();

  if (!milestones.length) return null;

  // Parse all dates and find min/max years for the timeline
  const parsedMilestones = milestones.map(m => ({
    ...m,
    ...parsePeriod(m.period)
  }));

  const minYear = Math.min(...parsedMilestones.map(m => m.start.year));
  const maxYear = Math.max(...parsedMilestones.map(m => m.end.year));
  const totalMonths = (maxYear - minYear + 1) * 12;

  const getPosition = (date: ParsedDate) => {
    const monthsFromStart = (date.year - minYear) * 12 + date.month;
    return (monthsFromStart / totalMonths) * 100;
  };

  const activeMilestone = parsedMilestones.find(m => m.id === activeId) || parsedMilestones[0];

  // Sort milestones chronologically for display
  const sortedMilestones = [...parsedMilestones].sort((a, b) => {
    const aStart = a.start.year * 12 + a.start.month;
    const bStart = b.start.year * 12 + b.start.month;
    return aStart - bStart;
  });

  return (
    <div className="space-y-6">
      {/* Timeline visualization */}
      <div className="relative">
        <div
          role="tablist"
          aria-label={label}
          className="relative h-24 bg-surface-card/40 rounded-card border border-surface-border p-4"
        >
          {/* Year markers */}
          <div className="absolute bottom-2 left-4 right-4 flex justify-between text-xs text-neutral-400">
            {Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i).map(year => (
              <span key={year}>{year}</span>
            ))}
          </div>

          {/* Timeline bars */}
          <div className="relative h-12">
            {sortedMilestones.map((milestone, idx) => {
              const startPos = getPosition(milestone.start);
              const endPos = getPosition(milestone.end);
              const width = endPos - startPos;
              const isActive = milestone.id === activeId;
              const duration = calculateDuration(milestone.start, milestone.end);
              const durationText = duration < 12
                ? `${duration} m${duration !== 1 ? 'nd' : ''}`
                : `${Math.floor(duration / 12)} jr${duration % 12 ? ` ${duration % 12}m` : ''}`;

              return (
                <button
                  key={milestone.id}
                  id={`${timelineId}-tab-${milestone.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`${timelineId}-panel-${milestone.id}`}
                  onClick={() => setActiveId(milestone.id)}
                  className={`absolute h-8 rounded transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-led group cursor-pointer ${
                    isActive
                      ? 'bg-primary-500 z-10 scale-105'
                      : 'bg-primary-600/60 hover:bg-primary-600/80'
                  }`}
                  style={{
                    left: `${startPos}%`,
                    width: `${width}%`,
                    top: `${idx * 10}px`
                  }}
                  title={milestone.role}
                >
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-white px-1 truncate">
                    {milestone.role.split(' ')[0]}
                    {milestone.end.isCurrent && (
                      <span className="ml-1 animate-pulse" aria-label="huidig">●</span>
                    )}
                  </span>
                  <span className="absolute -top-4 left-0 text-[9px] text-neutral-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    {durationText}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Milestone details */}
      <article
        role="tabpanel"
        id={`${timelineId}-panel-${activeMilestone.id}`}
        aria-labelledby={`${timelineId}-tab-${activeMilestone.id}`}
        className="rounded-card border border-surface-border bg-surface-card/80 p-4 sm:p-6 shadow-card"
      >
        <header className="flex flex-col gap-1">
          <p className="text-xs sm:text-sm uppercase tracking-wide text-primary-300">
            {activeMilestone.period}
            {activeMilestone.end.isCurrent && (
              <span className="ml-2 text-accent-led">● Huidig</span>
            )}
          </p>
          <h3 className="text-lg sm:text-xl font-heading font-semibold text-neutral-50">
            {activeMilestone.role}
          </h3>
          {activeMilestone.context && (
            <p className="text-sm text-neutral-300">{activeMilestone.context}</p>
          )}
        </header>
        <p className="mt-4 text-sm sm:text-base text-neutral-200">{activeMilestone.summary}</p>
        {activeMilestone.highlights && activeMilestone.highlights.length > 0 && (
          <ul className="mt-4 space-y-2 text-sm text-neutral-200" role="list">
            {activeMilestone.highlights.map((highlight, i) => (
              <li key={i} className="flex items-start gap-2">
                <span aria-hidden="true" className="mt-1 h-1.5 w-1.5 rounded-full bg-primary-500 shrink-0" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        )}
      </article>
    </div>
  );
};

export default InteractiveTimeline;
