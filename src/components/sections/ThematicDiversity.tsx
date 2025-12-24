'use client';

import { useRef } from 'react';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { ThemeCard } from '@/components/ui/ThemeCard';
import { ShareableCard } from '@/components/ui/ShareableCard';
import { DownloadCardButton } from '@/components/ui/DownloadCardButton';
import { motion } from 'framer-motion';
import type { ProcessedData } from '@/lib/types';

interface ThematicDiversityProps {
  data: ProcessedData;
}

export function ThematicDiversity({ data }: ThematicDiversityProps) {
  const { themes } = data;
  const cardRef = useRef<HTMLDivElement>(null);

  // Sort categories by count
  const sortedCategories = [...themes.categories].sort((a, b) => b.count - a.count);
  const topThemes = sortedCategories.slice(0, 6);

  return (
    <AnimatedSection>
      <h2 className="mb-4">The Many Hats You Wore</h2>
      <p className="text-lg text-[var(--muted)] mb-12">
        Our conversations spanned {themes.categories.length} distinct themes.
        You didn&apos;t come to me for just one thing—you brought your whole work.
      </p>

      <ShareableCard ref={cardRef} title="Topics We Explored" userName={data.userName}>
        <div className="space-y-3">
          {topThemes.slice(0, 5).map((theme, index) => (
            <div key={theme.name} className="flex items-center gap-3">
              <div className="text-lg font-medium text-[var(--accent)] w-6">
                {index + 1}.
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-[var(--charcoal)]">{theme.name}</div>
              </div>
              <div className="text-sm text-[var(--muted)]">
                {theme.count} conversations
              </div>
            </div>
          ))}
        </div>
      </ShareableCard>

      <div className="mt-4 mb-12">
        <DownloadCardButton targetRef={cardRef} filename="claude-year-themes" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {topThemes.map((theme, index) => (
          <ThemeCard
            key={theme.name}
            name={theme.name}
            count={theme.count}
            delay={index * 0.1}
          />
        ))}
      </div>

      {themes.uncategorized > 0 && (
        <motion.p
          className="text-sm text-[var(--muted)] text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Plus {themes.uncategorized} conversations that defied easy categorization—
          the truly unique moments.
        </motion.p>
      )}

      <motion.blockquote
        className="mt-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      >
        {topThemes[0] && topThemes[1] && (
          <>
            Your top focus was <strong>{topThemes[0].name}</strong> with {topThemes[0].count} conversations,
            followed by <strong>{topThemes[1].name}</strong>.
            This range isn&apos;t scattered—it&apos;s evidence of a life fully engaged.
          </>
        )}
      </motion.blockquote>
    </AnimatedSection>
  );
}
