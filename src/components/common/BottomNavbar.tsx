import React from 'react';
import { Home, Footprints, Dumbbell, TrendingDown, Settings } from 'lucide-react';

export type TabType = 'feed' | 'record' | 'workout' | 'progress' | 'settings';

interface BottomNavbarProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export const BottomNavbar: React.FC<BottomNavbarProps> = ({
  activeTab,
  onChangeTab,
}) => {
  const tabs = [
    { id: 'feed' as TabType, label: 'Feed', icon: Home },
    { id: 'record' as TabType, label: 'GPS Lari', icon: Footprints },
    { id: 'workout' as TabType, label: 'Workout', icon: Dumbbell },
    { id: 'progress' as TabType, label: 'Progres', icon: TrendingDown },
    { id: 'settings' as TabType, label: 'Akun', icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-1.5 safe-bottom">
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isRecord = tab.id === 'record';

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition relative ${
                isActive ? 'text-strava-orange' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition ${
                  isRecord && !isActive
                    ? 'bg-strava-orange/15 text-strava-orange'
                    : isRecord && isActive
                    ? 'bg-strava-orange text-white shadow-lg shadow-strava-orange/30'
                    : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${isRecord && isActive ? 'fill-white' : ''}`} />
              </div>
              <span className={`text-[10px] font-bold tracking-tight mt-0.5 ${isActive ? 'text-strava-orange' : 'text-slate-400'}`}>
                {tab.label}
              </span>
              {isActive && !isRecord && (
                <span className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-strava-orange" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
