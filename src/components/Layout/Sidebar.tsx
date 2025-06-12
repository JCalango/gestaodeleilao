
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Home, 
  Car, 
  Plus, 
  Search, 
  Settings, 
  BarChart3, 
  FileText 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isCollapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/' },
    { icon: Car, label: 'Inspeções', href: '/inspections' },
    { icon: Plus, label: 'Nova Inspeção', href: '/inspections/new' },
    { icon: Search, label: 'Buscar', href: '/search' },
    { icon: BarChart3, label: 'Relatórios', href: '/reports' },
    { icon: FileText, label: 'Documentos', href: '/documents' },
    { icon: Settings, label: 'Configurações', href: '/settings' },
  ];

  return (
    <div className={cn(
      'fixed left-0 top-0 h-full bg-slate-900 text-white transition-all duration-300 z-50',
      isCollapsed ? 'w-16' : 'w-64'
    )}>
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Car className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="font-bold text-lg">AuctionPro</h1>
              <p className="text-xs text-slate-400">Gestão de Leilões</p>
            </div>
          )}
        </div>
      </div>

      <nav className="mt-8">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors',
                isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
