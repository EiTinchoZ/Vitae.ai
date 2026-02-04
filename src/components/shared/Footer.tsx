import { Github, Linkedin, Mail } from 'lucide-react';
import { cvData } from '@/data/cv-data';

const socialLinks = [
  {
    name: 'GitHub',
    href: cvData.personal.github,
    icon: Github,
  },
  {
    name: 'LinkedIn',
    href: cvData.personal.linkedin,
    icon: Linkedin,
  },
  {
    name: 'Email',
    href: `mailto:${cvData.personal.email}`,
    icon: Mail,
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} {cvData.personal.name}. Todos los derechos reservados.
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Desarrollado con Next.js y TailwindCSS
            </p>
          </div>

          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={link.name}
              >
                <link.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
