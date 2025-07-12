import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Home, MessageSquare, Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

interface HeaderProps {
  user?: {
    name: string;
    avatar?: string;
  };
  onLogout?: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    closeMobileMenu();
  };

  return (
    <header className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-soft">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <h1 
            className="text-xl font-bold gradient-text cursor-pointer hover:opacity-80 transition-all duration-200 btn-animate"
            onClick={() => navigate('/')}
          >
            Skill Swap Platform
          </h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-3">
          {user ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className={`btn-animate ${location.pathname === '/' ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'}`}
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/requests')}
                className={`btn-animate ${location.pathname === '/requests' ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'}`}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Requests
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/profile')}
                className={`btn-animate ${location.pathname === '/profile' ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'}`}
              >
                <Avatar className="w-6 h-6 mr-2 avatar-hover">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                Profile
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="btn-animate hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate('/login')}
              className="btn-animate"
            >
              Login
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMobileMenu}
            className="btn-animate"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-card border-t border-border slide-in">
          <div className="container mx-auto px-4 py-4 space-y-3">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigation('/')}
                  className={`w-full justify-start btn-animate ${location.pathname === '/' ? 'bg-accent text-accent-foreground' : ''}`}
                >
                  <Home className="w-4 h-4 mr-3" />
                  Home
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigation('/requests')}
                  className={`w-full justify-start btn-animate ${location.pathname === '/requests' ? 'bg-accent text-accent-foreground' : ''}`}
                >
                  <MessageSquare className="w-4 h-4 mr-3" />
                  Requests
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigation('/profile')}
                  className={`w-full justify-start btn-animate ${location.pathname === '/profile' ? 'bg-accent text-accent-foreground' : ''}`}
                >
                  <Avatar className="w-6 h-6 mr-3 avatar-hover">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  Profile
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLogout}
                  className="w-full justify-start btn-animate hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => handleNavigation('/login')}
                className="w-full btn-animate"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}