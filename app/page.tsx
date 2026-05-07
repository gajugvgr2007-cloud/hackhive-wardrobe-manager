'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopNav from '@/components/layout/TopNav';
import Dashboard from '@/components/pages/Dashboard';
import Wardrobe from '@/components/pages/Wardrobe';
import Outfits from '@/components/pages/Outfits';
import OutfitPlanner from '@/components/pages/OutfitPlanner';
import DailyPlanner from '@/components/pages/DailyPlanner';

export default function Home() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'wardrobe':
        return <Wardrobe />;
      case 'outfits':
        return <Outfits />;
      case 'outfit-planner':
        return <OutfitPlanner />;
      case 'planner':
        return <DailyPlanner />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex-1 flex flex-col">
        <TopNav />
        <main className="flex-1 overflow-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
