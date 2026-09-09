import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'destructive' | 'high' | 'medium' | 'low';
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = 'default', children, ...props }) => {
  const base = "inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider transition-colors";
  
  const variants = {
    default: "bg-slate-800 text-slate-200 border border-slate-700",
    secondary: "bg-slate-800/60 text-slate-400 border border-slate-700/60",
    outline: "border border-slate-700 text-slate-300",
    success: "bg-emerald-950/60 text-emerald-300 border border-emerald-800/60",
    warning: "bg-amber-950/60 text-amber-300 border border-amber-800/60",
    destructive: "bg-rose-950/60 text-rose-300 border border-rose-800/60",
    high: "bg-rose-950/80 text-rose-300 border border-rose-800/80 font-bold",
    medium: "bg-amber-950/80 text-amber-300 border border-amber-800/80",
    low: "bg-slate-800 text-slate-300 border border-slate-700"
  };

  return (
    <span className={cn(base, variants[variant], className)} {...props}>
      {children}
    </span>
  );
};
