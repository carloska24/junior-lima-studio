import { motion } from 'framer-motion';
import { Scissors, Sparkles, User, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

const services = [
  {
    id: 1,
    title: 'Corte Signature',
    description:
      'Análise visagista completa seguida de corte preciso e texturização personalizada para seu estilo.',
    price: 'R$ 120',
    duration: '45 min',
    icon: Scissors,
    className: 'md:col-span-2',
  },
  {
    id: 2,
    title: 'Barba & Terapia',
    description:
      'Ritual completo com toalha quente, esfoliação, hidratação e alinhamento dos fios.',
    price: 'R$ 80',
    duration: '30 min',
    icon: User,
    className: '',
  },
  {
    id: 3,
    title: 'Coloração Premium',
    description:
      'Técnicas avançadas de colorimetria para cobrir ou estilizar seus cabelos com produtos de alta performance.',
    price: 'A partir de R$ 180',
    duration: '90 min',
    icon: Palette,
    className: '',
  },
  {
    id: 4,
    title: 'Tratamento Capilar',
    description: 'Reconstrução profunda e hidratação para saúde e brilho intenso dos fios.',
    price: 'R$ 150',
    duration: '60 min',
    icon: Sparkles,
    className: 'md:col-span-2',
  },
];

export function Services() {
  return (
    <section className="py-24 px-6 bg-midnight-900 border-t border-midnight-800 relative overflow-hidden">
      {/* Section Header */}
      <div className="max-w-6xl mx-auto mb-16 space-y-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-serif text-gray-100"
        >
          Nossos Serviços
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-gold-500 uppercase tracking-[0.2em] text-sm"
        >
          Experiências Exclusivas
        </motion.p>
      </div>

      {/* Bento Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -5 }}
            className={cn(
              'group relative p-8 bg-midnight-800/50 backdrop-blur-sm border border-midnight-700 hover:border-gold-500/50 transition-all duration-500 rounded-sm flex flex-col justify-between overflow-hidden',
              service.className
            )}
          >
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold-500/0 via-gold-500/0 to-gold-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
              <div className="mb-6 p-3 bg-midnight-900 w-fit rounded-sm border border-midnight-700 group-hover:border-gold-500/30 transition-colors">
                <service.icon className="w-6 h-6 text-gold-500" strokeWidth={1.5} />
              </div>

              <h3 className="text-2xl font-serif text-gray-100 mb-2 group-hover:text-gold-400 transition-colors">
                {service.title}
              </h3>

              <p className="text-gray-400 font-sans text-sm leading-relaxed mb-6">
                {service.description}
              </p>
            </div>

            <div className="relative z-10 flex items-center justify-between border-t border-midnight-700 pt-4 mt-auto">
              <span className="text-gold-500 font-medium font-serif italic text-lg">
                {service.price}
              </span>
              <span className="text-gray-500 text-xs uppercase tracking-wider">
                {service.duration}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Global CTA */}
      <div className="mt-16 text-center">
        <Button variant="ghost" className="text-gray-400 hover:text-gold-500 hover:bg-transparent">
          Ver Menu Completo &rarr;
        </Button>
      </div>
    </section>
  );
}
