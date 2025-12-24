'use client';

import { forwardRef, ReactNode } from 'react';

interface ShareableCardProps {
  title: string;
  children: ReactNode;
  userName?: string;
}

export const ShareableCard = forwardRef<HTMLDivElement, ShareableCardProps>(
  function ShareableCard({ title, children, userName }, ref) {
    return (
      <div
        ref={ref}
        className="bg-[var(--cream)] p-8 rounded-2xl"
        style={{ minWidth: '400px', maxWidth: '600px' }}
      >
        <div className="text-xs text-[var(--muted)] uppercase tracking-[0.2em] mb-2">
          Year in Review with Claude
        </div>
        {userName && (
          <div className="text-sm text-[var(--charcoal)] mb-4">{userName}</div>
        )}
        <h3 className="text-xl font-medium mb-6 text-[var(--charcoal)]">{title}</h3>
        {children}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-[var(--muted-bg)]">
          <div className="w-6 h-6 rounded-full bg-[var(--accent)] flex items-center justify-center">
            <span className="text-white text-xs font-medium">C</span>
          </div>
          <span className="text-xs text-[var(--muted)]">Made with Claude</span>
        </div>
      </div>
    );
  }
);
