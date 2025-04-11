import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MobileMenu from "@/components/layout/mobile-menu";
import ProtectedRoute from "@/components/auth/protected-route";

import Home from "@/pages/home";
import AppointmentScheduler from "@/pages/appointment-scheduler";
import PatientInfo from "@/pages/patient-info";
import Confirmation from "@/pages/confirmation";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminLogin from "@/pages/admin/login";
import NotFound from "@/pages/not-found";
import { useState } from "react";

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <Header onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <main className="flex-grow">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/appointment" component={AppointmentScheduler} />
            <Route path="/patient-info" component={PatientInfo} />
            <Route path="/confirmation" component={Confirmation} />
            <Route path="/admin/login" component={AdminLogin} />
            <Route path="/admin/dashboard">
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            </Route>
            <Route path="/admin">
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            </Route>
            <Route component={NotFound} />
          </Switch>
        </main>
        <Footer />
      </div>
    </QueryClientProvider>
  );
}

export default App;
