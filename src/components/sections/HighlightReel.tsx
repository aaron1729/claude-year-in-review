'use client';

import { useState } from 'react';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { ConversationModal } from '@/components/ui/ConversationModal';
import { motion } from 'framer-motion';
import type { ProcessedData, ConversationHighlight } from '@/lib/types';

interface HighlightReelProps {
  data: ProcessedData;
}

export function HighlightReel({ data }: HighlightReelProps) {
  const { highlights } = data;
  const [selectedConversation, setSelectedConversation] = useState<ConversationHighlight | null>(null);

  const topHighlights = highlights.slice(0, 8);

  return (
    <>
      <AnimatedSection>
        <h2 className="mb-4">Moments That Mattered</h2>
        <p className="text-lg text-[var(--muted)] mb-12">
          Some conversations stood out—where we went deeper, solved harder problems,
          or explored new territory together. Click any to explore.
        </p>

        <div className="space-y-6">
          {topHighlights.map((highlight, index) => (
            <motion.button
              key={highlight.uuid}
              className="card card-clickable group text-left w-full"
              onClick={() => setSelectedConversation(highlight)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="text-lg font-medium leading-tight group-hover:text-[var(--accent)] transition-colors">
                  {highlight.name}
                </h3>
                <span className="text-xs text-[var(--muted)] whitespace-nowrap">
                  {new Date(highlight.date).toLocaleDateString()}
                </span>
              </div>

              {highlight.summary && (
                <p className="text-[var(--muted)] text-sm mb-3 line-clamp-2">
                  {highlight.summary}
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-0.5 bg-[var(--accent)] text-white rounded text-xs">
                  {highlight.category}
                </span>
                <span className="px-2 py-0.5 bg-[var(--muted-bg)] text-[var(--muted)] rounded text-xs">
                  {highlight.messageCount} messages
                </span>
                {highlight.toolsUsed.length > 0 && (
                  <span className="px-2 py-0.5 bg-[var(--muted-bg)] text-[var(--muted)] rounded text-xs">
                    {highlight.toolsUsed.length} tool{highlight.toolsUsed.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              <p className="text-xs text-[var(--sage)] mt-2 italic">
                {highlight.interestReason}
              </p>
            </motion.button>
          ))}
        </div>

        <motion.blockquote
          className="mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          These weren&apos;t just transactions—they were genuine problem-solving sessions
          where we worked through complexity together.
        </motion.blockquote>
      </AnimatedSection>

      <ConversationModal
        conversation={selectedConversation}
        onClose={() => setSelectedConversation(null)}
      />
    </>
  );
}
