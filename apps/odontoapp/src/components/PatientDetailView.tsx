'use client';

import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Odontogram } from './Odontogram';

interface Patient {
  id: string;
  name: string;
  cpf: string;
  age: number;
  phone: string;
  email: string;
  lastVisit: string;
  nextVisit: string;
  status: 'active' | 'inactive' | 'prospect';
  totalValue: number;
}

interface PatientDetailViewProps {
  patient: Patient;
  onBack: () => void;
}

export const PatientDetailView: React.FC<PatientDetailViewProps> = ({ patient, onBack }) => {
  return (
    <div>
      <Button variant="ghost" onClick={onBack} style={{ marginBottom: '24px' }}>
        ← Voltar
      </Button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
        {/* Left Panel */}
        <div>
          {/* Avatar */}
          <div
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--oet-primary-700), var(--oet-accent-500))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '48px',
              fontWeight: 700,
              marginBottom: '20px',
            }}
          >
            {patient.name.charAt(0)}
          </div>

          <Card>
            <h3 className="oet-h4" style={{ marginBottom: '16px' }}>
              Informações
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <p className="oet-caption">Nome</p>
                <p className="oet-body">{patient.name}</p>
              </div>
              <div>
                <p className="oet-caption">CPF</p>
                <p className="oet-body">{patient.cpf}</p>
              </div>
              <div>
                <p className="oet-caption">Idade</p>
                <p className="oet-body">{patient.age} anos</p>
              </div>
              <div>
                <p className="oet-caption">Telefone</p>
                <p className="oet-body">{patient.phone}</p>
              </div>
              <div>
                <p className="oet-caption">E-mail</p>
                <p className="oet-body">{patient.email}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Panel */}
        <div>
          <Odontogram
            teeth={[
              { number: 11, status: 'healthy' },
              { number: 12, status: 'restoration' },
              { number: 13, status: 'healthy' },
              { number: 14, status: 'caries' },
              { number: 15, status: 'healthy' },
              { number: 16, status: 'healthy' },
              { number: 17, status: 'restoration' },
              { number: 18, status: 'healthy' },
              { number: 21, status: 'healthy' },
              { number: 22, status: 'healthy' },
              { number: 23, status: 'healthy' },
              { number: 24, status: 'restoration' },
              { number: 25, status: 'healthy' },
              { number: 26, status: 'healthy' },
              { number: 27, status: 'healthy' },
              { number: 28, status: 'healthy' },
              { number: 31, status: 'healthy' },
              { number: 32, status: 'healthy' },
              { number: 33, status: 'healthy' },
              { number: 34, status: 'healthy' },
              { number: 35, status: 'restoration' },
              { number: 36, status: 'healthy' },
              { number: 37, status: 'healthy' },
              { number: 38, status: 'missing' },
              { number: 41, status: 'healthy' },
              { number: 42, status: 'healthy' },
              { number: 43, status: 'healthy' },
              { number: 44, status: 'healthy' },
              { number: 45, status: 'healthy' },
              { number: 46, status: 'implant' },
              { number: 47, status: 'healthy' },
              { number: 48, status: 'healthy' },
            ]}
          />

          {/* Appointments */}
          <Card style={{ marginTop: '32px' }}>
            <h3 className="oet-h4" style={{ marginBottom: '16px' }}>
              Próximas consultas
            </h3>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div
                style={{
                  padding: '12px',
                  background: 'var(--oet-primary-100)',
                  borderLeft: '4px solid var(--oet-primary-700)',
                  borderRadius: '4px',
                }}
              >
                <p className="oet-body-sm" style={{ fontWeight: 600 }}>
                  {patient.nextVisit}
                </p>
                <p className="oet-caption">Consulta de controle</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
