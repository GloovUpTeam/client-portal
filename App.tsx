import React, { useState } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Sidebar } from './components/organisms/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { ProjectDetail } from './pages/ProjectDetail';
import { Projects } from './pages/Projects';
import { Tickets } from './pages/Tickets';
import { Chat } from './pages/Chat';
import { ReviewsPage } from './pages/ReviewsPage';
import { Invoices } from './pages/Invoices';
import { Settings } from './pages/Settings';
import { Bell, Search, Menu } from 'lucide-react';
import { USERS } from './services/mockData';

const NotFound = () => <div className="text-white text-2xl p-10">404 - Page Not Found</div>;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-20 border-b border-neutral-800 bg-black/50 backdrop-blur-md flex items-center justify-between px-4 sm:px-8 z-20">
          <div className="flex items-center gap-4">
             <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white hover:text-brand transition-colors">
               <Menu className="w-6 h-6" />
             </button>
             
             {/* Mobile Logo Display */}
             <div className="lg:hidden flex items-center gap-2">
                <img 
                  src="/mnt/data/Gloov Up GLogo PNG.png" 
                  alt="Gloov Up" 
                  className="h-8 w-auto object-contain"
                />
                <span className="text-lg font-display font-bold text-white tracking-tight">Gloov Up</span>
             </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center bg-neutral-900 px-3 py-1.5 rounded-full border border-neutral-800 focus-within:border-brand transition-colors w-64">
              <Search className="w-4 h-4 text-neutral-500 mr-2" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none focus:ring-0 text-sm text-white placeholder-neutral-500 w-full"
              />
            </div>

            <div className="relative cursor-pointer group">
              <Bell className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand rounded-full"></span>
            </div>
            
            <div className="flex items-center gap-3 pl-6 border-l border-neutral-800">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-white leading-none">{USERS[0].name}</p>
                <p className="text-xs text-neutral-500 mt-1">{USERS[0].role}</p>
              </div>
              <img src={USERS[0].avatar} alt="Profile" className="w-10 h-10 rounded-full border-2 border-brand-surface" />
            </div>
          </div>
        </header>

        {/* Main Content Scroll Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;