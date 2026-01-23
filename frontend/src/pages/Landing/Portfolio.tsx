import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { apiFetch } from '@/services/api';
import { Instagram } from 'lucide-react';
import type { StudioSettings } from '@/types/studio';

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description?: string;
}

interface PortfolioProps {
  settings?: StudioSettings | null;
}

// Fallback com imagens de alta qualidade (caso o banco esteja vazio)
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
];

export function Portfolio({ settings }: PortfolioProps) {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const response = await apiFetch('/portfolio');
        if (response.ok) {
          const data = await response.json();
          // Se não houver itens no banco, usa fallback
          setPortfolioItems(data.length > 0 ? data : fallbackItems);
        } else {
          setPortfolioItems(fallbackItems);
        }
      } catch (error) {
        console.error('Erro ao carregar portfólio:', error);
        setPortfolioItems(fallbackItems);
      } finally {
        setLoading(false);
      }
    }
    fetchPortfolio();
  }, []);

  const instagramUrl = settings?.instagramUrl || 'https://instagram.com/juniorlima.hairartist';

  if (loading) {
    return (
      <section className="py-32 px-6 bg-midnight-950 border-t border-white/5">
        <div className="max-w-6xl mx-auto mb-24 space-y-6 text-center">
          <div className="animate-pulse">
            <div className="h-12 bg-midnight-800 rounded w-1/4 mx-auto mb-8"></div>
            <div className="columns-1 md:columns-2 gap-12 space-y-12">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-80 bg-midnight-800 rounded mb-12"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="portfolio"
      className="scroll-snap-section py-32 px-6 bg-midnight-950 border-t border-white/5"
    >
      {/* Section Header */}
      <div className="max-w-6xl mx-auto mb-24 space-y-6 text-center">
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

      {/* Refined Masonry Grid */}
      <div className="max-w-7xl mx-auto columns-1 md:columns-2 gap-12 space-y-12">
        {portfolioItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.8 }}
            className={cn('break-inside-avoid relative group cursor-pointer mb-12')}
          >
            {/* Image Container */}
            <div className="relative overflow-hidden w-full bg-midnight-900">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-auto object-cover transition-all duration-1000 group-hover:scale-105 opacity-90"
                loading="lazy"
                onError={e => {
                  // Fallback se a imagem falhar
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=800&auto=format&fit=crop';
                }}
              />

              {/* Minimalist Overlay - Bottom */}
              <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-midnight-950 via-midnight-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="block text-gold-500 text-xs uppercase tracking-widest mb-1">
                  {item.category}
                </span>
                <h3 className="text-xl font-serif text-offwhite-100">{item.title}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Botão Instagram - Funcional */}
      <div className="mt-24 text-center">
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
    </section>
  );
}
