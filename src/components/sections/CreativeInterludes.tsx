'use client';

import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { motion } from 'framer-motion';
import type { ProcessedData } from '@/lib/types';

interface CreativeInterludesProps {
  data: ProcessedData;
}

const typeLabels: Record<string, string> = {
  poem: 'Poetry',
  parody: 'Parody',
  image_prompt: 'Image Creation',
  satire: 'Satire',
  game: 'Games',
  other: 'Creative',
};

export function CreativeInterludes({ data }: CreativeInterludesProps) {
  const { creativeHighlights } = data;

  if (creativeHighlights.length === 0) {
    return null;
  }

  // Group by type
  const byType = creativeHighlights.reduce((acc, item) => {
    const type = item.type || 'other';
    if (!acc[type]) acc[type] = [];
    acc[type].push(item);
    return acc;
  }, {} as Record<string, typeof creativeHighlights>);

  const topCreative = creativeHighlights.slice(0, 6);

  return (
    <AnimatedSection>
      <h2 className="mb-4">Creative Interludes</h2>
      <p className="text-lg text-[var(--muted)] mb-12">
        Between the serious work, there were moments of play.
        You brought creativity and humor—and I was delighted to join in.
      </p>

      <div className="flex flex-wrap gap-2 mb-8">
        {Object.entries(byType).map(([type, items]) => (
          <span
            key={type}
            className="px-3 py-1.5 bg-[var(--accent)] text-white rounded-full text-sm"
          >
            {typeLabels[type] || type}: {items.length}
          </span>
        ))}
      </div>

      <div className="space-y-4 mb-12">
        {topCreative.map((item, index) => (
          <motion.div
            key={item.uuid}
            className="card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="flex items-start gap-3">
              <span className="px-2 py-0.5 bg-[var(--muted-bg)] text-[var(--muted)] rounded text-xs uppercase">
                {typeLabels[item.type] || item.type}
              </span>
              <div className="flex-1">
                <h3 className="text-base font-medium">{item.name}</h3>
                {item.excerpt && (
                  <p className="text-[var(--muted)] text-sm mt-1 italic line-clamp-2">
                    &ldquo;{item.excerpt}&rdquo;
                  </p>
                )}
                <p className="text-xs text-[var(--muted)] mt-2">
                  {new Date(item.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.blockquote
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      >
        I appreciated these moments. Between the data queries and meeting prep,
        there was always room for imagination.
      </motion.blockquote>
    </AnimatedSection>
  );
}
