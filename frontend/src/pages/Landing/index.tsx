import { useState, useEffect } from 'react';
import { Hero } from './Hero';
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
    <main className="bg-midnight-900 min-h-screen text-gray-100 selection:bg-gold-500 selection:text-midnight-900">
      <Hero settings={settings} />
      <Services />
      <Portfolio />
      <Testimonials />
      <Footer settings={settings} />
    </main>
  );
}
