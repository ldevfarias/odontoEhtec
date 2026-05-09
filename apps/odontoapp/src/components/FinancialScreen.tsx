'use client';

import React from 'react';
import { Card } from './Card';
import { KPI } from './KPI';

const SOFT_BORDER = '1px solid var(--oet-border-soft)';

export const FinancialScreen: React.FC = () => {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <p className="oet-caption" style={{ marginBottom: '8px' }}>
          Maio · 2026
        </p>
        <h1 className="oet-h1">Financeiro</h1>
      </div>

      {/* KPI Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '40px',
        }}
      >
        <KPI label="Recebido (mês)" value="R$ 38,4k" delta={{ direction: 'up', value: '12%' }} />
        <KPI label="A receber" value="R$ 9,2k" delta={{ direction: 'down', value: 'R$ 1,1k' }} />
        <KPI label="Pendente" value="R$ 2,8k" delta={{ direction: 'down', value: '5%' }} />
        <KPI label="Ticket médio" value="R$ 580" delta={{ direction: 'up', value: '8%' }} />
      </div>

      {/* Charts & Details */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '24px',
          marginBottom: '40px',
        }}
      >
        {/* Transactions */}
        <Card>
          <div style={{ marginBottom: '20px' }}>
            <h2 className="oet-h3">Últimos pagamentos</h2>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0',
            }}
          >
            {[
              {
                name: 'Camila Aparecida',
                method: 'pix · limpeza',
                amount: 'R$ 220',
                status: 'success',
                date: 'Hoje',
              },
              {
                name: 'Renato de Souza',
                method: 'cartão · canal 1ª sessão',
                amount: 'R$ 480',
                status: 'success',
                date: 'Ontem',
              },
              {
                name: 'Marcos Tavares',
                method: 'boleto · retorno',
                amount: 'R$ 180',
                status: 'warning',
                date: '2 dias atrás',
              },
              {
                name: 'Lucia Andrade',
                method: 'convênio · prótese',
                amount: 'R$ 1.240',
                status: 'danger',
                date: '5 dias atrás',
              },
            ].map((transaction, idx) => (
              <div
                key={idx}
                style={{
                  padding: '16px 0',
                  borderBottom: idx !== 3 ? SOFT_BORDER : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <p className="oet-body-sm" style={{ fontWeight: 600 }}>
                    {transaction.name}
                  </p>
                  <p className="oet-caption">{transaction.method}</p>
                  <p className="oet-caption" style={{ marginTop: '4px' }}>
                    {transaction.date}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p
                    className="oet-body-sm"
                    style={{
                      fontWeight: 600,
                      color: 'var(--fg-1)',
                      marginBottom: '4px',
                    }}
                  >
                    {transaction.amount}
                  </p>
                  <p
                    className="oet-caption"
                    style={{
                      color:
                        transaction.status === 'success'
                          ? 'var(--oet-success-500)'
                          : transaction.status === 'warning'
                            ? 'var(--oet-warning-500)'
                            : 'var(--oet-danger-500)',
                    }}
                  >
                    {transaction.status === 'success'
                      ? '✓ Pago'
                      : transaction.status === 'warning'
                        ? '◐ Parcial'
                        : '⚠ Vencido'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Payment Methods */}
        <Card>
          <div style={{ marginBottom: '20px' }}>
            <h2 className="oet-h3">Métodos de pagamento</h2>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {[
              { method: 'Pix', amount: 'R$ 18,2k', percentage: 47 },
              { method: 'Cartão', amount: 'R$ 12,8k', percentage: 33 },
              { method: 'Boleto', amount: 'R$ 5,4k', percentage: 14 },
              { method: 'Convênio', amount: 'R$ 2,0k', percentage: 6 },
            ].map((item) => (
              <div key={item.method}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '6px',
                  }}
                >
                  <p className="oet-body-sm" style={{ fontWeight: 600 }}>
                    {item.method}
                  </p>
                  <p className="oet-caption" style={{ color: 'var(--oet-primary-700)' }}>
                    {item.percentage}%
                  </p>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '8px',
                    background: 'var(--oet-mist)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      background: 'var(--oet-primary-700)',
                      width: `${item.percentage}%`,
                    }}
                  />
                </div>
                <p className="oet-caption" style={{ marginTop: '4px' }}>
                  {item.amount}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Insights */}
      <Card>
        <h3 className="oet-h4" style={{ marginBottom: '16px' }}>
          Insights
        </h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li style={{ padding: '12px 0', borderBottom: SOFT_BORDER }}>
            <p className="oet-body-sm" style={{ marginBottom: '4px' }}>
              💡 Pix é seu método mais popular
            </p>
            <p className="oet-caption">47% das transações usam Pix</p>
          </li>
          <li style={{ padding: '12px 0', borderBottom: SOFT_BORDER }}>
            <p className="oet-body-sm" style={{ marginBottom: '4px' }}>
              ⚠️ 3 cobranças vencidas
            </p>
            <p className="oet-caption">Valor total: R$ 2.800</p>
          </li>
          <li style={{ padding: '12px 0' }}>
            <p className="oet-body-sm" style={{ marginBottom: '4px' }}>
              📈 Receita acima da média
            </p>
            <p className="oet-caption">+12% comparado ao mês anterior</p>
          </li>
        </ul>
      </Card>
    </div>
  );
};
