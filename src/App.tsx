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
      {/* Persistent Tab Screens (prevents in-flight GPS / workout interruption) */}
      <main className="flex-1 w-full max-w-lg mx-auto overflow-y-auto">
        <div className={activeTab === 'feed' ? 'block' : 'hidden'}>
          <FeedDashboard onNavigateTab={(tab) => setActiveTab(tab)} />
        </div>
        <div className={activeTab === 'record' ? 'block' : 'hidden'}>
          <OutdoorTracker onActivitySaved={handleActivitySaved} />
        </div>
        <div className={activeTab === 'workout' ? 'block' : 'hidden'}>
          <WorkoutHub onActivitySaved={handleActivitySaved} />
        </div>
        <div className={activeTab === 'progress' ? 'block' : 'hidden'}>
          <ProgressHub />
        </div>
        <div className={activeTab === 'settings' ? 'block' : 'hidden'}>
          <SettingsView />
        </div>
      </main>

      {/* Persistent Bottom Navbar */}
      <BottomNavbar activeTab={activeTab} onChangeTab={setActiveTab} />
    </div>
  );
}
