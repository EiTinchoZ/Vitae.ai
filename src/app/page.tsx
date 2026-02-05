import { redirect } from 'next/navigation';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Skills } from '@/components/sections/Skills';
import { Education } from '@/components/sections/Education';
import { Certificates } from '@/components/sections/Certificates';
import { Projects } from '@/components/sections/Projects';
import { Experience } from '@/components/sections/Experience';
import { Contact } from '@/components/sections/Contact';
import { PersonalIntroGate } from '@/components/shared/PersonalIntroGate';
import { IS_DEMO } from '@/lib/app-config';

export default function Home() {
  if (IS_DEMO) {
    redirect('/demo');
  }

  return (
    <PersonalIntroGate>
      <Hero />
      <About />
      <Skills />
      <Education />
      <Certificates />
      <Projects />
      <Experience />
      <Contact />
    </PersonalIntroGate>
  );
}
