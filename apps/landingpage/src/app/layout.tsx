import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'OdontoEhTec — Gestão de Clínicas Odontológicas',
  description:
    'O SaaS odontológico que facilita a vida do dentista. Agendamento, prontuário, faturamento e relatórios em um único lugar.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="m-0 p-0">{children}</body>
    </html>
  );
}
