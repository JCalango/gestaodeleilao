
import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import UserMenu from './UserMenu';

interface HeaderProps {
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, sidebarCollapsed }) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-blue-200 flex items-center justify-between px-6 z-40 shadow-sm">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
        >
          <Menu className="w-5 h-5" />
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="text-lg font-bold text-blue-700">
            Gestão de Leilão Guanambi
          </div>
        </div>
        
        <div className="relative w-96 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
          <Input
            placeholder="Buscar por placa, marca, modelo..."
            className="pl-10 bg-blue-50 border-blue-200 focus:border-blue-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative hover:bg-blue-50">
          <Bell className="w-5 h-5 text-blue-600" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </Button>
        
        <UserMenu />
      </div>
    </header>
  );
};

export default Header;
