import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage.jsx";
import RequestsPage from "./pages/RequestsPage.jsx";
import UserDetailPage from "./pages/UserDetailPage.jsx";
import NotFound from "./pages/NotFound";
import { ApiTest } from "./components/ApiTest";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<any>(null);

  const handleLogin = (userData: any) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleUpdateUser = (updatedUser: any) => {
    setUser(updatedUser);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={<HomePage user={user} onLogout={handleLogout} />} 
            />
            <Route 
              path="/login" 
              element={<LoginPage onLogin={handleLogin} />} 
            />
            <Route 
              path="/profile" 
              element={
                user ? (
                  <ProfilePage 
                    user={user} 
                    onUpdateUser={handleUpdateUser}
                    onLogout={handleLogout} 
                  />
                ) : (
                  <LoginPage onLogin={handleLogin} />
                )
              } 
            />
            <Route 
              path="/requests" 
              element={
                user ? (
                  <RequestsPage user={user} onLogout={handleLogout} />
                ) : (
                  <LoginPage onLogin={handleLogin} />
                )
              } 
            />
            <Route 
              path="/user/:userId" 
              element={<UserDetailPage user={user} onLogout={handleLogout} />} 
            />
            <Route path="/test" element={<ApiTest />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
