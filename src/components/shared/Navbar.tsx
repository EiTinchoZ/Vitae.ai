'use client';

import { useState, useEffect } from 'react';
import { Menu, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useTranslation } from '@/i18n';
import { cn } from '@/lib/utils';
import { IS_DEMO, PERSONAL_URL } from '@/lib/app-config';

const navKeys = [
  { key: 'nav.home', href: '#hero' },
  { key: 'nav.about', href: '#about' },
  { key: 'nav.skills', href: '#skills' },
  { key: 'nav.education', href: '#education' },
  { key: 'nav.certificates', href: '#certificates' },
  { key: 'nav.projects', href: '#projects' },
  { key: 'nav.experience', href: '#experience' },
  { key: 'nav.contact', href: '#contact' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#hero');
  const { t } = useTranslation();
  const primaryCtaHref = IS_DEMO ? PERSONAL_URL : null;
  const primaryCtaLabel = t('nav.personalPreview');

  useEffect(() => {
    const sectionIds = navKeys.map((item) => item.href.slice(1));

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);

      let current = '#hero';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top;
          if (top <= 96) current = '#' + id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* ── Floating Pill Navbar ── */}
      <header
        className={cn(
          'fixed z-50 transition-all duration-500 ease-out',
          // Mobile/tablet: span inset-x-4
          'top-4 left-4 right-4',
          // Desktop: centered pill, auto-width
          'lg:top-6 lg:left-1/2 lg:right-auto lg:-translate-x-1/2'
        )}
      >
        <nav
          className={cn(
            'flex items-center gap-1 rounded-full px-3 py-2',
            'transition-all duration-500 ease-out',
            isScrolled
              ? 'bg-background/80 backdrop-blur-xl border border-border/30 shadow-lg shadow-foreground/5'
              : 'bg-background/40 backdrop-blur-sm border border-transparent'
          )}
        >
          {/* ── Logo ── */}
          <a
            href="#hero"
            className="text-base font-bold text-primary hover:opacity-75 transition-opacity mr-1 flex-shrink-0 tracking-tight"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#hero');
            }}
          >
            Vitae.ai
          </a>

          {/* ── Desktop nav links (lg+) ── */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navKeys.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  'px-2.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap',
                  activeSection === item.href
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'
                )}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
              >
                {t(item.key)}
              </a>
            ))}
          </div>

          {/* ── Spacer: pushes controls right on mobile ── */}
          <div className="flex-1 lg:hidden" />

          {/* ── Controls ── */}
          <div className="flex items-center gap-0.5 ml-1">
            {primaryCtaHref && (
              <Button
                asChild
                size="sm"
                className="rounded-full text-xs h-7 px-3 hidden lg:inline-flex bg-accent hover:bg-accent/90 text-accent-foreground border-0"
              >
                <a href={primaryCtaHref} target="_blank" rel="noreferrer">
                  {primaryCtaLabel}
                </a>
              </Button>
            )}

            <LanguageSwitcher />
            <ThemeToggle />

            {/* ── Mobile/tablet hamburger ── */}
            <div className="lg:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary"
                  >
                    <Menu className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px]">
                  <nav className="flex flex-col gap-2 mt-8">
                    {navKeys.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        className={cn(
                          'px-4 py-3 text-lg font-medium rounded-xl transition-colors',
                          activeSection === item.href
                            ? 'text-primary bg-primary/10'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        )}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavClick(item.href);
                        }}
                      >
                        {t(item.key)}
                      </a>
                    ))}
                    {primaryCtaHref && (
                      <a
                        href={primaryCtaHref}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-3 text-lg font-medium text-accent hover:bg-muted rounded-xl transition-colors"
                      >
                        {primaryCtaLabel}
                      </a>
                    )}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>
      </header>

      {/* ── Back to top ── */}
      <AnimatePresence>
        {isScrolled && (
          <motion.button
            key="back-to-top"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 left-6 z-40 flex items-center justify-center w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 hover:scale-110 active:scale-95 transition-all shadow-sm"
            aria-label="Back to top"
          >
            <ChevronUp className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
