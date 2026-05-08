import React from 'react';

interface Delta {
  direction: 'up' | 'down';
  value: string;
}

interface KPIProps {
  label: string;
  value: string;
  delta?: Delta;
  icon?: React.ReactNode;
}

export const KPI: React.FC<KPIProps> = ({ label, value, delta, icon }) => {
  return (
    <div className="oet-card">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="oet-caption mb-2">{label}</p>
          <div className="oet-kpi">{value}</div>
          {delta && (
            <div
              className={`oet-body-sm mt-2 ${
                delta.direction === 'up' ? 'text-green-600' : 'text-orange-600'
              }`}
            >
              {delta.direction === 'up' ? '↑' : '↓'} {delta.value}
            </div>
          )}
        </div>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
    </div>
  );
};
