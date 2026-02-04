'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Github, Linkedin, Download, Send } from 'lucide-react';
import { SectionWrapper, SectionTitle } from '@/components/shared/SectionWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cvData } from '@/data/cv-data';

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: cvData.personal.email,
    href: `mailto:${cvData.personal.email}`,
  },
  {
    icon: Phone,
    label: 'Teléfono',
    value: cvData.personal.phone,
    href: `tel:${cvData.personal.phone.replace(/\s/g, '')}`,
  },
  {
    icon: MapPin,
    label: 'Ubicación',
    value: cvData.personal.location,
    href: null,
  },
];

const socialLinks = [
  {
    icon: Github,
    label: 'GitHub',
    value: '@EiTinchoZ',
    href: cvData.personal.github,
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: 'martinbundy15',
    href: cvData.personal.linkedin,
  },
];

export function Contact() {
  return (
    <SectionWrapper id="contact">
      <SectionTitle subtitle="¿Tienes un proyecto en mente? ¡Hablemos!">
        Contacto
      </SectionTitle>

      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-semibold mb-4">
                ¡Conectemos!
              </h3>
              <p className="text-muted-foreground mb-6">
                Estoy abierto a oportunidades de trabajo, colaboraciones en proyectos
                de IA y networking profesional. No dudes en contactarme.
              </p>
            </div>

            {/* Contact cards */}
            <div className="space-y-3">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item.href ? (
                    <a
                      href={item.href}
                      className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                        <p className="font-medium">{item.value}</p>
                      </div>
                    </a>
                  ) : (
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                        <p className="font-medium">{item.value}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Social links */}
            <div className="flex gap-3 pt-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <link.icon className="h-4 w-4" />
                  <span className="text-sm">{link.value}</span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* CTA Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="h-full bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardContent className="p-8 h-full flex flex-col justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-secondary p-1">
                    <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                      <Send className="h-8 w-8 text-primary" />
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mb-3">
                    ¿Listo para colaborar?
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Descarga mi CV completo o envíame un mensaje directo.
                  </p>

                  <div className="space-y-3">
                    <Button asChild size="lg" className="w-full gap-2">
                      <a href="/cv/CV_Martin_Bundy_2026.pdf" download>
                        <Download className="h-4 w-4" />
                        Descargar CV Completo
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="w-full gap-2"
                    >
                      <a href={`mailto:${cvData.personal.email}`}>
                        <Mail className="h-4 w-4" />
                        Enviar Email
                      </a>
                    </Button>
                  </div>

                  {/* Quick stats */}
                  <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">2+</p>
                      <p className="text-xs text-muted-foreground">Carreras en curso</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">6</p>
                      <p className="text-xs text-muted-foreground">Certificaciones</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">C2</p>
                      <p className="text-xs text-muted-foreground">Nivel Inglés</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}
