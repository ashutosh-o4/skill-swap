import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SwapRequestModal } from "@/components/SwapRequestModal";
import { Header } from "@/components/Header";
import { Star, User, MapPin, Clock, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import avatarPlaceholder from "@/assets/avatar-placeholder.png";
import { userService } from "@/lib/userService";
import { swapService } from "@/lib/swapService";

export default function UserDetailPage({ user, onLogout }) {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user data from API
  useEffect(() => {
    const loadUser = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const userData = await userService.getUserById(userId);
        setProfileUser(userData);
        setError(null);
      } catch (err) {
        console.error('Error loading user:', err);
        setError('User not found');
        toast({
          title: "Error",
          description: "Failed to load user profile.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={user} onLogout={onLogout} />
        <div className="container mx-auto px-4 py-16 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={user} onLogout={onLogout} />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
          <Button onClick={() => navigate('/')}>Return Home</Button>
        </div>
      </div>
    );
  }

  const handleRequest = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to request skill swaps.",
      });
      navigate('/login');
      return;
    }
    setIsRequestModalOpen(true);
  };

  const handleSubmitRequest = async (request) => {
    try {
      const swapRequest = {
        fromUserId: user.id,
        toUserId: profileUser.id,
        skillOffered: request.skillOffered,
        skillWanted: request.skillWanted,
        message: request.message
      };

      await swapService.createSwapRequest(swapRequest);
      
      toast({
        title: "Request Sent!",
        description: `Your skill swap request has been sent to ${profileUser.name}.`,
      });
      
      setIsRequestModalOpen(false);
    } catch (error) {
      console.error('Error creating swap request:', error);
      toast({
        title: "Error",
        description: "Failed to send request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={onLogout} />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Browse
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Card */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start space-x-6 mb-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profileUser.profilePhoto || avatarPlaceholder} />
                    <AvatarFallback>
                      <User className="w-12 h-12" />
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-2">{profileUser.name}</h1>
                    
                    <div className="flex items-center space-x-4 mb-4">
                      {profileUser.location && (
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="w-4 h-4 mr-1" />
                          {profileUser.location}
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{profileUser.rating || 0}/5</span>
                      </div>
                    </div>

                    {profileUser.availability && profileUser.availability.length > 0 && (
                      <div className="flex items-center text-muted-foreground mb-4">
                        <Clock className="w-4 h-4 mr-2" />
                        {profileUser.availability.join(', ')}
                      </div>
                    )}
                  </div>
                </div>

                {profileUser.about && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">About</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {profileUser.about}
                    </p>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Skills They Offer</h3>
                    <div className="flex flex-wrap gap-2">
                      {profileUser.skillsOffered && profileUser.skillsOffered.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Skills They Want to Learn</h3>
                    <div className="flex flex-wrap gap-2">
                      {profileUser.skillsWanted && profileUser.skillsWanted.map((skill, index) => (
                        <Badge key={index} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Start a Skill Swap</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Request a skill exchange with {profileUser.name}
                </p>
                <Button 
                  onClick={handleRequest}
                  className="w-full"
                  disabled={!user}
                >
                  {user ? 'Request Skill Swap' : 'Login to Request'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">Profile Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rating</span>
                    <span className="font-medium">{profileUser.rating || 0}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Skills Offered</span>
                    <span className="font-medium">{profileUser.skillsOffered?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Skills Wanted</span>
                    <span className="font-medium">{profileUser.skillsWanted?.length || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Swap Request Modal */}
      <SwapRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSubmit={handleSubmitRequest}
        targetUser={profileUser}
        currentUserSkills={user?.skillsOffered || []}
      />
    </div>
  );
}