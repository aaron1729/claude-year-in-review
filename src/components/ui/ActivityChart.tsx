'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';

interface ActivityChartProps {
  data: Record<string, number>;
  type: 'bar' | 'heatmap';
  label?: string;
}

export function ActivityChart({ data, type, label }: ActivityChartProps) {
  const shouldReduceMotion = useReducedMotion();

  const { sortedEntries, maxValue } = useMemo(() => {
    const entries = Object.entries(data);
    const max = Math.max(...entries.map(([, v]) => v));
    return { sortedEntries: entries, maxValue: max };
  }, [data]);

  if (type === 'bar') {
    return (
      <div className="space-y-2">
        {label && <p className="text-sm text-[var(--muted)] mb-4">{label}</p>}
        {sortedEntries.map(([key, value], index) => (
          <div key={key} className="flex items-center gap-3">
            <span className="text-sm w-20 text-right text-[var(--muted)]">{key}</span>
            <div className="flex-1 h-6 bg-[var(--muted-bg)] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[var(--accent)] rounded-full"
                initial={shouldReduceMotion ? { width: `${(value / maxValue) * 100}%` } : { width: 0 }}
                whileInView={{ width: `${(value / maxValue) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.05, ease: [0.19, 1, 0.22, 1] }}
              />
            </div>
            <span className="text-sm w-12 text-[var(--muted)]">{value}</span>
          </div>
        ))}
      </div>
    );
  }

  // Hour heatmap (24 hours)
  return (
    <div className="space-y-4">
      {label && <p className="text-sm text-[var(--muted)] mb-2">{label}</p>}
      <div className="flex gap-1 flex-wrap justify-center">
        {Array.from({ length: 24 }, (_, hour) => {
          const value = data[hour] || 0;
          const intensity = maxValue > 0 ? value / maxValue : 0;
          return (
            <motion.div
              key={hour}
              className="relative group"
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: hour * 0.02 }}
            >
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center text-xs"
                style={{
                  backgroundColor: `rgba(193, 95, 60, ${0.1 + intensity * 0.9})`,
                  color: intensity > 0.5 ? 'white' : 'var(--charcoal)',
                }}
              >
                {hour}
              </div>
              <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-[var(--charcoal)] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                {value} conversations
              </div>
            </motion.div>
          );
        })}
      </div>
      <p className="text-xs text-center text-[var(--muted)]">Hour of day (24h)</p>
    </div>
  );
}
