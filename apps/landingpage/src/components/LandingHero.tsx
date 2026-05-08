'use client';

export const LandingHero = () => (
  <section
    className="px-10 py-24 text-center"
    style={{
      background:
        'linear-gradient(135deg, rgba(14, 79, 74, 0.05) 0%, rgba(217, 168, 108, 0.05) 100%)',
    }}
  >
    <h1 className="oet-display-xl mb-5">Cuidar da clínica é cuidar do sorriso de cada paciente</h1>
    <p className="oet-body-lg text-ink-2 max-w-150 mx-auto mb-10">
      Agendamento inteligente, prontuário integrado, faturamento simplificado e relatórios que fazem
      você crescer.
    </p>
    <div className="flex gap-4 justify-center">
      <a
        href="/dashboard"
        className="inline-block px-8 py-4 bg-primary-700 text-fg-on-primary no-underline font-semibold rounded-xl"
      >
        Comece agora
      </a>
      <a
        href="#features"
        className="inline-block px-8 py-4 bg-surface-1 text-ink-1 no-underline font-semibold rounded-xl border border-border-firm"
      >
        Saiba mais
      </a>
    </div>
  </section>
);
