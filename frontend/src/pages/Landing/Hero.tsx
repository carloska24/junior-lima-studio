import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import type { StudioSettings } from '@/types/studio';

interface HeroProps {
  settings?: StudioSettings | null;
}

export function Hero({ settings }: HeroProps) {
  // Formata o número de WhatsApp para link (remove caracteres especiais)
  const formatWhatsAppLink = () => {
    const whatsapp = settings?.whatsapp || settings?.phone || '5519990681759';
    const cleanNumber = whatsapp.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Olá! Gostaria de agendar um horário no ${settings?.name || 'Júnior Lima Studio'}. 🪒✨`
    );
    return `https://wa.me/${cleanNumber}?text=${message}`;
  };

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-midnight-950">
      {/* Background Ambience - Deep Midnight to Black */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-midnight-900 via-midnight-950 to-black opacity-90" />

      {/* Content Container - Editorial Layout */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center justify-center h-full">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="space-y-10 flex flex-col items-center"
        >
          {/* Line 1: Microtext */}
          <p className="text-gold-400 tracking-[0.4em] text-xs md:text-sm uppercase font-sans font-medium">
            Excelência em Visagismo
          </p>

          {/* Line 2: Headline */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-offwhite-100 font-normal leading-tight tracking-tight">
            {settings?.name || 'Júnior Lima'}
          </h1>

          {/* Line 3: Subheadline */}
          <div className="flex items-center gap-4 text-offwhite-300 font-sans tracking-[0.2em] text-sm md:text-base uppercase">
            <span>Hair Artist</span>
            <span className="text-gold-500">•</span>
            <span>{settings?.city?.split('–')[0].trim() || 'Campinas'}</span>
          </div>

          {/* Spacer */}
          <div className="h-4" />

          {/* CTA - WhatsApp */}
          <div className="pt-8">
            <a href={formatWhatsAppLink()} target="_blank" rel="noopener noreferrer">
              <Button className="bg-transparent border border-gold-500/30 text-gold-400 hover:bg-gold-500/5 hover:text-gold-300 hover:border-gold-400/60 px-10 py-6 text-sm tracking-[0.2em] uppercase transition-all duration-700 ease-out rounded-none">
                Agendar Experiência
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
