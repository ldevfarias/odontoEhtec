import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

// Exemplo de teste de componente React com Vitest + Testing Library.
// Substitua por componentes reais do painel do dentista conforme forem criados.

function Greeting({ name }: { name: string }) {
  return <h1>Olá, {name}</h1>;
}

describe('Greeting', () => {
  it('renders the user name', () => {
    render(<Greeting name="Dr. Silva" />);
    expect(screen.getByRole('heading', { name: /dr\. silva/i })).toBeInTheDocument();
  });
});
