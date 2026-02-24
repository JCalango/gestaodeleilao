import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  FileText,
  Settings,
  Users,
  LogOut,
  Mail,
  Database,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth");
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  const menuItems = [
    { icon: BarChart3, label: "Dashboard", path: "/" },
    { icon: FileText, label: "Vistorias", path: "/inspections" },
    { icon: Mail, label: "Notificações", path: "/notifications" },
    { icon: FileText, label: "Config. Notificações", path: "/notification-settings" },
    { icon: Database, label: "Dados do Usuário", path: "/user-data-example" },
    { icon: Settings, label: "Configurações", path: "/settings" },
    { icon: Users, label: "Usuários", path: "/users" },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="p-0">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white border-blue-700">
        <SheetHeader>
          <SheetTitle className="text-white text-lg font-bold">
            Gestão de Leilão
          </SheetTitle>
          <SheetDescription className="text-blue-100">
            Navegue pelas opções do sistema.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="flex items-center space-x-3 py-3 px-4 rounded-md hover:bg-blue-700 hover:bg-opacity-50 transition-colors block text-white"
              onClick={onClose}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
          <Button
            variant="ghost"
            className="w-full justify-start mt-4 text-white hover:bg-blue-700 hover:bg-opacity-50"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sair
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;