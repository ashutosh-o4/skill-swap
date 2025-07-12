import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { UserCard } from "@/components/UserCard";
import { SwapRequestModal } from "@/components/SwapRequestModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Search, Filter, Users, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { userService } from "@/lib/userService";
import { swapService } from "@/lib/swapService";

export default function HomePage({ user, onLogout }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showProfiles, setShowProfiles] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const profilesPerPage = 3;

  // Load users from API
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const allUsers = await userService.getAllUsers();
        setUsers(allUsers);
        setError(null);
      } catch (err) {
        console.error('Error loading users:', err);
        setError('Failed to load users');
        toast({
          title: "Error",
          description: "Failed to load users. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Loading animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingComplete(true);
      setTimeout(() => setShowProfiles(true), 500);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Filter users based on search and availability
  const filteredUsers = users.filter(u => {
    const matchesSearch = searchTerm === "" || 
      u.skillsOffered.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      u.skillsWanted.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      u.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAvailability = availabilityFilter === "" || availabilityFilter === "all" || 
      u.availability.some(avail => avail.toLowerCase().includes(availabilityFilter.toLowerCase()));
    
    return matchesSearch && matchesAvailability;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / profilesPerPage);
  const startIndex = (currentPage - 1) * profilesPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + profilesPerPage);

  const handleRequest = (userId) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to request skill swaps.",
      });
      navigate('/login');
      return;
    }
    
    const targetUser = users.find(u => u.id === userId);
    if (targetUser) {
      setSelectedUser(targetUser);
      setIsRequestModalOpen(true);
    }
  };

  const handleViewProfile = (userId) => {
    navigate(`/user/${userId}`);
  };

  const handleSubmitRequest = async (request) => {
    try {
      const swapRequest = {
        fromUserId: user.id,
        toUserId: selectedUser.id,
        skillOffered: request.skillOffered,
        skillWanted: request.skillWanted,
        message: request.message
      };

      await swapService.createSwapRequest(swapRequest);
      
      toast({
        title: "Request Sent!",
        description: `Your skill swap request has been sent to ${selectedUser?.name}.`,
      });
      
      setIsRequestModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error creating swap request:', error);
      toast({
        title: "Error",
        description: "Failed to send request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Loading screen component
  if (!loadingComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="text-center space-y-8">
          <div className="relative">
            <Users className="w-20 h-20 mx-auto text-primary animate-pulse" />
            <Sparkles className="w-6 h-6 absolute -top-2 -right-2 text-primary animate-bounce" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Skill Swap Platform
            </h1>
            <p className="text-xl text-muted-foreground animate-fade-in">
              Connecting learners and teachers worldwide
            </p>
            <div className="flex items-center justify-center space-x-2 mt-6">
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:0.1s]"></div>
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header user={user} onLogout={onLogout} />
      
      <div className="container mx-auto px-4 py-8">
        {!showProfiles ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-6 fade-in">
              <div className="bounce-in">
                <h2 className="heading-responsive font-bold gradient-text mb-4">
                  Welcome to Skill Exchange!
                </h2>
                <p className="text-responsive text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Discover amazing people to learn with and share your expertise
                </p>
              </div>
              <div className="flex justify-center">
                <ArrowRight className="w-12 h-12 text-primary animate-bounce" />
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Hero Section */}
            <div className="text-center mb-12 fade-in">
              <h1 className="heading-responsive font-bold gradient-text mb-4">
                Find Your Perfect Skill Swap Partner
              </h1>
              <p className="text-responsive text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Connect with talented individuals who want to learn what you know and teach you what they know
              </p>
            </div>

            {/* Filters */}
            <div className="mb-8 space-y-4 slide-in">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex-1 w-full sm:max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search by skills, name, or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 form-input"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                    <SelectTrigger className="w-48 form-input">
                      <SelectValue placeholder="Filter by availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Availability</SelectItem>
                      <SelectItem value="weekends">Weekends</SelectItem>
                      <SelectItem value="evenings">Evenings</SelectItem>
                      <SelectItem value="weekdays">Weekdays</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{filteredUsers.length} users available</span>
                </div>
                <div className="w-px h-4 bg-border"></div>
                <div className="flex items-center space-x-1">
                  <Sparkles className="w-4 h-4" />
                  <span>Ready to swap skills</span>
                </div>
              </div>
            </div>

            {/* User Cards Grid - Landscape Layout */}
            <div className="space-y-6 mb-8">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center space-y-4">
                    <div className="loading-pulse">
                      <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                    </div>
                    <p className="text-muted-foreground">Discovering amazing people...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <div className="max-w-md mx-auto space-y-4">
                    <p className="text-destructive text-lg font-medium">{error}</p>
                    <Button 
                      onClick={() => window.location.reload()} 
                      variant="outline" 
                      className="btn-animate"
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              ) : currentUsers.length > 0 ? (
                <div className="space-y-6">
                  {currentUsers.map((userData, index) => (
                    <div 
                      key={userData.id} 
                      className="fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <UserCard
                        user={userData}
                        isLoggedIn={!!user}
                        onRequest={handleRequest}
                        onViewProfile={handleViewProfile}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="max-w-md mx-auto space-y-4">
                    <Users className="w-16 h-16 text-muted-foreground mx-auto" />
                    <h3 className="text-lg font-semibold text-muted-foreground">
                      No users found
                    </h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search criteria or check back later for new users.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination className="mt-8">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                        className={`btn-animate ${currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
                      />
                    </PaginationItem>
                    
                    {[...Array(totalPages)].map((_, index) => (
                      <PaginationItem key={index + 1}>
                        <PaginationLink
                          onClick={() => handlePageChange(index + 1)}
                          isActive={currentPage === index + 1}
                          className="cursor-pointer btn-animate"
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                        className={`btn-animate ${currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>

      {/* Swap Request Modal */}
      {selectedUser && (
        <SwapRequestModal
          isOpen={isRequestModalOpen}
          onClose={() => setIsRequestModalOpen(false)}
          onSubmit={handleSubmitRequest}
          targetUser={selectedUser}
          currentUserSkills={user?.skillsOffered || []}
        />
      )}
    </div>
  );
}