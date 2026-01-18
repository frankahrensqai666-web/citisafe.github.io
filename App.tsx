
import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Map } from './components/Map';
import { Dashboard } from './components/Dashboard';
import { Testimonials } from './components/Testimonials';
import { Toast } from './components/Toast';
import type { MarkerData, Category, Coords } from './types';
import { INITIAL_MARKERS, CATEGORIES, DISTRICT_BOUNDS } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<'map' | 'dashboard'>('map');
  const [markers, setMarkers] = useState<MarkerData[]>(INITIAL_MARKERS);
  const [activeFilters, setActiveFilters] = useState<Category[]>(CATEGORIES.map(c => c.name));
  const [mapCenter, setMapCenter] = useState<Coords>(DISTRICT_BOUNDS.center);
  const [toastMessage, setToastMessage] = useState<string>('');
  
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>(CATEGORIES[0].name);
  const [isTyping, setIsTyping] = useState(false);
  
  const geocodeTimeoutRef = useRef<number | null>(null);

  const handleFilterToggle = useCallback((category: Category) => {
    setActiveFilters(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  }, []);

  const handleAddMarker = useCallback(() => {
    if (!address) {
        setToastMessage('Адрес не указан');
        setTimeout(() => setToastMessage(''), 3000);
        return;
    }
    const newMarker: MarkerData = {
      id: Date.now(),
      coords: mapCenter,
      category: selectedCategory,
      title: address,
      description: description || 'Описание не предоставлено пользователем.',
      author: 'Вы',
      date: new Date().toLocaleDateString('ru-RU'),
      avatar: `https://i.pravatar.cc/40?u=${Date.now()}`
    };
    setMarkers(prev => [newMarker, ...prev]);
    setToastMessage('Ваша отметка добавлена');
    setTimeout(() => setToastMessage(''), 3000);
    setAddress('');
    setDescription('');
    setIsTyping(false);
  }, [address, description, mapCenter, selectedCategory]);

  const handleReportProblem = useCallback(() => {
    setView('map');
    setTimeout(() => {
        const addressInput = document.querySelector('input[placeholder="Адрес или метка"]');
        if (addressInput) {
          (addressInput as HTMLInputElement).focus();
        }
    }, 100);
  }, []);

  const handleMapBoundsChange = useCallback((coords: Coords) => {
    setMapCenter(coords);
    if (isTyping) return;

    if (geocodeTimeoutRef.current) {
        clearTimeout(geocodeTimeoutRef.current);
    }

    geocodeTimeoutRef.current = window.setTimeout(() => {
        window.ymaps.ready(() => {
            window.ymaps.geocode(coords).then((res: any) => {
                const firstGeoObject = res.geoObjects.get(0);
                if (firstGeoObject && !isTyping) {
                    const newAddress = firstGeoObject.getAddressLine();
                    setAddress(newAddress);
                }
            });
        });
    }, 400);

  }, [isTyping]);

  useEffect(() => {
    return () => {
        if (geocodeTimeoutRef.current) {
            clearTimeout(geocodeTimeoutRef.current);
        }
    };
  }, []);

  const filteredMarkers = useMemo(() => {
    return markers.filter(marker => activeFilters.includes(marker.category));
  }, [markers, activeFilters]);

  return (
    <div className="min-h-screen text-slate-800 p-4 md:p-6 lg:p-8 transition-colors duration-500">
      <div className="max-w-screen-xl mx-auto space-y-6">
        <Header 
            onReportProblemClick={handleReportProblem} 
            currentView={view} 
            onViewChange={setView} 
        />

        <main className="min-h-[500px]">
          {view === 'map' ? (
            <div className="flex flex-col lg:flex-row gap-6 animate-in slide-in-from-bottom-4 duration-500">
              <Sidebar
                activeFilters={activeFilters}
                onFilterToggle={handleFilterToggle}
                onAddMarker={handleAddMarker}
                setMapCenter={setMapCenter}
                address={address}
                setAddress={setAddress}
                description={description}
                setDescription={setDescription}
                onAddressFocus={() => setIsTyping(true)}
                onAddressBlur={() => setIsTyping(false)}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
              <div className="flex-grow w-full lg:w-[60%] h-[500px] lg:h-[600px]">
                <Map 
                  center={mapCenter} 
                  markers={filteredMarkers} 
                  onBoundsChange={handleMapBoundsChange}
                />
              </div>
            </div>
          ) : (
            <Dashboard />
          )}
        </main>

        <Testimonials />
        
        <footer className="text-center text-slate-400 text-[10px] py-8 border-t border-slate-200">
          SAFE CITY MAP — ПИЛОТНЫЙ ПРОЕКТ: РАЙОН ТЁПЛЫЙ СТАН. ДАННЫЕ СИНХРОНИЗИРОВАНЫ С ГИС ЖКХ.
        </footer>
      </div>
      <Toast message={toastMessage} />
    </div>
  );
};

export default App;
