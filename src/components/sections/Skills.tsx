'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Code, Factory, Laptop } from 'lucide-react';
import { SectionWrapper, SectionTitle } from '@/components/shared/SectionWrapper';
import { Button } from '@/components/ui/button';
import { cvData, skillCategories, type SkillCategory } from '@/data/cv-data';
import { cn } from '@/lib/utils';

const categoryIcons = {
  ai: Brain,
  programming: Code,
  industrial: Factory,
  technology: Laptop,
};

export function Skills() {
  const [activeCategory, setActiveCategory] = useState<SkillCategory | 'all'>('all');

  const filteredSkills =
    activeCategory === 'all'
      ? cvData.skills
      : cvData.skills.filter((skill) => skill.category === activeCategory);

  const categories = Object.entries(skillCategories) as [SkillCategory, typeof skillCategories[SkillCategory]][];

  return (
    <SectionWrapper id="skills" className="bg-muted/20">
      <SectionTitle subtitle="Tecnologías y competencias en las que me especializo">
        Habilidades Técnicas
      </SectionTitle>

      {/* Category filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <Button
          variant={activeCategory === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveCategory('all')}
        >
          Todas
        </Button>
        {categories.map(([key, value]) => {
          const Icon = categoryIcons[key];
          return (
            <Button
              key={key}
              variant={activeCategory === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(key)}
              className="gap-2"
            >
              <Icon className="h-4 w-4" />
              {value.label}
            </Button>
          );
        })}
      </div>

      {/* Skills grid */}
      <motion.div
        layout
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
      >
        {filteredSkills.map((skill, index) => {
          const Icon = categoryIcons[skill.category];
          const category = skillCategories[skill.category];

          return (
            <motion.div
              key={skill.name}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
              className={cn(
                'group relative p-4 rounded-xl border bg-background',
                'hover:border-primary/50 hover:shadow-md transition-all cursor-default'
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    skill.category === 'ai' && 'bg-blue-500/10 text-blue-500',
                    skill.category === 'programming' && 'bg-green-500/10 text-green-500',
                    skill.category === 'industrial' && 'bg-amber-500/10 text-amber-500',
                    skill.category === 'technology' && 'bg-purple-500/10 text-purple-500'
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-sm">{skill.name}</p>
                  <p className="text-xs text-muted-foreground">{category.label}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Stats */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map(([key, value]) => {
          const Icon = categoryIcons[key];
          const count = cvData.skills.filter((s) => s.category === key).length;

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center p-4 rounded-xl bg-background border"
            >
              <Icon className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-xs text-muted-foreground">{value.label}</p>
            </motion.div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
