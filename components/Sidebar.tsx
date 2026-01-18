import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { Category, Coords, Suggestion } from '../types';
import { CATEGORIES } from '../constants';

interface SidebarProps {
  activeFilters: Category[];
  onFilterToggle: (category: Category) => void;
  onAddMarker: () => void;
  setMapCenter: (coords: Coords) => void;
  address: string;
  setAddress: (address: string) => void;
  description: string;
  setDescription: (description: string) => void;
  onAddressFocus: () => void;
  onAddressBlur: () => void;
  selectedCategory: Category;
  onCategoryChange: (category: Category) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeFilters,
  onFilterToggle,
  onAddMarker,
  setMapCenter,
  address,
  setAddress,
  description,
  setDescription,
  onAddressFocus,
  onAddressBlur,
  selectedCategory,
  onCategoryChange,
}) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const debounceTimeout = useRef<number | null>(null);

  const fetchSuggestions = useCallback((query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    window.ymaps.ready(() => {
      window.ymaps.geocode(query, { results: 5 }).then((res: any) => {
        const geoObjects = res.geoObjects.toArray();
        const newSuggestions: Suggestion[] = geoObjects.map((obj: any) => ({
          name: obj.getAddressLine(),
          description: obj.properties.get('description'),
          coords: obj.geometry.getCoordinates(),
        }));
        setSuggestions(newSuggestions);
      });
    });
  }, []);

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = window.setTimeout(() => {
      if (address) {
        fetchSuggestions(address);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [address, fetchSuggestions]);

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setAddress(suggestion.name);
    setSuggestions([]);
    setMapCenter(suggestion.coords);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  return (
    <aside className="w-full lg:w-[380px] flex-shrink-0 space-y-6">
      <div className="bg-white/40 backdrop-blur-lg border border-white/30 rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Фильтры</h2>
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map(({ name, icon }) => {
            const isActive = activeFilters.includes(name);
            return (
              <button
                key={name}
                onClick={() => onFilterToggle(name)}
                className={`flex items-center gap-2 p-2 rounded-lg border transition-all duration-300 ${
                  isActive
                    ? 'bg-green-500 text-white border-green-500/50 shadow-md'
                    : 'bg-white/50 text-slate-700 border-gray-300/50 hover:bg-white/80'
                }`}
              >
                {icon}
                <span className="font-medium text-sm">{name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white/40 backdrop-blur-lg border border-white/30 rounded-xl shadow-lg p-6 space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Новая отметка</h2>
        <div className="relative">
          <input
            type="text"
            value={address}
            onChange={handleInputChange}
            onFocus={onAddressFocus}
            onBlur={onAddressBlur}
            placeholder="Адрес или метка"
            className="w-full px-4 py-2 border border-gray-300/50 rounded-lg bg-white/50 focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none placeholder:text-gray-500"
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-10 w-full mt-1 bg-white/80 backdrop-blur-md border border-gray-200/50 rounded-lg shadow-lg">
              {suggestions.map((s, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(s)}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100/70 border-b border-gray-200/50 last:border-b-0"
                >
                  <p className="font-semibold text-sm text-slate-800">{s.name}</p>
                  <p className="text-xs text-slate-600">{s.description}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <label htmlFor="category-select" className="block text-sm font-medium text-slate-700 mb-1">
            Категория
          </label>
          <div className="relative">
            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value as Category)}
              className="w-full px-4 py-2 border border-gray-300/50 rounded-lg bg-white/50 focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none appearance-none"
            >
              {CATEGORIES.map(({ name }) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>
        <div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Опишите проблему..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300/50 rounded-lg bg-white/50 focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none resize-none placeholder:text-gray-500"
          />
        </div>
        <button
          onClick={onAddMarker}
          disabled={!address}
          className="w-full bg-green-500 text-white font-bold py-2.5 px-4 rounded-lg shadow-md hover:bg-green-600 disabled:bg-gray-400/50 disabled:cursor-not-allowed transition-all duration-300"
        >
          Добавить точку
        </button>
        <div className="flex items-start gap-3 pt-4 border-t border-gray-900/10 mt-4">
            <img src="https://i.pravatar.cc/40?u=example" alt="avatar" className="w-10 h-10 rounded-full" />
            <div>
                <p className="font-semibold text-sm text-slate-800">Адрес или метка</p>
                <p className="text-xs text-slate-600">Адрес #rrxu9b-taca (Δ)</p>
                <p className="text-sm text-slate-700">Опишите проблем...</p>
            </div>
        </div>
      </div>
    </aside>
  );
};