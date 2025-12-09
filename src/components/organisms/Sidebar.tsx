import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Ticket, FileText, MessageSquare, Settings, LogOut, User } from 'lucide-react';

export const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Ticket, label: 'Tickets', path: '/tickets' },
    { icon: FileText, label: 'Invoices', path: '/invoices' },
    { icon: MessageSquare, label: 'Chat', path: '/chat' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const baseClasses = "fixed inset-y-0 left-0 z-50 w-64 bg-brand-surface border-r border-neutral-800 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0";
  const mobileClasses = isOpen ? "translate-x-0" : "-translate-x-full";

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`${baseClasses} ${mobileClasses}`}>
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="h-20 flex items-center px-6 border-b border-neutral-800 bg-brand-surface">
             <div className="flex items-center gap-3">
                <img 
                  src="/mnt/data/Gloov Up GLogo PNG.png" 
                  alt="Gloov Up" 
                  className="h-10 w-auto object-contain"
                />
                <span className="text-xl font-display font-bold tracking-tight text-white">Gloov Up</span>
             </div>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && onClose()}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand/10 text-brand'
                      : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* User Profile / Logout */}
          <div className="p-4 border-t border-neutral-800">
             <button className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-neutral-400 hover:text-white transition-colors">
               <LogOut className="w-5 h-5" />
               Sign Out
             </button>
          </div>
        </div>
      </aside>
    </>
  );
};