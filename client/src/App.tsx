import React, { useState } from 'react';
import { HomePage } from './pages/HomePage';
import { NewReceivingPage } from './pages/NewReceivingPage';
import { ReceivingListPage } from './pages/ReceivingListPage';
import { ReceivingDetailsPage } from './pages/ReceivingDetailsPage';
import { ReceivingRecord } from './types';

export function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'novo' | 'historico' | 'detalhes'>('home');
  const [selectedRecord, setSelectedRecord] = useState<ReceivingRecord | null>(null);

  const handleSelectRecord = (record: ReceivingRecord) => {
    setSelectedRecord(record);
    setCurrentPage('detalhes');
  };

  const handleSuccessNewReceiving = (savedRecord: ReceivingRecord) => {
    setSelectedRecord(savedRecord);
    setCurrentPage('detalhes');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {currentPage === 'home' && (
        <HomePage onNavigate={(page) => setCurrentPage(page)} />
      )}

      {currentPage === 'novo' && (
        <NewReceivingPage
          onBack={() => setCurrentPage('home')}
          onSuccess={handleSuccessNewReceiving}
        />
      )}

      {currentPage === 'historico' && (
        <ReceivingListPage
          onBack={() => setCurrentPage('home')}
          onSelectRecord={handleSelectRecord}
          onNewReceiving={() => setCurrentPage('novo')}
        />
      )}

      {currentPage === 'detalhes' && selectedRecord && (
        <ReceivingDetailsPage
          record={selectedRecord}
          onBack={() => setCurrentPage('historico')}
        />
      )}
    </div>
  );
}

export default App;
