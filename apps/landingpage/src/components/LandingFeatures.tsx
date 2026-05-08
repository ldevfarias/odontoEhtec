'use client';

const FEATURES = [
  {
    icon: '📅',
    title: 'Agendamento Inteligente',
    description:
      'Gerencie toda sua agenda com sincronização em tempo real e lembretes automáticos.',
  },
  {
    icon: '📋',
    title: 'Prontuário Eletrônico',
    description: 'Acesso rápido ao histórico de cada paciente com odontograma integrado.',
  },
  {
    icon: '💰',
    title: 'Faturamento Simplificado',
    description: 'Integração com múltiplos métodos de pagamento e controle financeiro.',
  },
  {
    icon: '📊',
    title: 'Relatórios Detalhados',
    description: 'Análise completa de receita, agendamentos e performance da clínica.',
  },
  {
    icon: '📱',
    title: 'Acesso em qualquer lugar',
    description: 'Painel responsivo que funciona em desktop, tablet e mobile.',
  },
  {
    icon: '🔒',
    title: 'Segurança LGPD',
    description: 'Conformidade com regulamentações de proteção de dados e CFO.',
  },
];

export const LandingFeatures = () => (
  <section id="features" className="px-10 py-24 max-w-300 mx-auto">
    <h2 className="oet-h1 text-center mb-16">Recursos poderosos para sua clínica</h2>
    <div
      className="grid gap-8"
      style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}
    >
      {FEATURES.map((feature, idx) => (
        <div key={idx} className="p-8 border border-border-soft rounded-xl bg-surface-1">
          <div className="text-5xl mb-4">{feature.icon}</div>
          <h3 className="oet-h3 mb-3">{feature.title}</h3>
          <p className="oet-body text-ink-2">{feature.description}</p>
        </div>
      ))}
    </div>
  </section>
);
