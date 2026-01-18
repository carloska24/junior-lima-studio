import React from 'react';
import { Hero } from './Hero';
import { Services } from './Services';
import { Portfolio } from './Portfolio';
import { Testimonials } from './Testimonials';
import { Footer } from './Footer';

export function LandingPage() {
  return (
    <main className="bg-midnight-900 min-h-screen text-gray-100 selection:bg-gold-500 selection:text-midnight-900">
      <Hero />
      <Services />
      <Portfolio />
      <Testimonials />
      <Footer />
    </main>
  );
}
