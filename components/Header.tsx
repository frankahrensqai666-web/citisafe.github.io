
import React from 'react';
import { LOGO_SVG_DATA_URL } from '../constants';

interface HeaderProps {
  onReportProblemClick: () => void;
  currentView: 'map' | 'dashboard';
  onViewChange: (view: 'map' | 'dashboard') => void;
}

export const Header: React.FC<HeaderProps> = ({ onReportProblemClick, currentView, onViewChange }) => {
  return (
    <header className="bg-white/40 backdrop-blur-lg border border-white/30 rounded-xl shadow-lg p-4 flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-4">
        <img src={LOGO_SVG_DATA_URL} alt="Safe City Map Logo" className="w-10 h-10" />
        <div>
            <h1 className="text-xl font-bold text-slate-800 leading-none">
                Safe City Map <span className="text-[10px] font-bold bg-green-500 text-white px-1.5 py-0.5 rounded ml-1 uppercase">Тёплый Стан</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">Система мониторинга района</p>
        </div>
      </div>
      
      <div className="flex bg-slate-200/50 p-1 rounded-lg">
        <button
            onClick={() => onViewChange('map')}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                currentView === 'map' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
        >
            Карта
        </button>
        <button
            onClick={() => onViewChange('dashboard')}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                currentView === 'dashboard' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
        >
            Аналитика
        </button>
      </div>

      <nav className="flex items-center gap-4">
        <button
          onClick={onReportProblemClick}
          className="bg-[#4CAF50] text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-green-600 active:bg-green-700 transition-all duration-300 text-sm whitespace-nowrap"
        >
          Сообщить о проблеме
        </button>
      </nav>
    </header>
  );
};
