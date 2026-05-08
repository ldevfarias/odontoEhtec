'use client';

export const LandingSocialProof = () => (
  <section className="px-10 py-16 bg-primary-700 text-white text-center">
    <h2 className="oet-h2 text-white mb-12">Confiado por centenas de clínicas</h2>
    <div
      className="grid gap-10"
      style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}
    >
      <div>
        <div className="text-5xl font-bold mb-2">500+</div>
        <p>Clínicas ativas</p>
      </div>
      <div>
        <div className="text-5xl font-bold mb-2">98%</div>
        <p>Satisfação de usuários</p>
      </div>
      <div>
        <div className="text-5xl font-bold mb-2">2M+</div>
        <p>Consultas agendadas</p>
      </div>
    </div>
  </section>
);
