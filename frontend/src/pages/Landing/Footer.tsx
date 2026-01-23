import { Instagram } from 'lucide-react';
import type { StudioSettings } from '@/types/studio';

interface FooterProps {
  settings?: StudioSettings | null;
}

export function Footer({ settings }: FooterProps) {
  const hours = settings?.openingHours
    ? settings.openingHours.split('\n')
    : ['Terça a Sábado', '10:00 — 18:00'];

  return (
    <footer
      id="contato"
      className="scroll-snap-section bg-midnight-950 pt-24 pb-12 px-6 border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 md:gap-24">
        {/* Brand Column */}
        <div className="space-y-4">
          <h2 className="text-2xl font-serif text-white">{settings?.name || 'Júnior Lima'}</h2>
          <p className="text-xs text-gold-500 tracking-[0.2em] uppercase">Hair Artist</p>
        </div>

        {/* Info Columns */}
        <div className="flex flex-col md:flex-row gap-12 md:gap-24">
          {/* Address */}
          <div className="space-y-4">
            <h3 className="text-sm font-sans text-white/40 uppercase tracking-widest">Studio</h3>
            <p className="text-offwhite-300 font-serif text-lg leading-relaxed">
              {settings?.address || 'Rua Lotário Novaes, 273'}
              <br />
              {settings?.city || 'Campinas – SP'}
            </p>
          </div>

          {/* Hours */}
          <div className="space-y-4">
            <h3 className="text-sm font-sans text-white/40 uppercase tracking-widest">Horários</h3>
            <div className="text-offwhite-300 font-serif text-lg leading-relaxed">
              {hours.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h3 className="text-sm font-sans text-white/40 uppercase tracking-widest">Social</h3>
            {settings?.instagramUrl && (
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-offwhite-300 hover:text-gold-400 transition-colors group"
              >
                <span className="font-serif text-lg">Instagram</span>
                <Instagram
                  size={16}
                  className="opacity-0 group-hover:opacity-100 transition-opacity -ml-4 group-hover:ml-0 duration-300"
                />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Minimal Copyright */}
      <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] text-white/20 uppercase tracking-widest gap-4">
        <p>&copy; {new Date().getFullYear()} Júnior Lima Studio.</p>
        <p>All Rights Reserved.</p>
      </div>
    </footer>
  );
}
