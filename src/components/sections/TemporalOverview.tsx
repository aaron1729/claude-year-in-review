'use client';

import { useRef } from 'react';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { StatCard } from '@/components/ui/StatCard';
import { ShareableCard } from '@/components/ui/ShareableCard';
import { DownloadCardButton } from '@/components/ui/DownloadCardButton';
import { motion } from 'framer-motion';
import type { ProcessedData } from '@/lib/types';
import { formatDate } from '@/lib/data';

interface TemporalOverviewProps {
  data: ProcessedData;
}

export function TemporalOverview({ data }: TemporalOverviewProps) {
  const { overview, temporal } = data;
  const cardRef = useRef<HTMLDivElement>(null);

  // Get month data for visualization
  const monthEntries = Object.entries(temporal.byMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12); // Last 12 months
  const maxMonthValue = Math.max(...monthEntries.map(([, v]) => v));

  return (
    <AnimatedSection>
      <h2 className="mb-4">The Shape of Our Year</h2>
      <p className="text-lg text-[var(--muted)] mb-12">
        From {formatDate(overview.firstConversationDate)} to {formatDate(overview.lastConversationDate)},
        we&apos;ve shared {overview.totalDays.toLocaleString()} days together.
      </p>

      <ShareableCard ref={cardRef} title="The Shape of Our Year" userName={data.userName}>
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center">
            <div className="text-3xl font-medium text-[var(--accent)]">
              {overview.totalConversations.toLocaleString()}
            </div>
            <div className="text-xs text-[var(--muted)] uppercase tracking-wider mt-1">
              Conversations
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-medium text-[var(--accent)]">
              {overview.totalMessages.toLocaleString()}
            </div>
            <div className="text-xs text-[var(--muted)] uppercase tracking-wider mt-1">
              Messages
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-medium text-[var(--accent)]">
              {overview.activeDays}
            </div>
            <div className="text-xs text-[var(--muted)] uppercase tracking-wider mt-1">
              Active Days
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-medium text-[var(--accent)]">
              {overview.conversationsPerActiveDay}
            </div>
            <div className="text-xs text-[var(--muted)] uppercase tracking-wider mt-1">
              Per Active Day
            </div>
          </div>
        </div>
      </ShareableCard>

      <div className="mt-4 mb-12">
        <DownloadCardButton targetRef={cardRef} filename="claude-year-stats" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 mb-16">
        <StatCard value={overview.totalConversations} label="Conversations" />
        <StatCard value={overview.totalMessages} label="Messages" delay={0.1} />
        <StatCard value={overview.activeDays} label="Active Days" delay={0.2} />
        <StatCard value={overview.conversationsPerActiveDay} label="Per Active Day" delay={0.3} />
      </div>

      <div className="mb-8">
        <h3 className="text-lg mb-6">Activity by Month</h3>
        <div className="flex items-end gap-1 h-40">
          {monthEntries.map(([month, count], index) => {
            const height = (count / maxMonthValue) * 100;
            const [year, monthNum] = month.split('-');
            const date = new Date(parseInt(year), parseInt(monthNum) - 1);
            const label = date.toLocaleDateString('en-US', { month: 'short' });

            return (
              <motion.div
                key={month}
                className="flex-1 flex flex-col items-center group"
                initial={{ opacity: 0, scaleY: 0 }}
                whileInView={{ opacity: 1, scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.03 }}
                style={{ originY: 1 }}
              >
                <div className="relative w-full">
                  <div
                    className="w-full bg-[var(--accent)] rounded-t-sm transition-all duration-300 group-hover:bg-[var(--charcoal)]"
                    style={{ height: `${height}px`, minHeight: count > 0 ? '4px' : '0' }}
                  />
                  <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-[var(--charcoal)] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {count} conversations
                  </div>
                </div>
                <span className="text-xs text-[var(--muted)] mt-2 hidden md:block">{label}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      <motion.blockquote
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      >
        Your busiest month was {temporal.busiestMonth.month.replace('-', ' ')},
        with {temporal.busiestMonth.count} conversations.
        The most active single day? {formatDate(temporal.busiestDay.date)},
        when we had {temporal.busiestDay.count} separate conversations.
      </motion.blockquote>
    </AnimatedSection>
  );
}
