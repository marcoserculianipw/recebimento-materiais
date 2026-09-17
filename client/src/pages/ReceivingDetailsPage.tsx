import React, { useState } from 'react';
import {
  ArrowLeft,
  FileText,
  Truck,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Camera,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { Header } from '../components/Header';
import { StatusBadge } from '../components/StatusBadge';
import { ReceivingRecord } from '../types';

interface ReceivingDetailsPageProps {
  record: ReceivingRecord;
  onBack: () => void;
}

export const ReceivingDetailsPage: React.FC<ReceivingDetailsPageProps> = ({
  record,
  onBack,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; title: string } | null>(null);

  const conformes = record.checklist.filter((c) => c.status === 'CONFORME');
  const naoConformes = record.checklist.filter((c) => c.status === 'NAO_CONFORME');

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <Header title="DETALHES DO RECEBIMENTO" showBack onBack={onBack} />

      <main className="max-w-xl mx-auto px-4 pt-4 space-y-4 animate-fadeIn">
        {/* Banner do Cabeçalho com ID e Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Identificador Único
              </span>
              <span className="font-mono text-base font-bold text-[#0a3d62]">
                {record.id}
              </span>
            </div>

            <StatusBadge status={record.overallStatus} size="md" />
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Recebido em: <strong>{record.receivedAt}</strong></span>
            </div>
            <div className="flex items-center space-x-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>{record.responsible}</span>
            </div>
          </div>
        </div>

        {/* Foto da Nota Fiscal */}
        {record.invoicePhoto && (
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center space-x-2">
                <Camera className="w-4 h-4 text-[#0a3d62]" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Foto da Nota Fiscal
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPhoto({ url: record.invoicePhoto, title: `NF ${record.invoiceNumber}` })}
                className="text-xs text-[#0a3d62] font-semibold flex items-center gap-1 hover:underline"
              >
                <Eye className="w-3.5 h-3.5" />
                Ampliar
              </button>
            </div>

            <div
              onClick={() => setSelectedPhoto({ url: record.invoicePhoto, title: `NF ${record.invoiceNumber}` })}
              className="relative rounded-xl overflow-hidden bg-slate-900 aspect-[16/9] cursor-pointer group flex items-center justify-center border border-slate-200"
            >
              <img
                src={record.invoicePhoto}
                alt="Nota Fiscal"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs bg-black/60 px-3 py-1.5 rounded-full flex items-center gap-1">
                  <Eye className="w-4 h-4" /> Toque para ampliar
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Dados da NF e Material */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
            <FileText className="w-4 h-4 text-[#0a3d62]" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Dados da Nota e Material
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-y-2.5 gap-x-3 text-xs">
            <div>
              <span className="text-slate-400 block">Nº da NF:</span>
              <span className="font-bold text-slate-900 text-sm">{record.invoiceNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Data da NF:</span>
              <span className="font-medium text-slate-900">{record.invoiceDate || '-'}</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400 block">Fornecedor:</span>
              <span className="font-semibold text-slate-900">{record.supplier}</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400 block">Material / Produto:</span>
              <span className="font-semibold text-slate-900">{record.material}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Quantidade:</span>
              <span className="font-medium text-slate-900">{record.quantity || '-'}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Lote:</span>
              <span className="font-medium text-slate-900">{record.batch || '-'}</span>
            </div>
          </div>
        </div>

        {/* Dados de Transporte */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
            <Truck className="w-4 h-4 text-[#0a3d62]" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Transporte & Pedido
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-y-2.5 gap-x-3 text-xs">
            <div className="col-span-2">
              <span className="text-slate-400 block">Transportadora:</span>
              <span className="font-semibold text-slate-900">{record.carrier || '-'}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Placa:</span>
              <span className="font-medium text-slate-900 uppercase">{record.licensePlate || '-'}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Motorista:</span>
              <span className="font-medium text-slate-900">{record.driver || '-'}</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400 block">Pedido / OC:</span>
              <span className="font-medium text-slate-900">{record.purchaseOrder || '-'}</span>
            </div>
          </div>
        </div>

        {/* Observação Geral */}
        {record.generalObservation && (
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1.5 text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px] block">
              Observação Geral:
            </span>
            <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
              {record.generalObservation}
            </p>
          </div>
        )}

        {/* Resultado da Conferência dos 9 Itens */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Resultado da Conferência
            </h3>
            <span className="text-xs text-slate-500">
              {conformes.length} de {record.checklist.length} conformes
            </span>
          </div>

          {/* Se houver não conformes, destaca primeiro */}
          {naoConformes.length > 0 && (
            <div className="space-y-2 mb-3">
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wide flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                Itens Não Conformes ({naoConformes.length}):
              </span>
              {naoConformes.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-rose-50/70 rounded-xl border border-rose-200 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-900">{item.title}</span>
                    <span className="text-[10px] font-bold bg-rose-200 text-rose-900 px-2 py-0.5 rounded-full">
                      🔴 NÃO CONFORME
                    </span>
                  </div>

                  {item.observation && (
                    <div className="text-slate-800 bg-white/70 p-2 rounded border border-rose-100">
                      <strong>Identificado: </strong> {item.observation}
                    </div>
                  )}

                  {item.photoUrl && (
                    <div className="mt-2">
                      <span className="text-[11px] font-semibold text-rose-900 block mb-1">
                        Foto da ocorrência:
                      </span>
                      <div
                        onClick={() =>
                          setSelectedPhoto({
                            url: item.photoUrl!,
                            title: `Ocorrência: ${item.title}`,
                          })
                        }
                        className="w-24 h-20 rounded-lg overflow-hidden border border-rose-300 cursor-pointer relative group"
                      >
                        <img
                          src={item.photoUrl}
                          alt="Ocorrência"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Eye className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Itens Conformes */}
          <div className="space-y-1.5 pt-1">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Itens Conformes ({conformes.length}):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {conformes.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-2 text-xs text-slate-700 bg-slate-50 px-2.5 py-2 rounded-lg border border-slate-100"
                >
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span className="truncate">{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Botão de Retorno */}
        <button
          type="button"
          onClick={onBack}
          className="w-full py-3.5 px-4 bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-700 font-bold rounded-xl border border-slate-300 transition-all touch-target text-sm flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para a Lista</span>
        </button>
      </main>

      {/* Modal de Zoom de Imagem */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-lg w-full max-h-[90vh] flex flex-col items-center">
            <div className="w-full flex justify-between items-center text-white pb-2 text-xs font-semibold">
              <span>{selectedPhoto.title}</span>
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="bg-white/20 px-3 py-1 rounded-full text-xs hover:bg-white/40"
              >
                Fechar
              </button>
            </div>
            <img
              src={selectedPhoto.url}
              alt="Visualização ampliada"
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl border border-white/20"
            />
          </div>
        </div>
      )}
    </div>
  );
};
