import { useState } from 'react';
import { BottomNavbar, TabType } from './components/common/BottomNavbar';
import { FeedDashboard } from './components/dashboard/FeedDashboard';
import { OutdoorTracker } from './components/tracker/OutdoorTracker';
import { WorkoutHub } from './components/workout/WorkoutHub';
import { ProgressHub } from './components/progress/ProgressHub';
import { SettingsView } from './components/settings/SettingsView';
import { Activity } from './types/index';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('feed');

  const handleActivitySaved = (_activity: Activity) => {
    setActiveTab('feed');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-strava-orange selection:text-white">
      {/* Active Tab Screen */}
      <main className="flex-1 w-full max-w-lg mx-auto overflow-y-auto">
        {activeTab === 'feed' && (
          <FeedDashboard onNavigateTab={(tab) => setActiveTab(tab)} />
        )}
        {activeTab === 'record' && (
          <OutdoorTracker onActivitySaved={handleActivitySaved} />
        )}
        {activeTab === 'workout' && (
          <WorkoutHub onActivitySaved={handleActivitySaved} />
        )}
        {activeTab === 'progress' && <ProgressHub />}
        {activeTab === 'settings' && <SettingsView />}
      </main>

      {/* Persistent Bottom Navbar */}
      <BottomNavbar activeTab={activeTab} onChangeTab={setActiveTab} />
    </div>
  );
}
