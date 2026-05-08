import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

// Exemplo de teste de componente React com Vitest + Testing Library.
// Substitua por componentes reais da landing page conforme forem criados.

function Hero({ tagline }: { tagline: string }) {
  return (
    <section>
      <p>{tagline}</p>
    </section>
  );
}

describe('Hero', () => {
  it('renders the tagline', () => {
    render(<Hero tagline="Gestão odontológica simplificada" />);
    expect(screen.getByText(/gestão odontológica simplificada/i)).toBeInTheDocument();
  });
});
