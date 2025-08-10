// src/layout/MainLayout.jsx
import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

function MainLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      {/* Fixed Header */}
      <Header toggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

      {/* Animated Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <main className="pt-[80px] pl-[4rem] sm:pl-[16rem] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}

export default MainLayout;