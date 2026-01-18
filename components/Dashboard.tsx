
import React from 'react';
import { DASHBOARD_STATS } from '../constants';

export const Dashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
      {/* Ключевые показатели */}
      <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Всего заявок', value: DASHBOARD_STATS.totalReports, color: 'text-blue-600' },
          { label: 'Решено', value: DASHBOARD_STATS.resolved, color: 'text-green-600' },
          { label: 'В работе', value: DASHBOARD_STATS.inProgress, color: 'text-orange-600' },
          { label: 'Ср. время ответа', value: DASHBOARD_STATS.responseTime, color: 'text-purple-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white/40 backdrop-blur-lg border border-white/30 p-5 rounded-xl shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
            <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Статистика по категориям */}
      <div className="lg:col-span-2 bg-white/40 backdrop-blur-lg border border-white/30 p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Распределение по категориям</h3>
        <div className="space-y-6">
          {DASHBOARD_STATS.categoryStats.map((cat, i) => {
            const percentage = Math.round((cat.count / DASHBOARD_STATS.totalReports) * 100);
            return (
              <div key={i}>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-semibold text-slate-700">{cat.name}</span>
                  <span className="text-xs text-slate-500 font-medium">{cat.count} шт. ({percentage}%)</span>
                </div>
                <div className="w-full bg-slate-200/50 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${percentage}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Дополнительная инфопанель */}
      <div className="bg-white/40 backdrop-blur-lg border border-white/30 p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Статус пилота</h3>
        <div className="space-y-4">
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-sm font-bold text-green-700">Тёплый Стан: Активен</p>
            <p className="text-xs text-green-600 mt-1">Пилотный запуск проходит в штатном режиме. Охват: 100% территории района.</p>
          </div>
          <div className="p-4 bg-slate-200/30 rounded-lg">
            <h4 className="text-sm font-semibold text-slate-700">Топ локаций (неделя)</h4>
            <ul className="mt-2 space-y-2 text-xs text-slate-600">
              <li className="flex justify-between"><span>ул. Тёплый Стан</span> <span className="font-bold">12</span></li>
              <li className="flex justify-between"><span>ул. Профсоюзная</span> <span className="font-bold">9</span></li>
              <li className="flex justify-between"><span>Метро Тёплый Стан</span> <span className="font-bold">7</span></li>
            </ul>
          </div>
          <div className="text-center pt-2">
            <p className="text-[10px] text-slate-400">Данные обновлены: Сегодня, 12:45</p>
          </div>
        </div>
      </div>
    </div>
  );
};
