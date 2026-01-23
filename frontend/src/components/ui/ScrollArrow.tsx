import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface ScrollArrowProps {
  targetId?: string;
}

export function ScrollArrow({ targetId }: ScrollArrowProps) {
  const handleClick = () => {
    if (targetId) {
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      type="button"
      className="absolute bottom-6 left-1/2 -translate-x-1/2 p-3 min-w-[48px] min-h-[48px] flex items-center justify-center cursor-pointer z-20 bg-midnight-950/50 rounded-full backdrop-blur-sm"
      animate={{ y: [0, 8, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      aria-label="Rolar para próxima seção"
    >
      <ChevronDown className="w-6 h-6 text-gold-400 opacity-70 hover:opacity-100 transition-opacity" />
    </motion.button>
  );
}
