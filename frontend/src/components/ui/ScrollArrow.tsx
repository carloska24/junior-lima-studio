import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface ScrollArrowProps {
  targetId?: string;
}

export function ScrollArrow({ targetId }: ScrollArrowProps) {
  const handleClick = () => {
    if (targetId) {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 p-4 min-w-[48px] min-h-[48px] flex items-center justify-center cursor-pointer"
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      aria-label="Rolar para próxima seção"
    >
      <ChevronDown className="w-8 h-8 text-gold-400 opacity-60 hover:opacity-100 transition-opacity" />
    </motion.button>
  );
}
