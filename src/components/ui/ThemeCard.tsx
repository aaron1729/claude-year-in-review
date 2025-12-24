'use client';

import { motion } from 'framer-motion';

interface ThemeCardProps {
  name: string;
  count: number;
  onClick?: () => void;
  delay?: number;
}

export function ThemeCard({ name, count, onClick, delay = 0 }: ThemeCardProps) {
  return (
    <motion.button
      className="card card-clickable text-left w-full"
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <h3 className="text-lg font-medium mb-1">{name}</h3>
      <p className="text-[var(--muted)] text-sm">
        {count} conversation{count !== 1 ? 's' : ''}
      </p>
    </motion.button>
  );
}
