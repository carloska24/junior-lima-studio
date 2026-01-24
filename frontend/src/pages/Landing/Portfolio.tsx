import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { apiFetch } from '@/services/api';
import { Instagram } from 'lucide-react';
import type { StudioSettings, PortfolioItem } from '@/types/studio';
import { ScrollArrow } from '@/components/ui/ScrollArrow';
import { PortfolioHighlights } from '@/components/portfolio/PortfolioHighlights';
import { StoryViewer } from '@/components/portfolio/StoryViewer';

interface PortfolioProps {
  settings?: StudioSettings | null;
}

interface CategoryGroup {
  name: string;
  coverImage: string;
  items: PortfolioItem[];
}

// Fallback items grouped for stories
const fallbackItems: PortfolioItem[] = [
  {
    id: '1',
    imageUrl:
      'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2670&auto=format&fit=crop',
    title: 'Fade Clássico',
    category: 'Corte',
  },
  {
    id: '2',
    imageUrl:
      'https://images.unsplash.com/photo-1599351431202-6e0c06e76cab?q=80&w=2670&auto=format&fit=crop',
    title: 'Barba Modelada',
    category: 'Barba',
  },
  {
    id: '3',
    imageUrl:
      'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=2670&auto=format&fit=crop',
    title: 'Acabamento Premium',
    category: 'Tratamento',
  },
  {
    id: '4',
    imageUrl:
      'https://images.unsplash.com/photo-1503951914875-befbb713d752?q=80&w=2668&auto=format&fit=crop',
    title: 'Executivo',
    category: 'Corte',
  },
  {
    id: '5',
    imageUrl:
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=2574&auto=format&fit=crop',
    title: 'Noiva Clássica',
    category: 'Noivas',
  },
  {
    id: '6',
    imageUrl:
      'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=2666&auto=format&fit=crop',
    title: 'Penteado Festa',
    category: 'Noivas',
  },
];

export function Portfolio({ settings }: PortfolioProps) {
  const [categories, setCategories] = useState<CategoryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const response = await apiFetch('/portfolio');
        let data: PortfolioItem[] = [];

        if (response.ok) {
          data = await response.json();
        }

        const itemsToUse = data.length > 0 ? data : fallbackItems;
        const grouped = groupItemsByCategory(itemsToUse);
        setCategories(grouped);
      } catch (error) {
        console.error('Erro ao carregar portfólio:', error);
        setCategories(groupItemsByCategory(fallbackItems));
      } finally {
        setLoading(false);
      }
    }
    fetchPortfolio();
  }, []);

  const instagramUrl = settings?.instagramUrl || 'https://instagram.com/juniorlima.hairartist';

  // Helper to group items
  const groupItemsByCategory = (items: PortfolioItem[]): CategoryGroup[] => {
    const groups: Record<string, PortfolioItem[]> = {};

    items.forEach(item => {
      const cat = item.category || 'Geral';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });

    return Object.entries(groups).map(([name, items]) => ({
      name,
      coverImage: items[0].imageUrl, // First image as cover
      items,
    }));
  };

  if (loading) {
    return (
      <section className="py-32 px-6 bg-midnight-950 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex justify-center gap-8 animate-pulse">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="w-24 h-24 rounded-full bg-midnight-800" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <>
      <section
        id="portfolio"
        className="py-24 md:py-32 px-0 md:px-6 bg-midnight-950 border-t border-white/5 relative"
      >
        {/* Section Header */}
        <div className="max-w-6xl mx-auto mb-16 space-y-6 text-center px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-serif text-offwhite-100"
          >
            Portfólio
          </motion.h2>
          <p className="text-gold-500 uppercase tracking-[0.2em] text-xs font-sans">
            Transformações Reais
          </p>
        </div>

        {/* Stories Highlights Wrapper */}
        <div className="max-w-7xl mx-auto">
          <PortfolioHighlights categories={categories} onSelectCategory={setActiveCategoryIndex} />
        </div>

        {/* Botão Instagram */}
        <div className="mt-16 text-center px-6">
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
            <Button
              variant="ghost"
              className="text-offwhite-300 hover:text-gold-400 text-xs uppercase tracking-widest hover:bg-transparent inline-flex items-center gap-3"
            >
              <Instagram size={18} />
              Ver Galeria Completa
            </Button>
          </a>
        </div>

        {/* Seta para próxima seção */}
        <ScrollArrow targetId="depoimentos" />
      </section>

      {/* Full Screen Story Viewer Overlay */}
      <AnimatePresence>
        {activeCategoryIndex !== null && categories[activeCategoryIndex] && (
          <StoryViewer
            stories={categories[activeCategoryIndex].items}
            onClose={() => setActiveCategoryIndex(null)}
            onNextCategory={() => {
              if (activeCategoryIndex < categories.length - 1) {
                setActiveCategoryIndex(prev => (prev !== null ? prev + 1 : null));
              } else {
                setActiveCategoryIndex(null);
              }
            }}
            onPrevCategory={() => {
              if (activeCategoryIndex > 0) {
                setActiveCategoryIndex(prev => (prev !== null ? prev - 1 : null));
              }
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
