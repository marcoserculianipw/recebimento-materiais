import React from 'react';
import { Check, X, AlertTriangle } from 'lucide-react';
import { ChecklistItemResult } from '../types';
import { CameraCapture } from './CameraCapture';

interface ChecklistItemRowProps {
  index: number;
  item: ChecklistItemResult;
  onChange: (updated: ChecklistItemResult) => void;
}

export const ChecklistItemRow: React.FC<ChecklistItemRowProps> = ({
  index,
  item,
  onChange,
}) => {
  const isConforme = item.status === 'CONFORME';
  const isNaoConforme = item.status === 'NAO_CONFORME';

  const handleSelectStatus = (status: 'CONFORME' | 'NAO_CONFORME') => {
    onChange({
      ...item,
      status,
      // Se mudar para CONFORME, preserva ou limpa ocorrência
    });
  };

  const handleObservationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      ...item,
      observation: e.target.value,
    });
  };

  const handlePhotoConfirmed = (photoUrl: string) => {
    onChange({
      ...item,
      photoUrl,
    });
  };

  const handleRemovePhoto = () => {
    onChange({
      ...item,
      photoUrl: undefined,
    });
  };

  return (
    <div
      className={`border rounded-xl p-3.5 transition-all duration-200 bg-white ${
        isNaoConforme
          ? 'border-rose-300 ring-1 ring-rose-200 shadow-sm'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Cabeçalho do Item */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center space-x-2">
          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center flex-shrink-0">
            {index + 1}
          </span>
          <span className="text-sm font-semibold text-slate-800 leading-snug">
            {item.title}
          </span>
        </div>
      </div>

      {/* Botões de Seleção: CONFORME vs NÃO CONFORME */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => handleSelectStatus('CONFORME')}
          className={`flex items-center justify-center gap-2 py-3 px-3 rounded-lg font-bold text-xs sm:text-sm transition-all touch-target active:scale-[0.98] ${
            isConforme
              ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/20'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
          }`}
        >
          <span className="text-base">🟢</span>
          <span>CONFORME</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectStatus('NAO_CONFORME')}
          className={`flex items-center justify-center gap-2 py-3 px-3 rounded-lg font-bold text-xs sm:text-sm transition-all touch-target active:scale-[0.98] ${
            isNaoConforme
              ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-500/20'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
          }`}
        >
          <span className="text-base">🔴</span>
          <span>NÃO CONFORME</span>
        </button>
      </div>

      {/* Bloco de Detalhes Imediato se for NÃO CONFORME */}
      {isNaoConforme && (
        <div className="mt-3.5 pt-3 border-t border-rose-100 bg-rose-50/50 -mx-3.5 -mb-3.5 p-3.5 rounded-b-xl space-y-3 animate-fadeIn">
          <div className="flex items-center space-x-1.5 text-rose-800">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <label className="text-xs font-bold uppercase tracking-wide">
              O que foi identificado?
            </label>
          </div>

          <textarea
            value={item.observation || ''}
            onChange={handleObservationChange}
            placeholder="Descreva o desvio ou problema identificado no item..."
            rows={2}
            className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-lg border border-rose-300 bg-white text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
          />

          <div>
            <span className="block text-[11px] font-semibold text-rose-800 mb-1.5 uppercase">
              Foto da ocorrência (opcional, mas recomendada):
            </span>
            <CameraCapture
              label={`Ocorrência: ${item.title}`}
              buttonText="📷 TIRAR FOTO DA OCORRÊNCIA"
              currentPhoto={item.photoUrl}
              onPhotoConfirmed={handlePhotoConfirmed}
              onRemovePhoto={handleRemovePhoto}
              compact
            />
          </div>
        </div>
      )}
    </div>
  );
};
