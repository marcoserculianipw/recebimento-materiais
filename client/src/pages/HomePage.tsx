import React from 'react';
import { PlusCircle, ClipboardList, ShieldCheck, Truck } from 'lucide-react';
import { authService } from '../services/authService';

interface HomePageProps {
  onNavigate: (page: 'home' | 'novo' | 'historico') => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const user = authService.getCurrentUser();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between max-w-lg mx-auto px-4 py-6 sm:py-10">
      {/* Bloco Superior: Marca e Título */}
      <div className="text-center pt-6 sm:pt-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#0a3d62] text-white shadow-lg shadow-blue-900/15 mb-6">
          <Truck className="w-10 h-10 text-blue-200" />
        </div>

        <p className="text-xs font-bold tracking-widest text-[#0a3d62] uppercase mb-1">
          INTERCARTA
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight uppercase">
          RECEBIMENTO DE MATERIAIS
        </h1>
        <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto">
          Controle digital de entrada, conferência física e registros de notas fiscais
        </p>
      </div>

      {/* Bloco Central: 2 Botões Grandes e Claros (Foco Celular) */}
      <div className="space-y-4 my-8 w-full">
        {/* Botão 1: + NOVO RECEBIMENTO */}
        <button
          type="button"
          onClick={() => onNavigate('novo')}
          className="w-full bg-[#0a3d62] hover:bg-[#072b46] active:bg-[#041c2e] text-white p-5 rounded-2xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-between group touch-target active:scale-[0.99] border border-blue-800/30"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white flex-shrink-0 group-hover:scale-105 transition-transform">
              <PlusCircle className="w-7 h-7 text-blue-200" />
            </div>
            <div className="text-left">
              <span className="block text-base sm:text-lg font-bold tracking-wide uppercase">
                + NOVO RECEBIMENTO
              </span>
              <span className="block text-xs text-blue-200 font-normal">
                Iniciar conferência e foto de NF
              </span>
            </div>
          </div>
          <span className="text-blue-300 font-bold text-xl pr-2 group-hover:translate-x-1 transition-transform">
            →
          </span>
        </button>

        {/* Botão 2: 📋 RECEBIMENTOS */}
        <button
          type="button"
          onClick={() => onNavigate('historico')}
          className="w-full bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 p-5 rounded-2xl shadow-md border border-slate-200/90 transition-all flex items-center justify-between group touch-target active:scale-[0.99]"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-[#0a3d62] flex-shrink-0 group-hover:scale-105 transition-transform">
              <ClipboardList className="w-7 h-7" />
            </div>
            <div className="text-left">
              <span className="block text-base sm:text-lg font-bold tracking-wide uppercase text-slate-900">
                📋 RECEBIMENTOS
              </span>
              <span className="block text-xs text-slate-500 font-normal">
                Consultar histórico e detalhes salvos
              </span>
            </div>
          </div>
          <span className="text-slate-400 font-bold text-xl pr-2 group-hover:translate-x-1 transition-transform">
            →
          </span>
        </button>
      </div>

      {/* Rodapé Corporativo Limpo */}
      <div className="border-t border-slate-200/70 pt-4 pb-2 text-center text-xs text-slate-500 flex flex-col items-center space-y-1">
        <div className="inline-flex items-center space-x-1 text-slate-600 font-medium">
          <ShieldCheck className="w-4 h-4 text-[#0a3d62]" />
          <span>Usuário Conectado: <strong>{user.name}</strong></span>
        </div>
        <span className="text-[11px] text-slate-400">
          Versão 1.0 • Pronto para Microsoft 365 & PWA
        </span>
      </div>
    </div>
  );
};
