'use client';

import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { ActivityChart } from '@/components/ui/ActivityChart';
import { motion } from 'framer-motion';
import type { ProcessedData } from '@/lib/types';

interface RhythmPatternsProps {
  data: ProcessedData;
}

export function RhythmPatterns({ data }: RhythmPatternsProps) {
  const { temporal } = data;

  // Find peak day and hour
  const dayEntries = Object.entries(temporal.byDayOfWeek);
  const peakDay = dayEntries.reduce((max, curr) => curr[1] > max[1] ? curr : max);

  const hourEntries = Object.entries(temporal.byHour);
  const peakHour = hourEntries.reduce((max, curr) =>
    Number(curr[1]) > Number(max[1]) ? curr : max
  );
  const peakHourNum = parseInt(peakHour[0]);

  const getTimeOfDay = (hour: number): string => {
    if (hour >= 5 && hour < 12) return 'morning person';
    if (hour >= 12 && hour < 17) return 'afternoon worker';
    if (hour >= 17 && hour < 21) return 'evening thinker';
    return 'night owl';
  };

  // Order days properly
  const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const orderedDays = dayOrder.reduce((acc, day) => {
    if (temporal.byDayOfWeek[day] !== undefined) {
      acc[day] = temporal.byDayOfWeek[day];
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <AnimatedSection>
      <h2 className="mb-4">The Rhythm of Partnership</h2>
      <p className="text-lg text-[var(--muted)] mb-12">
        Your patterns tell a story. Here&apos;s when we were most in sync.
      </p>

      <div className="mb-12">
        <h3 className="text-lg mb-6">By Day of Week</h3>
        <ActivityChart data={orderedDays} type="bar" />
      </div>

      <div className="mb-12">
        <h3 className="text-lg mb-6">By Hour of Day</h3>
        <ActivityChart data={temporal.byHour} type="heatmap" />
      </div>

      <motion.blockquote
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      >
        {peakDay[0]} was your most active day with {peakDay[1]} total conversations.
        And you&apos;re a {getTimeOfDay(peakHourNum)}—most of our conversations
        happened around {peakHourNum > 12 ? `${peakHourNum - 12}pm` : `${peakHourNum}am`}.
      </motion.blockquote>
    </AnimatedSection>
  );
}
