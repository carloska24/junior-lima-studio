import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArrow } from '@/components/ui/ScrollArrow';

const testimonials = [
  {
    id: 1,
    name: 'Ricardo Almeida',
    role: 'Empresário',
    text: 'O Júnior não apenas corta o cabelo, ele constrói uma imagem. O atendimento é impecável do início ao fim.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Felipe Andreoli',
    role: 'Jornalista',
    text: 'Técnica apurada e um ambiente que te faz esquecer da correria do dia a dia. A experiência é relaxante.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Carlos Matos',
    role: 'Advogado',
    text: 'Encontrar um profissional que entende de visagismo mudou minha autoconfiança.',
    rating: 5,
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % testimonials.length);
    }, 6000); // 6s duration for slower pace
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="depoimentos"
      className="py-32 px-6 bg-midnight-950/50 flex flex-col items-center justify-center min-h-[60vh] relative"
    >
      <div className="max-w-3xl w-full text-center relative z-10">
        {/* Minimalist Decoration */}
        <div className="w-px h-12 bg-white/10 mx-auto mb-12" />

        <div className="h-48 relative flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="absolute inset-x-0"
            >
              <p className="text-2xl md:text-3xl font-serif text-offwhite-100 italic leading-relaxed mb-8 font-light">
                "{testimonials[currentIndex].text}"
              </p>

              <div className="space-y-1">
                <p className="text-sm font-sans tracking-widest text-white uppercase">
                  {testimonials[currentIndex].name}
                </p>
                <p className="text-xs font-sans tracking-widest text-gold-500/60 uppercase">
                  {testimonials[currentIndex].role}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Minimalist Indicators */}
        <div className="flex justify-center gap-4 mt-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all duration-500 rounded-full ${
                index === currentIndex
                  ? 'w-2 h-2 bg-gold-500'
                  : 'w-1 b-1 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Seta para próxima seção */}
      <ScrollArrow targetId="contato" />
    </section>
  );
}
