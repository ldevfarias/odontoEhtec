'use client';

import React, { useState } from 'react';
import { AppShell, Dashboard, PatientsScreen, FinancialScreen, type Patient } from '@/components';

type ViewType = 'dashboard' | 'patients' | 'financial' | 'settings';

export default function DashboardPage() {
  const [view, setView] = useState<ViewType>('dashboard');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const sidebar = {
    items: [
      {
        id: 'dashboard',
        label: 'Painel',
        icon: '📊',
        active: view === 'dashboard',
        onClick: () => {
          setView('dashboard');
          setSelectedPatient(null);
        },
      },
      {
        id: 'patients',
        label: 'Pacientes',
        icon: '👥',
        active: view === 'patients',
        onClick: () => {
          setView('patients');
          setSelectedPatient(null);
        },
      },
      {
        id: 'financial',
        label: 'Financeiro',
        icon: '💰',
        active: view === 'financial',
        onClick: () => {
          setView('financial');
          setSelectedPatient(null);
        },
      },
      {
        id: 'settings',
        label: 'Ajustes',
        icon: '⚙️',
        active: view === 'settings',
        onClick: () => setView('settings'),
      },
    ],
  };

  return (
    <AppShell sidebar={sidebar} isLoggedIn>
      {view === 'dashboard' && <Dashboard />}
      {view === 'patients' && (
        <PatientsScreen
          onPatientClick={(patient: Patient | null) => {
            setSelectedPatient(patient);
          }}
          showDetail={!!selectedPatient}
          selectedPatient={selectedPatient}
        />
      )}
      {view === 'financial' && <FinancialScreen />}
      {view === 'settings' && (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h1 className="oet-h1">Ajustes</h1>
          <p className="oet-body">Página em construção</p>
        </div>
      )}
    </AppShell>
  );
}
