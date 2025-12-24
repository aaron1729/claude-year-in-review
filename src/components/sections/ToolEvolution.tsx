'use client';

import { useRef } from 'react';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { ShareableCard } from '@/components/ui/ShareableCard';
import { DownloadCardButton } from '@/components/ui/DownloadCardButton';
import { motion } from 'framer-motion';
import type { ProcessedData } from '@/lib/types';

interface ToolEvolutionProps {
  data: ProcessedData;
}

export function ToolEvolution({ data }: ToolEvolutionProps) {
  const { tools, overview } = data;
  const cardRef = useRef<HTMLDivElement>(null);

  const topTools = tools.topTools.slice(0, 8);
  const maxToolCount = Math.max(...topTools.map((t) => t.count));

  return (
    <AnimatedSection>
      <h2 className="mb-4">Our Collaboration Evolved</h2>
      <p className="text-lg text-[var(--muted)] mb-12">
        We used {overview.uniqueTools} different tools together—from simple web searches
        to complex integrations. Here&apos;s how we worked.
      </p>

      <ShareableCard ref={cardRef} title="Tools We Used" userName={data.userName}>
        <div className="text-center mb-4">
          <div className="text-4xl font-medium text-[var(--accent)]">
            {overview.uniqueTools}
          </div>
          <div className="text-xs text-[var(--muted)] uppercase tracking-wider mt-1">
            Unique Tools
          </div>
        </div>
        <div className="space-y-2">
          {topTools.slice(0, 5).map((tool) => (
            <div key={tool.name} className="flex items-center gap-2">
              <span className="text-xs text-[var(--charcoal)] flex-1 truncate">
                {tool.name.replace(/_/g, ' ')}
              </span>
              <span className="text-xs text-[var(--muted)]">
                {tool.count.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </ShareableCard>

      <div className="mt-4 mb-12">
        <DownloadCardButton targetRef={cardRef} filename="claude-year-tools" />
      </div>

      <div className="space-y-4 mb-12">
        {topTools.map((tool, index) => (
          <motion.div
            key={tool.name}
            className="group"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            <div className="flex items-center gap-4">
              <span className="text-sm w-32 md:w-48 text-right text-[var(--charcoal)] truncate font-medium">
                {tool.name.replace(/_/g, ' ')}
              </span>
              <div className="flex-1 h-8 bg-[var(--muted-bg)] rounded-full overflow-hidden relative">
                <motion.div
                  className="h-full bg-[var(--accent)] rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(tool.count / maxToolCount) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.05, ease: [0.19, 1, 0.22, 1] }}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted)]">
                  {tool.count.toLocaleString()}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {tools.integrations.length > 0 && (
        <>
          <h3 className="text-lg mb-4">Integrations We Used</h3>
          <div className="flex flex-wrap gap-2 mb-8">
            {tools.integrations.map((integration, index) => (
              <motion.span
                key={integration.name}
                className="px-3 py-1.5 bg-white rounded-full text-sm border border-[var(--muted-bg)]"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                {integration.name}
                <span className="text-[var(--muted)] ml-1">({integration.count})</span>
              </motion.span>
            ))}
          </div>
        </>
      )}

      <motion.blockquote
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      >
        From quick lookups to complex workflows spanning multiple services,
        our toolkit grew with your needs.
      </motion.blockquote>
    </AnimatedSection>
  );
}
