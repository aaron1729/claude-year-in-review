'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import type { ConversationHighlight } from '@/lib/types';

interface ConversationModalProps {
  conversation: ConversationHighlight | null;
  onClose: () => void;
}

export function ConversationModal({ conversation, onClose }: ConversationModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  useEffect(() => {
    if (conversation) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [conversation]);

  return (
    <AnimatePresence>
      {conversation && (
        <>
          <motion.div
            className="fixed inset-0 bg-[var(--charcoal)]/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
          >
            <div className="flex items-start justify-between p-6 border-b border-[var(--muted-bg)]">
              <div className="flex-1 pr-4">
                <h2 className="text-xl font-medium mb-1">{conversation.name}</h2>
                <p className="text-sm text-[var(--muted)]">
                  {new Date(conversation.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[var(--muted-bg)] rounded-lg transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {conversation.summary && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider mb-2">
                    Summary
                  </h3>
                  <p className="text-[var(--charcoal)]">{conversation.summary}</p>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-[var(--cream)] rounded-lg p-4 text-center">
                  <div className="text-2xl font-medium text-[var(--accent)]">
                    {conversation.messageCount}
                  </div>
                  <div className="text-sm text-[var(--muted)]">Messages</div>
                </div>
                <div className="bg-[var(--cream)] rounded-lg p-4 text-center">
                  <div className="text-2xl font-medium text-[var(--accent)]">
                    {conversation.toolsUsed.length}
                  </div>
                  <div className="text-sm text-[var(--muted)]">Tools Used</div>
                </div>
                <div className="bg-[var(--cream)] rounded-lg p-4 text-center col-span-2">
                  <div className="text-lg font-medium text-[var(--accent)]">
                    {conversation.category}
                  </div>
                  <div className="text-sm text-[var(--muted)]">Category</div>
                </div>
              </div>

              {conversation.toolsUsed.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider mb-2">
                    Tools Used
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {conversation.toolsUsed.map((tool) => (
                      <span
                        key={tool}
                        className="px-3 py-1 bg-[var(--muted-bg)] rounded-full text-sm"
                      >
                        {tool.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {conversation.notableExcerpt && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider mb-2">
                    Notable Exchange
                  </h3>
                  <div className="bg-[var(--cream)] rounded-lg p-4 space-y-3">
                    <div>
                      <span className="text-[var(--accent)] font-medium text-sm">You:</span>
                      <p className="text-[var(--charcoal)] mt-1">
                        &ldquo;{conversation.notableExcerpt.human}&rdquo;
                      </p>
                    </div>
                    <div>
                      <span className="text-[var(--sage)] font-medium text-sm">Claude:</span>
                      <p className="text-[var(--muted)] mt-1">
                        &ldquo;{conversation.notableExcerpt.assistant}&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider mb-2">
                  Why This Stood Out
                </h3>
                <p className="text-[var(--charcoal)] italic">{conversation.interestReason}</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
