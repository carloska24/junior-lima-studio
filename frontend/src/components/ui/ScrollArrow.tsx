import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface ScrollArrowProps {
  targetId?: string;
}

export function ScrollArrow({ targetId }: ScrollArrowProps) {
  const handleClick = () => {
    if (targetId) {
      const target = document.getElementById(targetId);
      const container = document.querySelector('.scroll-snap-container');

      if (target && container) {
        // Calcular posição do target dentro do container
        const targetRect = target.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const scrollTop = container.scrollTop + targetRect.top - containerRect.top;

        container.scrollTo({
          top: scrollTop,
          behavior: 'smooth',
        });
      } else if (target) {
        // Fallback se não houver container
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      type="button"
      className="absolute bottom-8 left-1/2 -translate-x-1/2 p-4 min-w-[48px] min-h-[48px] flex items-center justify-center cursor-pointer z-20"
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      aria-label="Rolar para próxima seção"
    >
      <ChevronDown className="w-8 h-8 text-gold-400 opacity-60 hover:opacity-100 transition-opacity" />
    </motion.button>
  );
}
