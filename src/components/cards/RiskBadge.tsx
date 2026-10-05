import React from 'react';
import type { RiskLevel } from '../../types';
import { getRiskBgClass } from '../../services/riskCalculator';

interface RiskBadgeProps {
  level: RiskLevel;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
}

const RiskBadge: React.FC<RiskBadgeProps> = ({ level, score, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 font-bold',
    md: 'text-xs px-2.5 py-1 font-extrabold',
    lg: 'text-sm px-4 py-1.5 font-black tracking-wide',
  };

  const dotColor: Record<RiskLevel, string> = {
    LOW: 'bg-emerald-400',
    MODERATE: 'bg-amber-400',
    HIGH: 'bg-orange-400',
    CRITICAL: 'bg-rose-500 animate-ping',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border tracking-wide uppercase shadow-sm ${sizeClasses[size]} ${getRiskBgClass(level)}`}
    >
      <span className="relative flex h-2 w-2">
        {level === 'CRITICAL' && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColor[level]}`}></span>
      </span>
      {score !== undefined && <span className="font-mono">{score}</span>}
      <span>{level}</span>
    </span>
  );
};

export default RiskBadge;
