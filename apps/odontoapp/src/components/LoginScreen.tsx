'use client';

import React, { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';

interface LoginScreenProps {
  onSubmit?: () => void;
  isMobile?: boolean;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSubmit, isMobile = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onSubmit?.();
    }, 600);
  };

  if (isMobile) {
    return (
      <div className="flex flex-col h-full bg-canvas">
        {/* Mobile Header */}
        <div className="px-5 py-6 border-b border-border-soft">
          <h1 className="oet-h2">OdontoEhTec</h1>
          <p className="oet-body-sm text-ink-3">Acesse sua conta</p>
        </div>

        {/* Form */}
        <div className="flex-1 px-5 py-8 overflow-y-auto">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="E-mail ou CPF"
              type="email"
              placeholder="seu@email.com.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
            />
            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="cursor-pointer"
              />
              <span>Lembrar neste dispositivo</span>
            </label>
            <Button type="submit" isLoading={isLoading} fullWidth className="mt-3">
              Entrar
            </Button>
            <div className="text-center mt-5">
              <a href="#" className="text-primary-700 no-underline text-sm font-semibold">
                Esqueceu sua senha?
              </a>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-5 py-5 border-t border-border-soft text-center text-xs text-ink-3">
          <p>
            Não tem uma conta?{' '}
            <a href="#" className="text-primary-700 no-underline">
              Cadastre-se
            </a>
          </p>
          <p className="mt-2 text-[11px]">Conformidade LGPD e regulamentação do CFO</p>
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="flex min-h-screen bg-canvas">
      {/* Left Panel — Hero */}
      <div
        className="flex-1 flex flex-col justify-between px-12 py-16 min-h-screen text-fg-on-primary"
        style={{
          background:
            'linear-gradient(135deg, var(--color-primary-700) 0%, var(--color-primary-800) 100%)',
        }}
      >
        <div>
          <h1 className="oet-display-lg text-fg-on-primary mb-5">
            Cuidar da clínica é cuidar do sorriso de cada paciente.
          </h1>
          <p className="oet-body-lg" style={{ color: 'rgba(255, 252, 245, 0.85)' }}>
            Agendamento inteligente, prontuário integrado e relatórios que fazem você crescer.
          </p>
        </div>

        {/* Social Proof Stats */}
        <div className="grid grid-cols-2 gap-10">
          <div>
            <div
              className="font-display font-normal text-accent-500 mb-2"
              style={{ fontSize: '64px' }}
            >
              500+
            </div>
            <p className="oet-body-sm" style={{ color: 'rgba(255, 252, 245, 0.7)' }}>
              Clínicas confiam em nós
            </p>
          </div>
          <div>
            <div
              className="font-display font-normal text-accent-500 mb-2"
              style={{ fontSize: '64px' }}
            >
              98%
            </div>
            <p className="oet-body-sm" style={{ color: 'rgba(255, 252, 245, 0.7)' }}>
              Satisfação dos usuários
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs" style={{ color: 'rgba(255, 252, 245, 0.6)' }}>
          <p className="mb-2">Conformidade com LGPD e CFO</p>
          <p>© 2026 OdontoEhTec. Todos os direitos reservados.</p>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-12 py-16">
        <div className="w-full max-w-[400px]">
          <h2 className="oet-h1 mb-2">Bem-vindo</h2>
          <p className="oet-body text-ink-2 mb-10">
            Entre com suas credenciais para acessar seu painel
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Input
              label="E-mail ou CPF"
              type="email"
              placeholder="seu@email.com.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
            />
            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="cursor-pointer"
              />
              <span>Lembrar neste dispositivo</span>
            </label>
            <Button type="submit" isLoading={isLoading} fullWidth className="mt-3">
              Entrar
            </Button>
          </form>

          <div className="mt-8 text-center">
            <a href="#" className="block mb-4 text-primary-700 no-underline text-sm font-semibold">
              Esqueceu sua senha?
            </a>
            <p className="oet-body-sm">
              Não tem uma conta?{' '}
              <a href="#" className="text-primary-700 no-underline font-semibold">
                Cadastre-se
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
