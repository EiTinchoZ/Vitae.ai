'use client';

import { motion } from 'framer-motion';
import { MapPin, GraduationCap, Briefcase, Languages } from 'lucide-react';
import { SectionWrapper, SectionTitle } from '@/components/shared/SectionWrapper';
import { cvData } from '@/data/cv-data';

const highlights = [
  {
    icon: GraduationCap,
    label: 'Formación',
    value: 'Ingeniería Industrial & IA',
  },
  {
    icon: Briefcase,
    label: 'Especialización',
    value: 'Machine Learning & Deep Learning',
  },
  {
    icon: MapPin,
    label: 'Ubicación',
    value: 'Panamá',
  },
  {
    icon: Languages,
    label: 'Idiomas',
    value: 'Español (Nativo) • Inglés (C2)',
  },
];

const specialties = [
  'Machine Learning',
  'Deep Learning',
  'IA Generativa',
  'RAG',
  'Prompt Engineering',
  'Agentes Inteligentes',
  'Python',
  'Automatización',
];

export function About() {
  return (
    <SectionWrapper id="about">
      <SectionTitle subtitle="Conoce más sobre mi trayectoria y especialidades">
        Sobre Mí
      </SectionTitle>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Profile text */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-muted-foreground leading-relaxed mb-6">
            {cvData.profile}
          </p>

          {/* Highlights */}
          <div className="grid grid-cols-2 gap-4">
            {highlights.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <item.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-medium">{item.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Specialties */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-muted/30 rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Especialidades</h3>
          <div className="flex flex-wrap gap-2">
            {specialties.map((specialty, index) => (
              <motion.span
                key={specialty}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="px-4 py-2 bg-background rounded-full text-sm font-medium border hover:border-primary/50 transition-colors cursor-default"
              >
                {specialty}
              </motion.span>
            ))}
          </div>

          {/* Quote */}
          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-muted-foreground italic">
              &ldquo;Combinando la optimización de la ingeniería industrial con el poder de la inteligencia artificial para crear soluciones innovadoras.&rdquo;
            </p>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
