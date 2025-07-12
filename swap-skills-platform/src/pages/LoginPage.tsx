import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface LoginPageProps {
  onLogin: (user: any) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login delay
    setTimeout(() => {
      // Mock login - in real app, this would validate credentials
      const mockUser = {
        id: "current-user",
        name: "John Doe",
        email: email,
        skillsOffered: ["React", "TypeScript", "Node.js"],
        skillsWanted: ["Python", "Machine Learning", "DevOps"],
        location: "San Francisco, CA",
        availability: "Weekends and evenings",
        isPublic: true
      };

      onLogin(mockUser);
      setIsLoading(false);
      
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      
      navigate('/');
    }, 1000);
  };

  const handleForgotPassword = () => {
    toast({
      title: "Password Reset",
      description: "Password reset functionality would be implemented here.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
      <Header />
      
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="w-full max-w-md">
          <Card className="card-hover shadow-strong border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="space-y-2 text-center pb-6">
              <div className="bounce-in">
                <h1 className="heading-responsive font-bold gradient-text">
                  Welcome Back
                </h1>
                <p className="text-responsive text-muted-foreground">
                  Sign in to your Skill Swap account
                </p>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="form-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="form-input"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full btn-animate bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary shadow-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              <div className="text-center">
                <Button
                  variant="link"
                  onClick={handleForgotPassword}
                  className="text-sm btn-animate"
                >
                  Forgot your password?
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Button 
                    variant="link" 
                    className="p-0 h-auto font-normal text-primary hover:text-primary-hover btn-animate"
                  >
                    Sign up here
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Decorative elements */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-success/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}