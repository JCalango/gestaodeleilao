
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { VistoriaProvider } from "@/contexts/VistoriaContext";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthGuard from "@/components/Auth/AuthGuard";
import MainLayout from "@/components/Layout/MainLayout";
import Dashboard from "@/pages/Dashboard";
import InspectionsList from "@/pages/InspectionsList";
import InspectionDetails from "@/pages/InspectionDetails";
import NewVistoria from "@/pages/NewVistoria";
import EditVistoria from "@/pages/EditVistoria";
import UsersManagement from "@/pages/UsersManagement";
import Settings from "@/pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthGuard>
            <VistoriaProvider>
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/inspections" element={<InspectionsList />} />
                  <Route path="/inspections/:id" element={<InspectionDetails />} />
                  <Route path="/inspections/new" element={<NewVistoria />} />
                  <Route path="/inspections/edit/:id" element={<EditVistoria />} />
                  <Route path="/users" element={<UsersManagement />} />
                  <Route path="/settings" element={<Settings />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </MainLayout>
            </VistoriaProvider>
          </AuthGuard>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
