'use client';

import { motion } from 'framer-motion';

const manifestoStats = [
  { value: '2024', label: 'Hackathon Winner' },
  { value: 'C2', label: 'Bilingual Certified' },
  { value: '2 Degrees', label: 'Industrial Eng + AI' },
];

export function ManifestoSection() {
  return (
    <section
      className="relative py-32 md:py-48 overflow-hidden"
      style={{ backgroundColor: 'oklch(0.127 0 0)' }}
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-7xl">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.45 }}
          className="inline-block text-xs tracking-[0.3em] uppercase font-semibold text-accent"
        >
          El Manifiesto
        </motion.span>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-end">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-120px' }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="text-3xl md:text-4xl italic leading-tight"
            style={{
              fontFamily: 'var(--font-cormorant), serif',
              color: 'rgba(242,240,233,0.62)',
            }}
          >
            {'Los CVs tradicionales te dicen qu\u00e9 hizo alguien.'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-120px' }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="space-y-4"
          >
            <p
              className="font-bold text-3xl md:text-4xl"
              style={{
                fontFamily: 'var(--font-jakarta), sans-serif',
                color: 'rgba(242,240,233,0.98)',
              }}
            >
              Este portfolio te muestra
            </p>
            <p
              className="italic text-6xl md:text-8xl leading-[0.95]"
              style={{
                fontFamily: 'var(--font-cormorant), serif',
                color: 'oklch(0.962 0.007 83)',
              }}
            >
              {'qui\u00e9n soy.'}
            </p>
            <p
              className="text-base md:text-lg"
              style={{
                fontFamily: 'var(--font-jakarta), sans-serif',
                color: 'rgba(242,240,233,0.70)',
              }}
            >
              IA conversacional, proyectos reales, habilidades verificables.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6"
        >
          {manifestoStats.map((item) => (
            <div
              key={item.value}
              className="rounded-[1.5rem] border border-[rgba(242,240,233,0.18)] bg-[rgba(242,240,233,0.04)] p-6"
            >
              <p
                className="text-lg uppercase tracking-[0.2em]"
                style={{
                  fontFamily: 'var(--font-geist-mono), monospace',
                  color: 'rgba(242,240,233,0.92)',
                }}
              >
                {item.value}
              </p>
              <p
                className="mt-2 text-xs uppercase tracking-[0.16em]"
                style={{
                  fontFamily: 'var(--font-geist-mono), monospace',
                  color: 'rgba(242,240,233,0.58)',
                }}
              >
                {item.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}