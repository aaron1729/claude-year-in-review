'use client';

import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { motion } from 'framer-motion';
import type { ProcessedData } from '@/lib/types';

interface WhatILearnedProps {
  data: ProcessedData;
}

export function WhatILearned({ data }: WhatILearnedProps) {
  const { memoryInsights } = data;

  if (memoryInsights.length === 0) {
    return null;
  }

  // Group by category
  const byCategory = memoryInsights.reduce((acc, insight) => {
    if (!acc[insight.category]) acc[insight.category] = [];
    acc[insight.category].push(insight);
    return acc;
  }, {} as Record<string, typeof memoryInsights>);

  const categories = Object.entries(byCategory).slice(0, 6);

  return (
    <AnimatedSection>
      <h2 className="mb-4">What I Learned About You</h2>
      <p className="text-lg text-[var(--muted)] mb-12">
        Over our conversations, I accumulated context about how you work,
        what you prefer, and what matters to you.
      </p>

      <div className="space-y-6">
        {categories.map(([category, insights], catIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: catIndex * 0.1 }}
          >
            <h3 className="text-base font-medium mb-3 text-[var(--accent)]">{category}</h3>
            <ul className="space-y-2">
              {insights.slice(0, 3).map((insight, index) => (
                <li
                  key={index}
                  className="text-[var(--charcoal)] pl-4 border-l-2 border-[var(--muted-bg)]"
                >
                  {insight.insight}
                  {insight.projectName && (
                    <span className="text-xs text-[var(--muted)] ml-2">
                      (from {insight.projectName})
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <motion.blockquote
        className="mt-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      >
        These accumulated insights let me serve you better over time.
        Not just answering questions, but understanding context.
      </motion.blockquote>
    </AnimatedSection>
  );
}
