
import React, { useState } from 'react';
import { HashRouter, Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import { Sidebar } from './components/organisms/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Tickets } from './pages/Tickets';
import { CreateTicket } from './pages/CreateTicket';
import { TicketDetail } from './pages/TicketDetail';
import { Chat } from './pages/Chat';
import { Invoices } from './pages/Invoices';
import { InvoiceDetail } from './pages/InvoiceDetail';
import ClientDetail from './pages/ClientDetail';
import { Settings } from './pages/Settings';
import Profile from './pages/Profile';
import { Bell, Search, Menu, LogOut } from 'lucide-react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SignIn } from './pages/auth/SignIn';
import { SignUp } from './pages/auth/SignUp';
import { ProtectedRoute } from './components/ProtectedRoute';

const NotFound = () => <div className="text-white text-2xl p-10">404 - Page Not Found</div>;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

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
            
            <div className="flex items-center gap-4 pl-6 border-l border-neutral-800">
              <Link to="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-white leading-none">{profile?.name || user?.email}</p>
                  <p className="text-xs text-neutral-500 mt-1">{profile?.role || 'User'}</p>
                </div>
                <img 
                  src={profile?.avatar || `https://ui-avatars.com/api/?name=${profile?.name || 'User'}&background=random`} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full border-2 border-brand-surface" 
                />
              </Link>
              <button 
                onClick={() => signOut()} 
                className="text-neutral-400 hover:text-white transition-colors"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
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
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          
          <Route path="/*" element={
            <ProtectedRoute>
              <Layout>
                <ErrorBoundary>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/tickets" element={<Tickets />} />
                    <Route path="/tickets/new" element={<CreateTicket />} />
                    <Route path="/tickets/:id" element={<TicketDetail />} />
                    <Route path="/invoices" element={<Invoices />} />
                    <Route path="/invoices/:id" element={<InvoiceDetail />} />
                    <Route path="/clients/:id" element={<ClientDetail />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </ErrorBoundary>
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
