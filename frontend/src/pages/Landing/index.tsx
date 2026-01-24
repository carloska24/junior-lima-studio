import { useState, useEffect } from 'react';
import { Hero } from './Hero';
import { Visagismo } from './Visagismo';
import { Services } from './Services';
import { Portfolio } from './Portfolio';
import { Testimonials } from './Testimonials';
import { Footer } from './Footer';
import { apiFetch } from '@/services/api';
import type { StudioSettings } from '@/types/studio';

export function LandingPage() {
  const [settings, setSettings] = useState<StudioSettings | null>(null);

  useEffect(() => {
    apiFetch('/studio')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(console.error);
  }, []);

  return (
    <main className="bg-midnight-950 min-h-screen text-offwhite-200">
      <Hero settings={settings} />
      <Visagismo settings={settings} />
      <Services />
      <Portfolio settings={settings} />
      <Testimonials />
      <Footer settings={settings} />
    </main>
  );
}
