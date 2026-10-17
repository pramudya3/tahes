import React from 'react';
import { Home, Footprints, Dumbbell, TrendingDown, Settings } from 'lucide-react';

export type TabType = 'feed' | 'record' | 'workout' | 'progress' | 'settings';

interface BottomNavbarProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  indoorOnlyMode?: boolean;
}

export const BottomNavbar: React.FC<BottomNavbarProps> = ({
  activeTab,
  onChangeTab,
  indoorOnlyMode = false,
}) => {
  const allTabs = [
    { id: 'feed' as TabType, label: 'Feed', icon: Home },
    { id: 'record' as TabType, label: 'Outdoor', icon: Footprints, outdoorOnly: true },
    { id: 'workout' as TabType, label: 'Latihan', icon: Dumbbell },
    { id: 'progress' as TabType, label: 'Progres', icon: TrendingDown },
    { id: 'settings' as TabType, label: 'Akun', icon: Settings },
  ];

  const tabs = indoorOnlyMode
    ? allTabs.filter((t) => !t.outdoorOnly)
    : allTabs;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#09090B]/95 backdrop-blur-md border-t border-[#27272A] px-2 py-1.5 safe-bottom">
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isRecord = tab.id === 'record';

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition relative group ${
                isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition duration-75 ${
                  isRecord && !isActive
                    ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                    : isRecord && isActive
                    ? 'bg-white text-black shadow-lg shadow-white/10 border-b-2 border-zinc-400'
                    : isActive
                    ? 'bg-[#18181B] text-white border border-zinc-700'
                    : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${isRecord && isActive ? 'fill-black stroke-black' : ''}`} />
              </div>
              <span className={`text-[10px] font-black tracking-tight mt-0.5 ${isActive ? 'text-white' : 'text-zinc-500'}`}>
                {tab.label}
              </span>
              {isActive && !isRecord && (
                <span className="absolute bottom-0 w-2 h-1 rounded-full bg-white" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
