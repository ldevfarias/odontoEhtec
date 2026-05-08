'use client';

import { LandingHero } from '@/components/LandingHero';
import { LandingFeatures } from '@/components/LandingFeatures';
import { LandingSocialProof } from '@/components/LandingSocialProof';
import { LandingPricing } from '@/components/LandingPricing';

export default function LandingPage() {
  return (
    <div className="bg-canvas">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-10 py-5 border-b border-border-soft bg-surface-1">
        <div className="text-2xl font-bold text-primary-700">OdontoEhTec</div>
        <div className="flex gap-8 items-center">
          <a href="#features" className="text-ink-2 no-underline">
            Recursos
          </a>
          <a href="#pricing" className="text-ink-2 no-underline">
            Preços
          </a>
          <a href="#contact" className="text-ink-2 no-underline">
            Contato
          </a>
          <a
            href="/dashboard"
            className="px-5 py-2.5 bg-primary-700 text-fg-on-primary no-underline font-semibold rounded-sm"
          >
            Entrar
          </a>
        </div>
      </nav>

      <LandingHero />
      <LandingFeatures />
      <LandingSocialProof />
      <LandingPricing />

      {/* CTA */}
      <section
        id="contact"
        className="px-10 py-24 text-center text-white"
        style={{
          background:
            'linear-gradient(135deg, var(--color-primary-700) 0%, var(--color-primary-800) 100%)',
        }}
      >
        <h2 className="oet-h1 text-white mb-5">Pronto para transformar sua clínica?</h2>
        <p className="mb-10 text-lg opacity-90">
          Junte-se a centenas de dentistas que já confiam em OdontoEhTec
        </p>
        <a
          href="/dashboard"
          className="inline-block px-10 py-4 bg-accent-500 text-fg-on-accent no-underline font-semibold rounded-xl text-base"
        >
          Comece sua avaliação gratuita
        </a>
      </section>

      {/* Footer */}
      <footer className="px-10 py-10 border-t border-border-soft bg-surface-1 text-center text-ink-3">
        <p>© 2026 OdontoEhTec. Todos os direitos reservados.</p>
        <p className="mt-3 text-xs">Conformidade com LGPD e regulamentação do CFO</p>
      </footer>
    </div>
  );
}
