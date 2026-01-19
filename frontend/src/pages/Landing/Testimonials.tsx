import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Ricardo Almeida',
    role: 'Empresário',
    text: 'O Júnior não apenas corta o cabelo, ele constrói uma imagem. O atendimento é impecável do início ao fim. Há anos não troco de profissional.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Felipe Andreoli',
    role: 'Jornalista',
    text: 'Técnica apurada e um ambiente que te faz esquecer da correria do dia a dia. A experiência é relaxante e o resultado é sempre acima da expectativa.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Carlos Matos',
    role: 'Advogado',
    text: 'Encontrar um profissional que entende de visagismo mudou minha autoconfiança. O corte dura muito mais e reflete exatamente o que preciso passar profissionalmente.',
    rating: 5,
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, testimonials.length]);

  return (
    <section
      className="py-24 px-6 bg-midnight-900 overflow-hidden relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Depoimentos de Clientes"
    >
      <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
        <div className="flex justify-center text-gold-500/20">
          <Quote size={64} fill="currentColor" aria-hidden="true" />
        </div>

        <div className="h-64 relative flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.figure
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-x-0"
            >
              <blockquote className="text-xl md:text-3xl font-serif text-gray-200 italic leading-relaxed mb-8">
                "{testimonials[currentIndex].text}"
              </blockquote>

              <figcaption className="flex flex-col items-center gap-2">
                <div
                  className="flex gap-1 text-gold-500 mb-2"
                  aria-label={`Avaliação de ${testimonials[currentIndex].rating} estrelas`}
                >
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" aria-hidden="true" />
                  ))}
                </div>
                <cite className="text-lg font-medium text-white not-italic">
                  {testimonials[currentIndex].name}
                </cite>
                <span className="text-gold-500/60 text-sm uppercase tracking-wider">
                  {testimonials[currentIndex].role}
                </span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        {/* Indicators */}
        <div
          className="flex justify-center gap-3"
          role="tablist"
          aria-label="Controles do carrossel"
        >
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1 duration-300 transition-all ${
                index === currentIndex ? 'w-8 bg-gold-500' : 'w-2 bg-gray-700'
              }`}
              aria-label={`Ir para depoimento ${index + 1}`}
              aria-selected={index === currentIndex}
              role="tab"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
