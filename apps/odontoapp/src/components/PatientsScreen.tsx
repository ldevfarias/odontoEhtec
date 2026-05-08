'use client';

import React, { useState } from 'react';
import { Card } from './Card';
import { Input } from './Input';
import { PatientDetailView } from './PatientDetailView';

export interface Patient {
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

interface PatientsScreenProps {
  onPatientClick?: (patient: Patient | null) => void;
  showDetail?: boolean;
  selectedPatient?: Patient | null;
}

const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'Ana Silva',
    cpf: '123.456.789-00',
    age: 32,
    phone: '(11) 98765-4321',
    email: 'ana@email.com',
    lastVisit: '2026-04-28',
    nextVisit: '2026-05-15',
    status: 'active',
    totalValue: 2400,
  },
  {
    id: '2',
    name: 'Carlos Mendes',
    cpf: '987.654.321-00',
    age: 45,
    phone: '(11) 99876-5432',
    email: 'carlos@email.com',
    lastVisit: '2026-03-10',
    nextVisit: '2026-06-01',
    status: 'active',
    totalValue: 5200,
  },
  {
    id: '3',
    name: 'Juliana Costa',
    cpf: '456.789.123-00',
    age: 28,
    phone: '(11) 97654-3210',
    email: 'juliana@email.com',
    lastVisit: '2026-05-01',
    nextVisit: '2026-05-30',
    status: 'active',
    totalValue: 1800,
  },
];

export const PatientsScreen: React.FC<PatientsScreenProps> = ({
  onPatientClick,
  showDetail = false,
  selectedPatient,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients] = useState<Patient[]>(mockPatients);

  const filteredPatients = patients.filter(
    (p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.cpf.includes(searchTerm)
  );

  if (showDetail && selectedPatient) {
    return <PatientDetailView patient={selectedPatient} onBack={() => onPatientClick?.(null)} />;
  }

  const headerStyle = {
    padding: '16px',
    textAlign: 'left' as const,
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--fg-3)',
    textTransform: 'uppercase' as const,
  };

  return (
    <div>
      {/* Search */}
      <div style={{ marginBottom: '24px' }}>
        <Input
          placeholder="Buscar por nome ou CPF..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
        />
      </div>

      {/* Table */}
      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
            }}
          >
            <thead>
              <tr style={{ borderBottom: '1px solid var(--oet-border-soft)' }}>
                <th style={headerStyle}>Paciente</th>
                <th style={headerStyle}>Idade</th>
                <th style={headerStyle}>Última visita</th>
                <th style={headerStyle}>Próxima visita</th>
                <th style={headerStyle}>Valor</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <PatientRow
                  key={patient.id}
                  patient={patient}
                  onClick={() => onPatientClick?.(patient)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

interface PatientRowProps {
  patient: Patient;
  onClick: () => void;
}

const PatientRow: React.FC<PatientRowProps> = ({ patient, onClick }) => (
  <tr
    onClick={onClick}
    style={{
      borderBottom: '1px solid var(--oet-border-soft)',
      cursor: 'pointer',
      transition: 'background 180ms var(--ease-out)',
    }}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLElement).style.background = 'var(--oet-mist)';
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLElement).style.background = 'transparent';
    }}
  >
    <td style={{ padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--oet-primary-700), var(--oet-accent-500))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '14px',
            fontWeight: 700,
          }}
        >
          {patient.name.charAt(0)}
        </div>
        <div>
          <p className="oet-body-sm" style={{ fontWeight: 600 }}>
            {patient.name}
          </p>
          <p className="oet-caption">{patient.cpf}</p>
        </div>
      </div>
    </td>
    <td style={{ padding: '16px' }}>
      <p className="oet-body-sm">{patient.age} anos</p>
    </td>
    <td style={{ padding: '16px' }}>
      <p className="oet-body-sm">{patient.lastVisit}</p>
    </td>
    <td style={{ padding: '16px' }}>
      <p className="oet-body-sm">{patient.nextVisit}</p>
    </td>
    <td style={{ padding: '16px' }}>
      <p className="oet-body-sm" style={{ fontWeight: 600, color: 'var(--oet-primary-700)' }}>
        R$ {patient.totalValue.toLocaleString('pt-BR')}
      </p>
    </td>
  </tr>
);
