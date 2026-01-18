import React from 'react';
import { Instagram, MapPin, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Footer() {
  return (
    <footer className="bg-midnight-950 border-t border-midnight-800 pt-20 pb-10 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        {/* Brand */}
        <div className="space-y-6 md:col-span-2">
          <div>
            <h2 className="text-3xl font-serif text-gold-500">Júnior Lima</h2>
            <p className="text-gray-500 text-sm tracking-widest uppercase mt-1">Hair Artist</p>
          </div>
          <p className="text-gray-400 max-w-sm leading-relaxed">
            Elevando a barbearia clássica a um nível artístico. Uma experiência de cuidado pessoal,
            técnica precisa e ambiente exclusivo.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="p-2 bg-midnight-800 text-gold-500 rounded-sm hover:bg-gold-500 hover:text-midnight-900 transition-colors"
              aria-label="Visite nosso Instagram"
            >
              <Instagram size={20} aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-white">Localização</h3>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li className="flex gap-3 items-start">
              <MapPin className="text-gold-500 shrink-0 mt-1" size={18} />
              <span>
                Rua Coronel Quirino, 123
                <br />
                Cambuí, Campinas - SP
              </span>
            </li>
            <li className="flex gap-3 items-center">
              <Phone className="text-gold-500 shrink-0" size={18} />
              <span>(19) 99999-9999</span>
            </li>
          </ul>
        </div>

        {/* Hours */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-white">Horários</h3>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li className="flex gap-3 items-center">
              <Clock className="text-gold-500 shrink-0" size={18} />
              <div>
                <p>Terça a Sexta: 09h - 20h</p>
                <p>Sábado: 09h - 18h</p>
              </div>
            </li>
          </ul>
          <Button
            variant="outline"
            className="w-full text-xs py-3 border-gray-700 text-gray-300 hover:border-gold-500 hover:text-gold-500"
          >
            Agendar Agora
          </Button>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-midnight-800 pt-8 text-center text-gray-600 text-xs uppercase tracking-wider">
        <p>&copy; {new Date().getFullYear()} Júnior Lima Studio. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
