import { Outlet, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Scissors,
  LogOut,
  Shield,
  User,
  ChevronDown,
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
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 shadow-sm">
          <h2 className="text-gray-500 text-sm font-medium">Área Administrativa</h2>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-4 hover:bg-gray-50 p-2 rounded-md transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gold-100 border border-gold-200 flex items-center justify-center text-gold-700 font-serif font-bold text-xs">
                {user?.name?.charAt(0) || 'JL'}
              </div>
              <div className="text-left hidden md:block">
                <span className="block text-sm font-medium text-midnight-900 leading-none">
                  {user?.name || 'Administrador'}
                </span>
                <span className="text-xs text-gray-500">Gestor</span>
              </div>
              <ChevronDown size={14} className="text-gray-400" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-100 py-1 z-20">
                  <NavLink
                    to="/admin/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-midnight-900"
                  >
                    <User size={16} />
                    Meu Perfil
                  </NavLink>
                  <div className="h-px bg-gray-100 my-1" />
                  <button
                    onClick={signOut}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 text-left"
                  >
                    <LogOut size={16} />
                    Sair
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
