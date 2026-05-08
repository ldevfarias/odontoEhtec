import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OdontoEhTec — Painel',
  description: 'Painel de gestão para dentistas e clínicas odontológicas.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
