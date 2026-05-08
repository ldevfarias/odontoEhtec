import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OdontoEhTec',
  description: 'O SaaS odontológico que facilita a vida do dentista.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
