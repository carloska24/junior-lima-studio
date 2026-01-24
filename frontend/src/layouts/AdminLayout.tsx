import { Outlet, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Scissors,
  LogOut,
  Shield,
  User,
  Settings,
  Image,
  Tag,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export function AdminLayout() {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Calendar, label: 'Agenda', path: '/admin/agenda' },
    { icon: Users, label: 'Clientes', path: '/admin/clients' },
    { icon: Scissors, label: 'Serviços', path: '/admin/services' },
    { icon: Image, label: 'Portfólio', path: '/admin/portfolio' },
    { icon: Tag, label: 'Categorias', path: '/admin/categories' },
    { icon: Shield, label: 'Usuários', path: '/admin/users' },
    { icon: Settings, label: 'Configurações', path: '/admin/settings' },
  ];

  const { signOut, user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
          <button
            onClick={signOut}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-400 hover:text-red-400 transition-colors rounded-md hover:bg-midnight-800"
          >
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 shadow-sm z-20 sticky top-0">
          <div>
            <h2 className="text-lg font-serif text-gray-400 font-normal">Área Administrativa</h2>
          </div>

          <div className="relative flex items-center gap-4">
            <div className="text-right hidden md:block">
              <span className="block text-sm font-medium text-midnight-900 leading-tight">
                {user?.name || 'Júnior Lima'}
              </span>
            </div>

            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="group relative focus:outline-none transition-transform active:scale-95 rounded-full"
            >
              <div className="relative">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover border border-gray-100 shadow-sm group-hover:shadow-md transition-all duration-200"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#FAFAFA] border border-[#F0F0F0] flex items-center justify-center group-hover:border-[#BFA15F]/30 transition-colors">
                    <span className="font-serif font-bold text-xl text-[#BFA15F]">JL</span>
                  </div>
                )}
              </div>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-30 animate-in fade-in slide-in-from-top-1 origin-top-right">
                  <div className="px-4 py-3 border-b border-gray-50 mb-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Conta
                    </p>
                    <p className="text-sm font-medium text-midnight-900 truncate mt-0.5">
                      {user?.email}
                    </p>
                  </div>

                  <NavLink
                    to="/admin/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-midnight-900 transition-colors"
                  >
                    <User size={16} />
                    <span>Meu Perfil</span>
                  </NavLink>

                  <div className="h-px bg-gray-50 my-1" />

                  <button
                    onClick={signOut}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 text-left transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Sair</span>
                  </button>
                </div>
              </>
            )}
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
