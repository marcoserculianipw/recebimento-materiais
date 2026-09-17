import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { OverallStatus, ChecklistStatus } from '../types';

interface StatusBadgeProps {
  status: OverallStatus | ChecklistStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const isConforme = status === 'CONFORME';

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
    lg: 'text-base px-5 py-2.5 gap-2.5 font-bold',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  if (isConforme) {
    return (
      <span
        className={`inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-sm ${sizeClasses[size]}`}
      >
        <CheckCircle2 className={`${iconSizes[size]} text-emerald-600 flex-shrink-0`} />
        <span>CONFORME</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full bg-rose-50 text-rose-700 border border-rose-300 shadow-sm ${sizeClasses[size]}`}
    >
      <AlertCircle className={`${iconSizes[size]} text-rose-600 flex-shrink-0`} />
      <span>NÃO CONFORME</span>
    </span>
  );
};
