import { motion } from 'framer-motion';
import { Sparkles, Eye, Palette, Crown } from 'lucide-react';

const pillars = [
  {
    icon: Eye,
    title: 'Análise Facial',
    description: 'Estudo detalhado das proporções, traços e expressões únicas de cada cliente.',
  },
  {
    icon: Palette,
    title: 'Harmonização',
    description: 'Equilíbrio perfeito entre corte, coloração e estilo de vida.',
  },
  {
    icon: Crown,
    title: 'Identidade Única',
    description: 'Criação de um visual autêntico que potencializa sua presença.',
  },
  {
    icon: Sparkles,
    title: 'Técnica Refinada',
    description: 'Anos de estudo e aperfeiçoamento para resultados excepcionais.',
  },
];

export function Visagismo() {
  return (
    <section className="py-32 px-6 bg-midnight-900 relative overflow-hidden">
      {/* Subtle Background Element */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20 space-y-6">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gold-400 tracking-[0.3em] text-xs uppercase font-sans"
          >
            O Diferencial
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif text-offwhite-100"
          >
            Visagismo
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-offwhite-300 max-w-2xl mx-auto text-lg leading-relaxed font-sans"
          >
            Mais do que cortar cabelo, o{' '}
            <span className="text-gold-400 font-medium">visagismo</span> é a arte de criar harmonia
            entre seus traços faciais, personalidade e estilo de vida. Cada corte é uma obra única,
            pensada exclusivamente para você.
          </motion.p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group text-center space-y-4"
            >
              {/* Icon Container */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-gold-500/20 bg-midnight-950/50 group-hover:border-gold-500/50 group-hover:bg-gold-500/5 transition-all duration-500">
                <pillar.icon
                  size={28}
                  strokeWidth={1}
                  className="text-gold-400 group-hover:text-gold-300 transition-colors"
                />
              </div>

              {/* Title */}
              <h3 className="text-xl font-serif text-offwhite-100 group-hover:text-white transition-colors">
                {pillar.title}
              </h3>

              {/* Description */}
              <p className="text-offwhite-300 text-sm leading-relaxed group-hover:text-offwhite-200 transition-colors">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-24 text-center"
        >
          <blockquote className="text-offwhite-300 italic font-serif text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            "O cabelo certo não apenas melhora sua aparência —
            <span className="text-gold-400"> transforma como você se sente</span> e como o mundo te
            percebe."
          </blockquote>
          <p className="mt-6 text-gold-500 text-sm tracking-widest uppercase">— Júnior Lima</p>
        </motion.div>
      </div>
    </section>
  );
}
