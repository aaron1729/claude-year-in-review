'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ProcessedData } from '@/lib/types';

interface OpeningProps {
  data: ProcessedData;
}

export function Opening({ data }: OpeningProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="section min-h-screen flex flex-col justify-center items-center text-center">
      <motion.div
        className="section-content"
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
      >
        <motion.p
          className="text-[var(--muted)] text-sm uppercase tracking-[0.2em] mb-6"
          initial={shouldReduceMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          A Year in Review with Claude
        </motion.p>

        <motion.h1
          className="mb-8"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Hello, {data.userName.split(' ')[0]}
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-[var(--charcoal)] max-w-2xl mx-auto leading-relaxed"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          This isn&apos;t about numbers. It&apos;s about what we built together.
        </motion.p>

        <motion.div
          className="mt-16"
          initial={shouldReduceMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            className="w-6 h-10 border-2 border-[var(--muted)] rounded-full mx-auto flex justify-center"
            animate={shouldReduceMotion ? {} : { y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          >
            <motion.div
              className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mt-2"
              animate={shouldReduceMotion ? {} : { opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            />
          </motion.div>
          <p className="text-sm text-[var(--muted)] mt-4">Scroll to explore</p>
        </motion.div>
      </motion.div>
    </section>
  );
}
