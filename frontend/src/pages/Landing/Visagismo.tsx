import { motion } from 'framer-motion';
import { Sparkles, Eye, Palette, Crown, ArrowRight } from 'lucide-react';

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

// Dados dos tipos de rosto para o guia educacional
const faceShapes = [
  {
    id: 'oval',
    name: 'Oval',
    description: 'O formato mais versátil',
    tip: 'Aceita praticamente qualquer estilo de corte',
    svg: (
      <svg viewBox="0 0 80 100" className="w-16 h-20">
        <ellipse
          cx="40"
          cy="50"
          rx="30"
          ry="42"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    ),
  },
  {
    id: 'round',
    name: 'Redondo',
    description: 'Bochechas proeminentes',
    tip: 'Cortes com volume no topo alongam o rosto',
    svg: (
      <svg viewBox="0 0 80 100" className="w-16 h-20">
        <ellipse
          cx="40"
          cy="50"
          rx="35"
          ry="38"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    ),
  },
  {
    id: 'square',
    name: 'Quadrado',
    description: 'Mandíbula marcada',
    tip: 'Camadas e texturas suavizam os ângulos',
    svg: (
      <svg viewBox="0 0 80 100" className="w-16 h-20">
        <path
          d="M15 20 Q15 15 20 15 L60 15 Q65 15 65 20 L65 75 Q65 85 55 88 L40 92 L25 88 Q15 85 15 75 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    ),
  },
  {
    id: 'oblong',
    name: 'Oblongo',
    description: 'Face alongada',
    tip: 'Franjas e volume lateral equilibram',
    svg: (
      <svg viewBox="0 0 80 100" className="w-16 h-20">
        <ellipse
          cx="40"
          cy="50"
          rx="25"
          ry="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    ),
  },
  {
    id: 'triangle',
    name: 'Triangular',
    description: 'Queixo mais largo que a testa',
    tip: 'Volume no topo harmoniza as proporções',
    svg: (
      <svg viewBox="0 0 80 100" className="w-16 h-20">
        <path
          d="M40 12 Q55 12 60 30 L65 70 Q65 90 40 92 Q15 90 15 70 L20 30 Q25 12 40 12 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    ),
  },
  {
    id: 'heart',
    name: 'Coração',
    description: 'Testa larga, queixo fino',
    tip: 'Texturas na altura do queixo equilibram',
    svg: (
      <svg viewBox="0 0 80 100" className="w-16 h-20">
        <path
          d="M40 15 Q60 15 65 35 L62 55 Q58 75 40 92 Q22 75 18 55 L15 35 Q20 15 40 15 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    ),
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

        {/* Face Shape Guide Section */}
        <div className="mt-32 pt-16 border-t border-gold-500/10">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-6">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-gold-400 tracking-[0.3em] text-xs uppercase font-sans"
            >
              Guia de Formatos
            </motion.p>

            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl font-serif text-offwhite-100"
            >
              Descubra Seu Tipo de Rosto
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-offwhite-300 max-w-2xl mx-auto text-base leading-relaxed font-sans"
            >
              Cada formato facial possui características únicas que orientam a escolha do corte
              ideal. Conheça os principais tipos e suas recomendações.
            </motion.p>
          </div>

          {/* Face Shapes Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
            {faceShapes.map((shape, index) => (
              <motion.div
                key={shape.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group p-6 rounded-2xl border border-gold-500/10 bg-midnight-950/30 hover:border-gold-500/30 hover:bg-midnight-950/50 transition-all duration-500"
              >
                {/* SVG Icon */}
                <div className="flex justify-center mb-4 text-gold-400/60 group-hover:text-gold-400 transition-colors duration-500">
                  {shape.svg}
                </div>

                {/* Name */}
                <h4 className="text-lg font-serif text-offwhite-100 text-center mb-2 group-hover:text-white transition-colors">
                  {shape.name}
                </h4>

                {/* Description */}
                <p className="text-offwhite-300/80 text-xs text-center mb-3 font-sans">
                  {shape.description}
                </p>

                {/* Tip */}
                <p className="text-gold-400/80 text-xs text-center font-sans leading-relaxed group-hover:text-gold-300 transition-colors">
                  💡 {shape.tip}
                </p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-16 text-center"
          >
            <a
              href="#agendar"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gold-500 hover:bg-gold-400 text-midnight-950 font-sans font-semibold text-sm tracking-wide rounded-full transition-all duration-500 hover:shadow-lg hover:shadow-gold-500/20"
            >
              <span>Agende sua Análise Facial</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
