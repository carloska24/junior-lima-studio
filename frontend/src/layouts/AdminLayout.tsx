import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, Scissors, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminLayout() {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Calendar, label: 'Agenda', path: '/admin/agenda' },
    { icon: Users, label: 'Clientes', path: '/admin/clients' },
    { icon: Scissors, label: 'Serviços', path: '/admin/services' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 text-midnight-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-midnight-900 text-white flex flex-col shadow-xl">
        <div className="p-8 border-b border-midnight-800">
          <h2 className="text-xl font-serif text-gold-500">Júnior Lima</h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Gestão</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'} // Exact match for root admin path
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 group',
                  isActive
                    ? 'bg-gold-500 text-midnight-900 font-medium shadow-md'
                    : 'text-gray-400 hover:bg-midnight-800 hover:text-white'
                )
              }
            >
              <item.icon size={20} className="shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-midnight-800">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-400 hover:text-red-400 transition-colors rounded-md hover:bg-midnight-800">
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 shadow-sm">
          <h2 className="text-gray-500 text-sm font-medium">Área Administrativa</h2>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-gold-100 border border-gold-200 flex items-center justify-center text-gold-700 font-serif font-bold text-xs">
              JL
            </div>
            <span className="text-sm font-medium text-midnight-900">Júnior Lima</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
