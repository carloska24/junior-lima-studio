import { motion } from 'framer-motion';

export function Manifesto() {
  return (
    <section className="py-32 bg-midnight-950 flex justify-center items-center px-6">
      <div className="max-w-3xl w-full text-center space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Decorative Divider */}
          <div className="w-px h-16 bg-linear-to-b from-transparent via-gold-500/50 to-transparent mx-auto" />

          {/* Text Content */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif leading-relaxed text-offwhite-200">
            <span className="block mb-2">Cada corte carrega intenção.</span>
            <span className="block mb-2 opacity-80">Cada detalhe comunica presença.</span>
            <span className="block text-gold-300 mt-6">
              Aqui, visagismo não é técnica
              <br />
              <span className="italic font-light">— é linguagem.</span>
            </span>
          </h2>

          {/* Decorative Divider */}
          <div className="w-px h-16 bg-linear-to-b from-gold-500/50 via-gold-500/50 to-transparent mx-auto" />
        </motion.div>
      </div>
    </section>
  );
}
