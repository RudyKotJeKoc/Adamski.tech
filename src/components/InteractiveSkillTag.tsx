import React, { useState, useRef, useEffect } from 'react';

interface InteractiveSkillTagProps {
  label: string;
  projectCount?: number;
  proficiencyLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  className?: string;
  onClick?: () => void;
}

/**
 * Interactive Skill Tag with micro-interactions
 *
 * Features:
 * - Hover: Shows tooltip with project count
 * - Click: Triggers filter action
 * - Pulse animation on hover
 * - Color-coded proficiency levels
 * - Accessible with ARIA labels
 */
export const InteractiveSkillTag: React.FC<InteractiveSkillTagProps> = ({
  label,
  projectCount,
  proficiencyLevel,
  className = '',
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<'top' | 'bottom'>('top');
  const tagRef = useRef<HTMLButtonElement>(null);

  // Determine tooltip position based on viewport
  useEffect(() => {
    if (!tagRef.current) return;

    const updatePosition = () => {
      const rect = tagRef.current?.getBoundingClientRect();
      if (!rect) return;

      // If tag is in bottom half of viewport, show tooltip on top
      const isInBottomHalf = rect.top > window.innerHeight / 2;
      setTooltipPosition(isInBottomHalf ? 'top' : 'bottom');
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, []);

  // Proficiency level colors
  const proficiencyColors = {
    beginner: 'border-green-500/50 hover:border-green-400 hover:bg-green-500/10 text-green-200',
    intermediate: 'border-blue-500/50 hover:border-blue-400 hover:bg-blue-500/10 text-blue-200',
    advanced: 'border-purple-500/50 hover:border-purple-400 hover:bg-purple-500/10 text-purple-200',
    expert: 'border-accent-led/60 hover:border-accent-led hover:bg-accent-led/10 text-accent-led'
  };

  const colorClass = proficiencyLevel ? proficiencyColors[proficiencyLevel] : 'border-surface-border hover:border-primary-500 hover:bg-surface-card text-neutral-200';

  const handleInteraction = () => {
    if (onClick) {
      onClick();
    }
  };

  const tooltipText = projectCount !== undefined
    ? `${projectCount} projekt${projectCount === 1 ? '' : projectCount < 5 ? 'y' : 'ów'}`
    : proficiencyLevel
    ? proficiencyLevel === 'expert' ? 'Ekspert' : proficiencyLevel === 'advanced' ? 'Zaawansowany' : proficiencyLevel === 'intermediate' ? 'Średniozaawansowany' : 'Początkujący'
    : '';

  return (
    <div className="relative inline-block">
      <button
        ref={tagRef}
        type="button"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        onClick={handleInteraction}
        className={`
          group relative inline-flex items-center gap-2 px-3 py-1.5 rounded-chip border transition-all duration-300 ease-out
          ${colorClass}
          ${isHovered ? 'scale-105 shadow-lg' : 'scale-100'}
          ${onClick ? 'cursor-pointer' : 'cursor-default'}
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/60
          ${className}
        `}
        aria-label={`${label}${tooltipText ? ` - ${tooltipText}` : ''}`}
      >
        {/* Pulse effect on hover */}
        {isHovered && (
          <span
            className="absolute inset-0 rounded-chip border-2 border-primary-400 animate-ping opacity-75"
            aria-hidden="true"
          />
        )}

        {/* Label */}
        <span className="relative z-10 text-sm font-medium transition-transform duration-300">
          {label}
        </span>

        {/* Project count badge (if provided) */}
        {projectCount !== undefined && projectCount > 0 && (
          <span
            className={`
              relative z-10 inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full text-xs font-semibold
              transition-all duration-300
              ${isHovered
                ? 'bg-primary-500 text-white scale-110'
                : 'bg-primary-600/40 text-primary-200 scale-100'
              }
            `}
            aria-hidden="true"
          >
            {projectCount}
          </span>
        )}

        {/* Proficiency indicator dot */}
        {proficiencyLevel && (
          <span
            className={`
              relative z-10 inline-block w-2 h-2 rounded-full
              ${proficiencyLevel === 'expert' ? 'bg-accent-led' :
                proficiencyLevel === 'advanced' ? 'bg-purple-400' :
                proficiencyLevel === 'intermediate' ? 'bg-blue-400' :
                'bg-green-400'}
              ${isHovered ? 'animate-pulse' : ''}
            `}
            aria-hidden="true"
          />
        )}
      </button>

      {/* Tooltip */}
      {isHovered && tooltipText && (
        <div
          className={`
            absolute left-1/2 -translate-x-1/2 z-20 px-3 py-1.5 rounded-md
            bg-surface-card border border-primary-500/60 shadow-lg
            text-xs font-medium text-neutral-100 whitespace-nowrap
            animate-in fade-in slide-in-from-bottom-1 duration-200
            ${tooltipPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}
          `}
          role="tooltip"
        >
          {tooltipText}

          {/* Tooltip arrow */}
          <div
            className={`
              absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-surface-card border-primary-500/60 rotate-45
              ${tooltipPosition === 'top' ? 'bottom-[-4px] border-b border-r' : 'top-[-4px] border-t border-l'}
            `}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
};

// Additional CSS for animations (add to index.css or tailwind.config.js)
/*
@keyframes ping {
  75%, 100% {
    transform: scale(1.2);
    opacity: 0;
  }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-in-from-bottom-1 {
  from { transform: translateY(4px); }
  to { transform: translateY(0); }
}
*/
