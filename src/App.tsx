import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster"

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { VistoriaProvider, useVistorias } from './contexts/VistoriaContext';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import InspectionsList from './pages/InspectionsList';
import InspectionDetails from './pages/InspectionDetails';
import NewVistoria from './pages/NewVistoria';
import EditVistoria from './pages/EditVistoria';
import Settings from './pages/Settings';
import UsersManagement from './pages/UsersManagement';
import MainLayout from './components/Layout/MainLayout';
import AuthGuard from './components/Auth/AuthGuard';
import NotFound from './pages/NotFound';
import Notifications from './pages/Notifications';
import NotificationSettings from './pages/NotificationSettings';
import { UserDataExample } from '@/examples/UserDataExample';

const queryClient = new QueryClient();

function AppRoutes() {
  const { user } = useAuth();
  const { refreshVistorias, isLoading, vistorias } = useVistorias();
  const [loadError, setLoadError] = React.useState<string | null>(null);

  useEffect(() => {
    if (user && !isLoading && vistorias.length === 0) {
      refreshVistorias().catch((err) => {
        setLoadError("Não foi possível carregar os dados. Tente novamente mais tarde.");
      });
    }
  }, [user, isLoading, vistorias.length, refreshVistorias]);

  if (loadError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-lg font-medium text-red-600">{loadError}</span>
      </div>
    );
  }

  if (isLoading && vistorias.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-lg font-medium text-slate-600">Carregando dados...</span>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/*" element={
          <AuthGuard>
            <MainLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/inspections" element={<InspectionsList />} />
                <Route path="/inspections/:id" element={<InspectionDetails />} />
                <Route path="/new-vistoria" element={<NewVistoria />} />
                <Route path="/edit-vistoria/:id" element={<EditVistoria />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/notification-settings" element={<NotificationSettings />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/users" element={<UsersManagement />} />
                <Route path="/inspections/edit/:id" element={<EditVistoria />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MainLayout>
          </AuthGuard>
        } />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <VistoriaProvider>
          <Toaster />
          <AppRoutes />
        </VistoriaProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
