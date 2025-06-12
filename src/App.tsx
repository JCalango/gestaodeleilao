
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { InspectionProvider } from "@/contexts/InspectionContext";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthGuard from "@/components/Auth/AuthGuard";
import MainLayout from "@/components/Layout/MainLayout";
import Dashboard from "@/pages/Dashboard";
import InspectionsList from "@/pages/InspectionsList";
import UsersManagement from "@/pages/UsersManagement";
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
            <InspectionProvider>
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/inspections" element={<InspectionsList />} />
                  <Route path="/users" element={<UsersManagement />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </MainLayout>
            </InspectionProvider>
          </AuthGuard>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
