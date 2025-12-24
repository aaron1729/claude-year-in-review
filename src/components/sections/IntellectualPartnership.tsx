'use client';

import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { motion } from 'framer-motion';
import type { ProcessedData } from '@/lib/types';

interface IntellectualPartnershipProps {
  data: ProcessedData;
}

export function IntellectualPartnership({ data }: IntellectualPartnershipProps) {
  const { projects, overview } = data;

  const topProjects = projects.slice(0, 5);

  return (
    <AnimatedSection>
      <h2 className="mb-4">Building Together</h2>
      <p className="text-lg text-[var(--muted)] mb-12">
        You created {overview.totalProjects} structured projects with me—
        dedicated spaces for focused work and iterative thinking.
      </p>

      {topProjects.length > 0 && (
        <div className="space-y-4 mb-12">
          {topProjects.map((project, index) => (
            <motion.div
              key={project.uuid}
              className="card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3 className="text-lg font-medium mb-1">{project.name}</h3>
              {project.description && (
                <p className="text-[var(--muted)] text-sm mb-2 line-clamp-2">
                  {project.description}
                </p>
              )}
              <div className="flex gap-4 text-xs text-[var(--muted)]">
                <span>{project.docCount} document{project.docCount !== 1 ? 's' : ''}</span>
                <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <motion.blockquote
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      >
        These projects weren&apos;t just containers—they were the evolution of ideas.
        {overview.totalProjects > 10 && (
          <> Your {overview.totalProjects} projects show a pattern of serious, iterative work.</>
        )}
      </motion.blockquote>
    </AnimatedSection>
  );
}
