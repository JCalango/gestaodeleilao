import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient } from 'react-query';
import { Toaster } from "@/components/ui/toaster"

import { AuthProvider } from './contexts/AuthContext';
import { VistoriaProvider } from './contexts/VistoriaContext';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import InspectionsList from './pages/InspectionsList';
import InspectionDetails from './pages/InspectionDetails';
import NewVistoria from './pages/NewVistoria';
import EditVistoria from './pages/EditVistoria';
import Settings from './pages/Settings';
import UsersManagement from './pages/UsersManagement';
import MainLayout from './components/Layout/MainLayout';
import AuthGuard from './components/AuthGuard';
import NotFound from './pages/NotFound';
import Notifications from './pages/Notifications';

function App() {
  return (
    <QueryClient>
      <AuthProvider>
        <VistoriaProvider>
          <Toaster />
          <BrowserRouter>
            <AuthGuard>
              <Routes>
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="inspections" element={<InspectionsList />} />
                  <Route path="inspections/:id" element={<InspectionDetails />} />
                  <Route path="new-vistoria" element={<NewVistoria />} />
                  <Route path="edit-vistoria/:id" element={<EditVistoria />} />
                  <Route path="notifications" element={<Notifications />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="users" element={<UsersManagement />} />
                </Route>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthGuard>
          </BrowserRouter>
        </VistoriaProvider>
      </AuthProvider>
    </QueryClient>
  );
}

export default App;
