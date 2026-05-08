'use client';

import React from 'react';
import { Card } from './Card';
import { KPI } from './KPI';
import { Button } from './Button';

interface DashboardProps {
  userName?: string;
  date?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({
  userName = 'Renan',
  date = 'Quinta · 8 de maio',
}) => {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <p className="oet-caption" style={{ marginBottom: '8px' }}>
          {date}
        </p>
        <h1 className="oet-h1">Bom dia, {userName}.</h1>
      </div>

      {/* KPI Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '40px',
        }}
      >
        <KPI label="Receita (mês)" value="R$ 38,4k" delta={{ direction: 'up', value: '12%' }} />
        <KPI label="Agendamentos" value="147" delta={{ direction: 'up', value: '8' }} />
        <KPI label="Pacientes" value="1.284" delta={{ direction: 'up', value: '23' }} />
        <KPI label="Taxa ocupação" value="84%" delta={{ direction: 'down', value: '2%' }} />
      </div>

      {/* Charts & Details Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '24px',
          marginBottom: '40px',
        }}
      >
        {/* Revenue Chart */}
        <Card>
          <div style={{ marginBottom: '20px' }}>
            <h2 className="oet-h3">Receita (últimos 6 meses)</h2>
          </div>
          <svg viewBox="0 0 400 200" style={{ width: '100%', height: '200px' }}>
            {/* Simple chart visualization */}
            <path
              d="M20 180 L80 120 L140 140 L200 80 L260 100 L320 40 L380 60"
              stroke="var(--oet-primary-700)"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M20 180 L80 120 L140 140 L200 80 L260 100 L320 40 L380 60 L380 200 L20 200"
              fill="url(#gradient)"
              opacity="0.1"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--oet-primary-700)" stopOpacity="0.2" />
                <stop offset="100%" stopColor="var(--oet-primary-700)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <text x="20" y="20" fontSize="12" fill="var(--fg-3)" textAnchor="start">
              Jan
            </text>
            <text x="80" y="20" fontSize="12" fill="var(--fg-3)" textAnchor="start">
              Fev
            </text>
            <text x="140" y="20" fontSize="12" fill="var(--fg-3)" textAnchor="start">
              Mar
            </text>
            <text x="200" y="20" fontSize="12" fill="var(--fg-3)" textAnchor="start">
              Abr
            </text>
            <text x="260" y="20" fontSize="12" fill="var(--fg-3)" textAnchor="start">
              Mai
            </text>
            <text x="320" y="20" fontSize="12" fill="var(--fg-3)" textAnchor="start">
              Jun
            </text>
          </svg>
        </Card>

        {/* Upcoming */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {/* Próxima Consulta */}
          <Card>
            <p className="oet-caption" style={{ marginBottom: '8px' }}>
              Próxima consulta
            </p>
            <h3 className="oet-h4" style={{ marginBottom: '12px' }}>
              Ana Silva
            </h3>
            <p className="oet-body-sm" style={{ marginBottom: '12px' }}>
              10:30 • Sala 1 • Limpeza
            </p>
            <Button variant="ghost" fullWidth style={{ fontSize: '13px' }}>
              Ver agenda
            </Button>
          </Card>

          {/* Aniversariantes */}
          <Card>
            <p className="oet-caption" style={{ marginBottom: '12px' }}>
              Aniversariantes esta semana
            </p>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <p className="oet-body-sm">🎂 Carlos Mendes</p>
              <p className="oet-body-sm">🎂 Juliana Costa</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Appointments this week */}
      <Card>
        <div style={{ marginBottom: '20px' }}>
          <h2 className="oet-h3">Agendamentos esta semana</h2>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '12px',
          }}
        >
          {['Seg', 'Ter', 'Qua', 'Qui', 'Sex'].map((day) => (
            <div
              key={day}
              style={{
                padding: '16px',
                background: 'var(--oet-primary-100)',
                borderRadius: '12px',
                textAlign: 'center',
              }}
            >
              <p className="oet-caption" style={{ marginBottom: '8px' }}>
                {day}
              </p>
              <p
                style={{
                  fontSize: '24px',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 400,
                }}
              >
                28
              </p>
              <p className="oet-caption">agendamentos</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
