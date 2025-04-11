import { ReactNode, useEffect } from "react";
import { useLocation } from "wouter";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  redirectTo = "/admin/login" 
}: ProtectedRouteProps) {
  const [, navigate] = useLocation();
  
  // Check if the user is authenticated
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("admin_authenticated") === "true";
    
    if (!isAuthenticated) {
      navigate(redirectTo);
    }
  }, [navigate, redirectTo]);
  
  return <>{children}</>;
}