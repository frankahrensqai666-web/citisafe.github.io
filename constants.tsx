
import React from 'react';
import type { MarkerData, Category } from './types';
import { LightbulbIcon, RoadIcon, WalkIcon, BusIcon, HomeIcon } from './components/icons';

// Исправленный логотип: галочка отцентрирована внутри щита
export const LOGO_SVG_DATA_URL = "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNTAgOTVDNTAgOTUgMTAgNTUgMTAgMzVhNDAgNDAgMCAxIDEgODAgMGMwIDIwLTQwIDYwLTQwIDYweiIgZmlsbD0iIzRjYWY1MCIvPjxwYXRoIGQ9Ik01MCAzMEw3MCA0MHYxOGMwIDctMTUgMTctMjAgMTdzLTIwLTEwLTIwLTE3VjQwTDUwIDMweiIgZmlsbD0iI2ZmZiIgc3Ryb2tlPSIjZTBjMGUwIiBzdHJva2Utd2lkdGg9IjIiLz48cGF0aCBkPSJNNDAgNTJsNyA3IDEzLTEzIiBzdHJva2U9IiM0Y2FmNTAiIHN0cm9rZS13aWR0aD0iNiIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+";

export const CATEGORIES: { name: Category; icon: React.ReactElement }[] = [
  { name: 'Освещение', icon: <LightbulbIcon /> },
  { name: 'Дороги/ямы', icon: <RoadIcon /> },
  { name: 'Переходы', icon: <WalkIcon /> },
  { name: 'Транспорт', icon: <BusIcon /> },
  { name: 'Двор', icon: <HomeIcon /> },
];

export const CATEGORY_COLORS: Record<Category, string> = {
  'Освещение': '#4CAF50',
  'Дороги/ямы': '#F44336',
  'Транспорт': '#2196F3',
  'Переходы': '#FF9800',
  'Двор': '#9C27B0',
};

export const INITIAL_MARKERS: MarkerData[] = [
  {
    id: 1,
    coords: [55.632, 37.518],
    category: 'Освещение',
    title: 'ул. Профсоюзная, 142',
    description: 'Не работает три фонаря подряд вдоль пешеходной дорожки к метро.',
    author: 'Анна В.',
    date: '15.02.2025',
    avatar: 'https://i.pravatar.cc/40?u=1'
  },
  {
    id: 2,
    coords: [55.625, 37.505],
    category: 'Дороги/ямы',
    title: 'ул. Тёплый Стан, 4',
    description: 'Огромная яма при въезде во двор, машины цепляют дном.',
    author: 'Иван П.',
    date: '14.02.2025',
    avatar: 'https://i.pravatar.cc/40?u=2'
  },
  {
    id: 3,
    coords: [55.618, 37.495],
    category: 'Переходы',
    title: 'ул. Генерала Тюленева',
    description: 'Светофор работает слишком мало времени для перехода пенсионеров.',
    author: 'Елена С.',
    date: '13.02.2025',
    avatar: 'https://i.pravatar.cc/40?u=3'
  },
  {
    id: 4,
    coords: [55.621, 37.525],
    category: 'Транспорт',
    title: 'Метро Тёплый Стан',
    description: 'Автобусы 281 маршрута ходят с задержкой более 20 минут в час пик.',
    author: 'Петр И.',
    date: '12.02.2025',
    avatar: 'https://i.pravatar.cc/40?u=4'
  },
];

export const TESTIMONIALS = [
    {
        name: 'Алексей С.',
        date: '10 февраля 2025',
        rating: 5,
        text: 'Очень удобный сервис! Сообщил о яме на Профсоюзной, через 3 дня ее уже заделали. Приятно видеть, что район меняется.',
        avatar: 'https://i.pravatar.cc/48?u=alex'
    },
    {
        name: 'Марина К.',
        date: '05 февраля 2025',
        rating: 4,
        text: 'Хорошее приложение для жителей Тёплого Стана. Помогает держать руку на пульсе проблем нашего района.',
        avatar: 'https://i.pravatar.cc/48?u=marina'
    },
    {
        name: 'Дмитрий У.',
        date: '01 февраля 2025',
        rating: 5,
        text: 'Наконец-то появилось место, где можно централизованно увидеть все проблемы. Дашборд с аналитикой — супер решение!',
        avatar: 'https://i.pravatar.cc/48?u=dmitry'
    }
];

export const DISTRICT_BOUNDS = {
    center: [55.626, 37.509] as [number, number],
    restrict: [
        [55.602, 37.465],
        [55.650, 37.555]
    ] as [[number, number], [number, number]]
};

export const DASHBOARD_STATS = {
    totalReports: 124,
    resolved: 86,
    inProgress: 28,
    responseTime: "1.4 дня",
    categoryStats: [
        { name: 'Освещение', count: 42, color: CATEGORY_COLORS['Освещение'] },
        { name: 'Дороги/ямы', count: 35, color: CATEGORY_COLORS['Дороги/ямы'] },
        { name: 'Транспорт', count: 18, color: CATEGORY_COLORS['Транспорт'] },
        { name: 'Переходы', count: 15, color: CATEGORY_COLORS['Переходы'] },
        { name: 'Двор', count: 14, color: CATEGORY_COLORS['Двор'] },
    ]
};
