import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

const portfolioItems = [
  {
    id: 1,
    image:
      'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2670&auto=format&fit=crop',
    title: 'Fade Clássico',
    category: 'Corte',
    className: 'h-96',
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1599351431202-6e0c06e76cab?q=80&w=2670&auto=format&fit=crop',
    title: 'Barba Modelada',
    category: 'Barba',
    className: 'h-[30rem]',
  },
  {
    id: 3,
    image:
      'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2674&auto=format&fit=crop',
    title: 'Estilo Moderno',
    category: 'Visagismo',
    className: 'h-80',
  },
  {
    id: 4,
    image:
      'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=2670&auto=format&fit=crop',
    title: 'Acabamento Premium',
    category: 'Tratamento',
    className: 'h-[28rem]',
  },
  {
    id: 5,
    image:
      'https://images.unsplash.com/photo-1503951914875-befbb713d752?q=80&w=2668&auto=format&fit=crop',
    title: 'Executivo',
    category: 'Corte',
    className: 'h-[34rem]',
  },
  {
    id: 6,
    image:
      'https://images.unsplash.com/photo-1635273052243-5b88716b7616?q=80&w=2670&auto=format&fit=crop',
    title: 'Colorimetria',
    category: 'Coloração',
    className: 'h-96',
  },
];

export function Portfolio() {
  return (
    <section className="py-24 px-6 bg-midnight-900 border-t border-midnight-800">
      {/* Section Header */}
      <div className="max-w-6xl mx-auto mb-16 space-y-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-serif text-gray-100"
        >
          Portfólio
        </motion.h2>
        <p className="text-gold-500 uppercase tracking-[0.2em] text-sm">Transformações Reais</p>
      </div>

      {/* Masonry Grid */}
      <div className="max-w-7xl mx-auto columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {portfolioItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="break-inside-avoid relative group overflow-hidden rounded-sm"
          >
            {/* Image Container */}
            <div className={cn('relative w-full overflow-hidden bg-midnight-800', item.className)}>
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale hover:grayscale-0"
                loading="lazy"
              />

              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-center p-4">
                <span className="text-gold-500 text-xs uppercase tracking-widest mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {item.category}
                </span>
                <h3 className="text-2xl font-serif text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                  {item.title}
                </h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <Button variant="outline" className="text-xs">
          Ver Galeria Completa (Instagram)
        </Button>
      </div>
    </section>
  );
}
