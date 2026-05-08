import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'OdontoEhTec — Painel',
  description: 'Painel de gestão para dentistas e clínicas odontológicas.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="m-0 p-0">{children}</body>
    </html>
  );
}
