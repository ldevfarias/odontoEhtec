'use client';

import React from 'react';

interface ToothStatus {
  number: number;
  status: 'healthy' | 'restoration' | 'caries' | 'missing' | 'implant';
}

interface OdontogramProps {
  teeth: ToothStatus[];
  onToothClick?: (number: number) => void;
}

const statusColors: Record<string, string> = {
  healthy: '#4A8E6E',
  restoration: '#D9A86C',
  caries: '#C25E4D',
  missing: '#6B7C7F',
  implant: '#7DB7AE',
};

const statusLabels: Record<string, string> = {
  healthy: 'Saudável',
  restoration: 'Restauração',
  caries: 'Cárie',
  missing: 'Ausente',
  implant: 'Implante',
};

export const Odontogram: React.FC<OdontogramProps> = ({ teeth, onToothClick }) => {
  // Organize teeth by quadrant
  const quadrants = {
    upperRight: teeth.filter((t) => t.number >= 11 && t.number <= 18),
    upperLeft: teeth.filter((t) => t.number >= 21 && t.number <= 28),
    lowerLeft: teeth.filter((t) => t.number >= 31 && t.number <= 38),
    lowerRight: teeth.filter((t) => t.number >= 41 && t.number <= 48),
  };

  const Tooth = ({ number, status }: { number: number; status: string }) => (
    <button
      onClick={() => onToothClick?.(number)}
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        border: `2px solid ${statusColors[status] || '#ccc'}`,
        background: statusColors[status] ? `${statusColors[status]}20` : '#fff',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: 600,
        color: 'var(--fg-1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 180ms var(--ease-out)',
      }}
      onMouseEnter={(e) => {
        (e.target as HTMLElement).style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        (e.target as HTMLElement).style.transform = 'scale(1)';
      }}
    >
      {number}
    </button>
  );

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h3 className="oet-h4" style={{ marginBottom: '16px' }}>
          Odontograma
        </h3>

        {/* Status Legend */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '12px',
            marginBottom: '20px',
          }}
        >
          {Object.entries(statusColors).map(([key, color]) => (
            <div
              key={key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
              }}
            >
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '4px',
                  background: color,
                }}
              />
              <span>{statusLabels[key as keyof typeof statusLabels]}</span>
            </div>
          ))}
        </div>

        {/* Odontogram Grid */}
        <div style={{ background: 'var(--oet-surface-2)', borderRadius: '12px', padding: '20px' }}>
          {/* Upper Teeth */}
          <div style={{ marginBottom: '20px' }}>
            <p className="oet-caption" style={{ marginBottom: '12px' }}>
              Arcada superior
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '20px',
              }}
            >
              {/* Upper Right (reversed for proper visualization) */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {quadrants.upperRight
                  .sort((a, b) => b.number - a.number)
                  .map((t) => (
                    <Tooth key={t.number} number={t.number} status={t.status} />
                  ))}
              </div>

              {/* Divider */}
              <div style={{ width: '2px', background: 'var(--oet-border-soft)' }} />

              {/* Upper Left */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {quadrants.upperLeft.map((t) => (
                  <Tooth key={t.number} number={t.number} status={t.status} />
                ))}
              </div>
            </div>
          </div>

          {/* Lower Teeth */}
          <div>
            <p className="oet-caption" style={{ marginBottom: '12px' }}>
              Arcada inferior
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {/* Lower Left (reversed) */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {quadrants.lowerLeft
                  .sort((a, b) => b.number - a.number)
                  .map((t) => (
                    <Tooth key={t.number} number={t.number} status={t.status} />
                  ))}
              </div>

              {/* Divider */}
              <div style={{ width: '2px', background: 'var(--oet-border-soft)' }} />

              {/* Lower Right */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {quadrants.lowerRight.map((t) => (
                  <Tooth key={t.number} number={t.number} status={t.status} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
