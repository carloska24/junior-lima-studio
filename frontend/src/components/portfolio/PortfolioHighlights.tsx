import { motion } from 'framer-motion';
import type { PortfolioItem } from '@/types/studio';

interface PortfolioHighlightsProps {
  categories: { name: string; coverImage: string; items: PortfolioItem[] }[];
  onSelectCategory: (categoryIndex: number) => void;
}

export function PortfolioHighlights({ categories, onSelectCategory }: PortfolioHighlightsProps) {
  return (
    <div className="w-full overflow-x-auto pb-8 hide-scrollbar cursor-grab active:cursor-grabbing">
      <div className="flex gap-6 md:gap-10 px-4 md:px-0 justify-start md:justify-center min-w-max">
        {categories.map((category, index) => (
          <motion.button
            key={category.name}
            onClick={() => onSelectCategory(index)}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center gap-3 group"
          >
            {/* Circle Wrapper with Gradient Border */}
            <div className="relative p-[3px] rounded-full bg-linear-to-tr from-gold-600 via-gold-400 to-gold-200 group-hover:scale-105 transition-transform duration-300 transform-gpu backface-hidden">
              {/* Black spacing between border and image */}
              <div className="bg-midnight-950 p-[2px] rounded-full overflow-hidden backface-hidden transform-gpu">
                {/* Image Container - with transparent border hack for antialiasing */}
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-midnight-800 border-2 border-transparent transform-gpu backface-hidden">
                  <img
                    src={category.coverImage}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 backface-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Label */}
            <span className="text-xs md:text-sm font-sans tracking-widest uppercase text-offwhite-200 group-hover:text-gold-400 transition-colors">
              {category.name}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
