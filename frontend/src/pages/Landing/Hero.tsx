import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import type { StudioSettings } from '@/types/studio';

interface HeroProps {
  settings?: StudioSettings | null;
}

export function Hero({ settings }: HeroProps) {
  const navigate = useNavigate();

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-midnight-900">
      {/* Background Ambience (Subtle Gradient/Overlay) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-midnight-800 via-midnight-900 to-black opacity-80" />

      {/* Content Container */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto space-y-8">
        {/* Animated Title */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="space-y-4"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-gold-500 tracking-[0.3em] text-sm uppercase font-sans"
          >
            Excelência em Visagismo
          </motion.p>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-gray-100 font-medium">
            {settings?.name || 'Júnior Lima'}
          </h1>

          <p className="font-sans text-gray-400 tracking-[0.2em] text-sm md:text-base uppercase">
            Hair Artist • {settings?.city.split('–')[0].trim() || 'Campinas'}
          </p>
        </motion.div>

        {/* Separator Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 1.5, ease: 'easeInOut' }}
          className="h-px w-24 bg-gold-500/50 mx-auto"
        />

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <Button
            variant="outline"
            className="mt-8 border-gold-500/60 text-gold-400 hover:text-midnight-900 hover:bg-gold-500 hover:border-gold-500"
            onClick={() => navigate('/login')}
          >
            Agendar Experiência
          </Button>
        </motion.div>
      </div>

      {/* Background Decorative Elements (Optional - can be replaced by real image later) */}
      <div className="absolute bottom-0 w-full h-32 bg-linear-to-t from-midnight-900 to-transparent pointer-events-none" />
    </section>
  );
}
