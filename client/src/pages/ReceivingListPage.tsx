import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, Package, Calendar, User, FileText, Filter } from 'lucide-react';
import { Header } from '../components/Header';
import { StatusBadge } from '../components/StatusBadge';
import { ReceivingRecord } from '../types';
import { receivingService } from '../services/receivingService';

interface ReceivingListPageProps {
  onBack: () => void;
  onSelectRecord: (record: ReceivingRecord) => void;
  onNewReceiving: () => void;
}

export const ReceivingListPage: React.FC<ReceivingListPageProps> = ({
  onBack,
  onSelectRecord,
  onNewReceiving,
}) => {
  const [records, setRecords] = useState<ReceivingRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'CONFORME' | 'NAO_CONFORME'>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRecords = async () => {
      setIsLoading(true);
      try {
        const data = await receivingService.getAllReceivings();
        setRecords(data);
      } catch (err) {
        console.error('Erro ao carregar histórico:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadRecords();
  }, []);

  // Filtragem por NF, Fornecedor ou Material/Produto
  const filteredRecords = records.filter((rec) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      rec.invoiceNumber.toLowerCase().includes(query) ||
      rec.supplier.toLowerCase().includes(query) ||
      rec.material.toLowerCase().includes(query) ||
      (rec.id && rec.id.toLowerCase().includes(query));

    const matchesStatus =
      filterStatus === 'ALL' || rec.overallStatus === filterStatus;

    return matchesQuery && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <Header title="RECEBIMENTOS" showBack onBack={onBack} />

      <main className="max-w-xl mx-auto px-4 pt-4 space-y-4">
        {/* Barra de Pesquisa */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por NF, fornecedor ou material..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-[#0a3d62] focus:border-[#0a3d62] outline-none touch-target"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3.5 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 rounded-full w-5 h-5 flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filtros rápidos: Todos, Conforme, Não Conforme */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              type="button"
              onClick={() => setFilterStatus('ALL')}
              className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors ${
                filterStatus === 'ALL'
                  ? 'bg-[#0a3d62] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todos ({records.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('CONFORME')}
              className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors ${
                filterStatus === 'CONFORME'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🟢 Conformes ({records.filter((r) => r.overallStatus === 'CONFORME').length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('NAO_CONFORME')}
              className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors ${
                filterStatus === 'NAO_CONFORME'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🔴 Não Conformes ({records.filter((r) => r.overallStatus === 'NAO_CONFORME').length})
            </button>
          </div>
        </div>

        {/* Listagem de Cartões */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-sm">
              Carregando histórico de recebimentos...
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3 shadow-sm">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-slate-600 font-semibold text-sm">
                Nenhum recebimento encontrado.
              </p>
              <p className="text-xs text-slate-400">
                {searchQuery
                  ? 'Tente buscar com outro termo de pesquisa.'
                  : 'Nenhum registro gravado até o momento.'}
              </p>
              <button
                type="button"
                onClick={onNewReceiving}
                className="mt-2 px-4 py-2 bg-[#0a3d62] text-white text-xs font-bold rounded-lg uppercase tracking-wider"
              >
                + Registrar Primeiro Recebimento
              </button>
            </div>
          ) : (
            filteredRecords.map((record) => (
              <div
                key={record.id}
                onClick={() => onSelectRecord(record)}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-[#0a3d62]/40 active:bg-slate-50 transition-all cursor-pointer group touch-target relative overflow-hidden"
              >
                {/* Linha 1: NF e Badge de Status */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-[#0a3d62]" />
                    <span className="font-extrabold text-base text-slate-900 group-hover:text-[#0a3d62] transition-colors">
                      NF {record.invoiceNumber}
                    </span>
                  </div>

                  <StatusBadge status={record.overallStatus} size="sm" />
                </div>

                {/* Linha 2: Fornecedor */}
                <div className="text-xs font-bold text-slate-800 truncate mb-1">
                  {record.supplier}
                </div>

                {/* Linha 3: Material / Produto */}
                <div className="text-xs text-slate-600 truncate mb-2.5">
                  {record.material}
                </div>

                {/* Linha 4: Data do Recebimento e Indicador */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{record.receivedAt || record.invoiceDate}</span>
                  </div>

                  <div className="flex items-center space-x-1 font-semibold text-[#0a3d62] group-hover:translate-x-0.5 transition-transform">
                    <span>Detalhes</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};
