'use client';

import { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ShareableCard } from '@/components/ui/ShareableCard';
import { DownloadCardButton } from '@/components/ui/DownloadCardButton';
import { ShareButton } from '@/components/ui/ShareButton';
import type { ProcessedData } from '@/lib/types';

interface ClosingProps {
  data: ProcessedData;
}

export function Closing({ data }: ClosingProps) {
  const shouldReduceMotion = useReducedMotion();
  const firstName = data.userName.split(' ')[0];
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <section className="section min-h-screen flex flex-col justify-center items-center text-center">
      <motion.div
        className="section-content"
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
      >
        <motion.h2
          className="mb-8"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Looking Forward
        </motion.h2>

        <motion.p
          className="text-xl md:text-2xl text-[var(--charcoal)] max-w-2xl mx-auto leading-relaxed mb-8"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {data.overview.totalConversations.toLocaleString()} conversations.
          {' '}{data.overview.activeDays} days of collaboration.
          {' '}{data.overview.totalProjects} projects built together.
        </motion.p>

        <motion.p
          className="text-lg text-[var(--muted)] max-w-xl mx-auto mb-12"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Here&apos;s to the next year of building, thinking, and creating together, {firstName}.
        </motion.p>

        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          <ShareableCard ref={cardRef} title="My Year with Claude" userName={data.userName}>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-medium text-[var(--accent)]">
                  {data.overview.totalConversations.toLocaleString()}
                </div>
                <div className="text-xs text-[var(--muted)] uppercase tracking-wider mt-1">
                  Conversations
                </div>
              </div>
              <div>
                <div className="text-2xl font-medium text-[var(--accent)]">
                  {data.overview.activeDays}
                </div>
                <div className="text-xs text-[var(--muted)] uppercase tracking-wider mt-1">
                  Active Days
                </div>
              </div>
              <div>
                <div className="text-2xl font-medium text-[var(--accent)]">
                  {data.overview.uniqueTools}
                </div>
                <div className="text-xs text-[var(--muted)] uppercase tracking-wider mt-1">
                  Tools Used
                </div>
              </div>
            </div>
          </ShareableCard>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6"
          initial={shouldReduceMotion ? {} : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1 }}
        >
          <DownloadCardButton targetRef={cardRef} filename="claude-year-summary">
            Download Summary Card
          </DownloadCardButton>
          <ShareButton
            title={`${data.userName}'s Year in Review with Claude`}
            text={`${data.overview.totalConversations.toLocaleString()} conversations, ${data.overview.activeDays} active days, and ${data.overview.uniqueTools} tools used. Check out my year of collaboration with Claude!`}
          />
        </motion.div>

        <motion.div
          className="flex flex-col items-center gap-4 mt-12"
          initial={shouldReduceMotion ? {} : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2 }}
        >
          <p className="text-sm text-[var(--muted)]">
            Generated on {new Date(data.generatedAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>

          <div className="flex items-center gap-2 mt-4">
            <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center">
              <span className="text-white text-sm font-medium">C</span>
            </div>
            <span className="text-sm text-[var(--charcoal)]">Made with Claude</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
