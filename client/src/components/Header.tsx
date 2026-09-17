import React from 'react';
import { ArrowLeft, UserCircle } from 'lucide-react';
import { authService } from '../services/authService';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'RECEBIMENTO DE MATERIAIS',
  showBack = false,
  onBack,
}) => {
  const user = authService.getCurrentUser();

  return (
    <header className="bg-[#0a3d62] text-white shadow-md sticky top-0 z-30">
      <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {showBack && onBack && (
            <button
              onClick={onBack}
              aria-label="Voltar"
              className="p-2 -ml-2 rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors touch-target flex items-center justify-center text-white"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}

          <div className="flex flex-col">
            <h1 className="text-base sm:text-lg font-bold tracking-tight uppercase leading-tight line-clamp-1">
              {title}
            </h1>
            <span className="text-[11px] text-blue-200 font-medium tracking-wide">
              INTERCARTA • LOGÍSTICA & QUALIDADE
            </span>
          </div>
        </div>

        {/* Identificação do Usuário */}
        <div className="flex items-center space-x-2 text-xs text-blue-100 bg-white/10 px-2.5 py-1.5 rounded-full">
          <UserCircle className="w-4 h-4 text-blue-300" />
          <span className="hidden sm:inline font-medium">{user.name.split(' ')[0]}</span>
        </div>
      </div>
    </header>
  );
};
