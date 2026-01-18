
import React, { useEffect, useRef, useState } from 'react';
import type { MarkerData, Coords } from '../types';
import { CATEGORY_COLORS, DISTRICT_BOUNDS } from '../constants';

interface MapProps {
  center: Coords;
  markers: MarkerData[];
  onBoundsChange: (coords: Coords) => void;
}

export const Map: React.FC<MapProps> = ({ center, markers, onBoundsChange }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const placemarksCollection = useRef<any>(null);
  const onBoundsChangeRef = useRef(onBoundsChange);

  const isInitialMount = useRef(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    onBoundsChangeRef.current = onBoundsChange;
  }, [onBoundsChange]);

  useEffect(() => {
    if (!mapRef.current) return;
    
    let map: any;
    const initMap = () => {
        map = new window.ymaps.Map(mapRef.current!, {
            center: DISTRICT_BOUNDS.center,
            zoom: 14, // Ближе, чтобы видеть район
            controls: ['zoomControl', 'fullscreenControl'],
            // Ограничение области карты Тёплым Станом
            restrictMapArea: DISTRICT_BOUNDS.restrict
        }, {
            minZoom: 13,
            maxZoom: 18
        });
        
        mapInstance.current = map;
        placemarksCollection.current = new window.ymaps.GeoObjectCollection(null, {});
        mapInstance.current.geoObjects.add(placemarksCollection.current);

        map.events.add('actionend', () => {
            const newCenter = map.getCenter();
            onBoundsChangeRef.current(newCenter);
        });
    };

    window.ymaps.ready(initMap);
    
    return () => {
        map?.destroy();
        mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    if (mapInstance.current) {
        const currentCenter = mapInstance.current.getCenter();
        if (currentCenter[0].toFixed(6) !== center[0].toFixed(6) || currentCenter[1].toFixed(6) !== center[1].toFixed(6)) {
            mapInstance.current.setCenter(center, undefined, {
                checkZoomRange: true,
                duration: 500
            });
        }
    }
  }, [center]);

  useEffect(() => {
    const updatePlacemarks = () => {
        if (!placemarksCollection.current) return;
        
        placemarksCollection.current.removeAll();

        markers.forEach(marker => {
            const color = CATEGORY_COLORS[marker.category] || '#1E98FF';
            const placemark = new window.ymaps.Placemark(
                marker.coords,
                {
                    balloonContentHeader: `<b>${marker.category}: ${marker.title}</b>`,
                    balloonContentBody: `
                        <div style="font-family: Inter, sans-serif; padding: 5px;">
                            <p style="margin-bottom: 8px;">${marker.description}</p>
                            <div style="display: flex; align-items: center; border-top: 1px solid #eee; padding-top: 8px;">
                               <img src="${marker.avatar}" width="24" height="24" style="border-radius: 50%; margin-right: 8px;" alt="avatar"/>
                               <div style="font-size: 11px; color: #666;">
                                 <b>${marker.author}</b><br/>${marker.date}
                               </div>
                            </div>
                        </div>
                    `,
                },
                {
                    preset: 'islands#dotIcon',
                    iconColor: color
                }
            );
            placemarksCollection.current.add(placemark);
        });
    };
    
    if (isInitialMount.current) {
      isInitialMount.current = false;
      window.ymaps.ready(updatePlacemarks);
      return;
    }

    setIsFading(true);
    const timer = setTimeout(() => {
      updatePlacemarks();
      setIsFading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [markers]);

  return (
    <div className="w-full h-full rounded-xl shadow-lg relative overflow-hidden border border-white/30 bg-white/20">
      <div ref={mapRef} className={`w-full h-full rounded-xl transition-opacity duration-300 ${isFading ? 'opacity-50' : 'opacity-100'}`} />
      
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full" 
        style={{ pointerEvents: 'none' }}
      >
        <svg 
          width="48" 
          height="48" 
          viewBox="0 0 32 32" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          style={{ filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.25))' }}
        >
          <path 
            d="M16 31C16 31 6 20.3137 6 12C6 6.47715 10.4772 2 16 2C21.5228 2 26 6.47715 26 12C26 20.3137 16 31 16 31Z" 
            fill="#4CAF50" 
            stroke="white" 
            strokeWidth="2"
          />
          <circle cx="16" cy="12" r="4" fill="white"/>
        </svg>
      </div>

      <div className="absolute top-4 left-4 bg-white/70 backdrop-blur-md px-3 py-1 rounded-md text-[10px] font-bold text-slate-800 shadow-sm border border-white/20 uppercase tracking-tighter">
          Район: Тёплый Стан
      </div>
      
      <div className="absolute bottom-4 right-4 bg-white/50 backdrop-blur-md px-3 py-1 rounded-md text-xs text-slate-700 shadow-sm border border-white/20">
          Живая карта — Яндекс
      </div>
    </div>
  );
};
