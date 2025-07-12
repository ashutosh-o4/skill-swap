import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/Header";
import { User, ArrowRight, Clock, Check, X, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import avatarPlaceholder from "@/assets/avatar-placeholder.png";
import { swapService } from "@/lib/swapService";
import { userService } from "@/lib/userService";

export default function RequestsPage({ user, onLogout }) {
  const [filter, setFilter] = useState("all");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load swap requests
  useEffect(() => {
    const loadRequests = async () => {
      try {
        setLoading(true);
        const receivedRequests = await swapService.getSwapRequestsByToUser(user.id);
        
        // Enrich requests with user data
        const enrichedRequests = await Promise.all(
          receivedRequests.map(async (request) => {
            try {
              const fromUser = await userService.getUserById(request.fromUserId);
              return {
                ...request,
                fromUser: {
                  id: fromUser.id,
                  name: fromUser.name,
                  avatar: fromUser.profilePhoto
                }
              };
            } catch (error) {
              console.error('Error loading user data:', error);
              return {
                ...request,
                fromUser: {
                  id: request.fromUserId,
                  name: 'Unknown User',
                  avatar: ''
                }
              };
            }
          })
        );
        
        setRequests(enrichedRequests);
        setError(null);
      } catch (err) {
        console.error('Error loading requests:', err);
        setError('Failed to load requests');
        toast({
          title: "Error",
          description: "Failed to load requests. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      loadRequests();
    }
  }, [user?.id]);

  const filteredRequests = requests.filter(request => {
    if (filter === "all") return true;
    return request.status === filter;
  });

  const handleAccept = async (requestId) => {
    try {
      await swapService.acceptSwapRequest(requestId);
      
      setRequests(prev => 
        prev.map(req => 
          req.id === requestId ? { ...req, status: "ACCEPTED" } : req
        )
      );
      
      const request = requests.find(r => r.id === requestId);
      toast({
        title: "Request Accepted!",
        description: `You've accepted ${request?.fromUser.name}'s skill swap request.`,
      });
    } catch (error) {
      console.error('Error accepting request:', error);
      toast({
        title: "Error",
        description: "Failed to accept request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (requestId) => {
    try {
      await swapService.rejectSwapRequest(requestId);
      
      setRequests(prev => 
        prev.map(req => 
          req.id === requestId ? { ...req, status: "REJECTED" } : req
        )
      );
      
      const request = requests.find(r => r.id === requestId);
      toast({
        title: "Request Rejected",
        description: `You've rejected ${request?.fromUser.name}'s skill swap request.`,
      });
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast({
        title: "Error",
        description: "Failed to reject request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="outline" className="text-orange-600 border-orange-600"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "ACCEPTED":
        return <Badge variant="default" className="bg-success text-success-foreground"><Check className="w-3 h-3 mr-1" />Accepted</Badge>;
      case "REJECTED":
        return <Badge variant="destructive"><X className="w-3 h-3 mr-1" />Rejected</Badge>;
      case "COMPLETED":
        return <Badge variant="default" className="bg-blue-600"><Check className="w-3 h-3 mr-1" />Completed</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={onLogout} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Skill Swap Requests</h1>
          <p className="text-muted-foreground">Manage incoming requests from other users</p>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter requests" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Requests</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading requests...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive text-lg">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline" 
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          ) : filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={request.fromUser.avatar || avatarPlaceholder} />
                      <AvatarFallback>
                        <User className="w-6 h-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{request.fromUser.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Requested on {formatDate(request.createdAt)}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(request.status)}
                </div>

                {/* Skill Swap Summary */}
                <div className="flex items-center justify-center mb-4 p-4 bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <Badge variant="secondary" className="mb-1">They Offer</Badge>
                    <p className="font-medium">{request.skillOffered}</p>
                  </div>
                  <ArrowRight className="mx-6 text-muted-foreground" />
                  <div className="text-center">
                    <Badge variant="outline" className="mb-1">You Offer</Badge>
                    <p className="font-medium">{request.skillWanted}</p>
                  </div>
                </div>

                {/* Message */}
                {request.message && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Message:</h4>
                    <p className="text-muted-foreground italic bg-muted/30 p-3 rounded">
                      "{request.message}"
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                {request.status === "PENDING" && (
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => handleAccept(request.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Accept
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleReject(request.id)}
                      className="flex-1"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {filter === "all" 
                  ? "No skill swap requests yet." 
                  : `No ${filter} requests found.`
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}