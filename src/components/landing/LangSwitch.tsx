'use client';

import { home, type Lang } from '@/content/lang';

const label: Record<Lang, string> = { es: 'Español', en: 'English' };

// ES / EN del menú: enlaces reales a / y /en. Al hacer clic conserva la sección en la que está (#ancla).
export function LangSwitch({ lang }: { lang: Lang }) {
  return (
    <span className="lang-sw" role="group" aria-label={lang === 'en' ? 'Language' : 'Idioma'}>
      {(['es', 'en'] as const).map((l) => (
        <a
          key={l}
          href={home[l]}
          hrefLang={l}
          lang={l}
          title={label[l]}
          aria-current={l === lang ? 'true' : undefined}
          onClick={(e) => {
            if (l === lang) return e.preventDefault();
            e.currentTarget.href = home[l] + location.hash;
          }}
        >
          {l.toUpperCase()}
        </a>
      ))}
    </span>
  );
}
