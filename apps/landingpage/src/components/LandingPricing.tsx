'use client';

const PLANS = [
  {
    name: 'Iniciante',
    price: 'R$ 99',
    period: '/mês',
    features: ['Até 5 salas', 'Agendamento básico', 'Prontuário eletrônico', 'Suporte por email'],
  },
  {
    name: 'Profissional',
    price: 'R$ 299',
    period: '/mês',
    featured: true,
    features: [
      'Salas ilimitadas',
      'Agendamento inteligente',
      'Prontuário completo',
      'Faturamento integrado',
      'Relatórios avançados',
      'Suporte prioritário',
    ],
  },
  {
    name: 'Empresa',
    price: 'Personalizado',
    period: '',
    features: [
      'Tudo do plano Profissional',
      'API custom',
      'Suporte dedicado',
      'Treinamento em grupo',
    ],
  },
];

export const LandingPricing = () => (
  <section id="pricing" className="px-10 py-24 max-w-300 mx-auto">
    <h2 className="oet-h1 text-center mb-16">Planos simples e transparentes</h2>
    <div
      className="grid gap-8 items-center"
      style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}
    >
      {PLANS.map((plan, idx) => (
        <div
          key={idx}
          className={[
            'relative p-10 rounded-xl',
            plan.featured
              ? 'bg-primary-700 text-white scale-105'
              : 'bg-surface-1 text-ink-1 border border-border-soft',
          ].join(' ')}
        >
          {plan.featured && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-500 text-fg-on-accent px-4 py-1.5 rounded-pill text-xs font-semibold">
              MAIS POPULAR
            </div>
          )}
          <h3 className="text-2xl font-bold mb-3">{plan.name}</h3>
          <div className="mb-6">
            <span className="text-5xl font-bold">{plan.price}</span>
            <span className="opacity-80">{plan.period}</span>
          </div>
          <ul className="list-none p-0 mb-8">
            {plan.features.map((feature, i) => (
              <li
                key={i}
                className="py-3"
                style={{
                  borderBottom: `1px solid ${plan.featured ? 'rgba(255,255,255,0.1)' : 'var(--color-border-soft)'}`,
                }}
              >
                ✓ {feature}
              </li>
            ))}
          </ul>
          <button
            className={[
              'w-full py-3 px-6 rounded-md border-none font-semibold cursor-pointer',
              plan.featured
                ? 'bg-accent-500 text-fg-on-accent'
                : 'bg-primary-700 text-fg-on-primary',
            ].join(' ')}
          >
            Começar
          </button>
        </div>
      ))}
    </div>
  </section>
);
