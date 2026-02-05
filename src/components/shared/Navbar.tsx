'use client';

import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useTranslation } from '@/i18n';
import { cn } from '@/lib/utils';
import { DEMO_URL, IS_DEMO, PERSONAL_URL } from '@/lib/app-config';

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
  const { t } = useTranslation();
  const primaryCtaHref = IS_DEMO ? PERSONAL_URL : null;
  const primaryCtaLabel = t('nav.personalPreview');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
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
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/80 backdrop-blur-md border-b shadow-sm'
          : 'bg-transparent'
      )}
    >
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <a
          href="#hero"
          className="text-xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#hero');
          }}
        >
          Vitae.ai
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navKeys.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.href);
              }}
            >
              {t(item.key)}
            </a>
          ))}
          {primaryCtaHref && (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="ml-2"
            >
              <a href={primaryCtaHref} target="_blank" rel="noreferrer">
                {primaryCtaLabel}
              </a>
            </Button>
          )}
          <div className="flex items-center gap-1 ml-2 pl-2 border-l border-border">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <nav className="flex flex-col gap-2 mt-8">
                {navKeys.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="px-4 py-3 text-lg font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
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
                    className="px-4 py-3 text-lg font-medium text-primary hover:bg-muted rounded-lg transition-colors"
                  >
                    {primaryCtaLabel}
                  </a>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
