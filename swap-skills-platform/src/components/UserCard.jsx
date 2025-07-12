import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, User, MapPin, Clock, Sparkles } from "lucide-react";
import avatarPlaceholder from "@/assets/avatar-placeholder.png";

export function UserCard({ user, isLoggedIn, onRequest, onViewProfile }) {
  return (
    <Card className="card-hover group overflow-hidden border-0 shadow-soft hover:shadow-medium bg-gradient-to-br from-card to-card/50">
      <CardContent className="p-6">
        {/* Landscape Layout */}
        <div className="flex items-center space-x-6">
          {/* Left: Avatar */}
          <div className="flex-shrink-0">
            <Avatar 
              className="w-20 h-20 cursor-pointer avatar-hover shadow-medium" 
              onClick={() => onViewProfile(user.id)}
            >
              <AvatarImage src={user.avatar || avatarPlaceholder} />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10">
                <User className="w-10 h-10 text-primary" />
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Center: User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <h3 
                className="font-semibold text-xl text-card-foreground truncate cursor-pointer hover:text-primary transition-all duration-200 group-hover:scale-105"
                onClick={() => onViewProfile(user.id)}
              >
                {user.name}
                <Sparkles className="w-4 h-4 inline ml-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </h3>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{user.rating || 0}/5</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Location and Availability */}
              <div className="space-y-3">
                {user.location && (
                  <div className="flex items-center text-sm text-muted-foreground bg-muted/30 px-3 py-2 rounded-lg">
                    <MapPin className="w-4 h-4 mr-2 text-primary" />
                    <span className="font-medium">{user.location}</span>
                  </div>
                )}
                {user.availability && user.availability.length > 0 && (
                  <div className="flex items-center text-sm text-muted-foreground bg-muted/30 px-3 py-2 rounded-lg">
                    <Clock className="w-4 h-4 mr-2 text-primary" />
                    <span className="font-medium">{user.availability.join(', ')}</span>
                  </div>
                )}
              </div>

              {/* Skills */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2 flex items-center">
                    <span className="w-2 h-2 bg-success rounded-full mr-2"></span>
                    Skills Offered
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {user.skillsOffered && user.skillsOffered.map((skill, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="text-xs badge-animate hover:bg-success hover:text-success-foreground"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2 flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                    Skills Wanted
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {user.skillsWanted && user.skillsWanted.map((skill, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="text-xs badge-animate hover:bg-primary hover:text-primary-foreground hover:border-primary"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Action Button */}
          <div className="flex-shrink-0">
            <Button
              variant="default"
              size="lg"
              onClick={() => onRequest(user.id)}
              disabled={!isLoggedIn}
              className="px-8 btn-animate shadow-medium hover:shadow-strong bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary"
            >
              {isLoggedIn ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Request Swap
                </>
              ) : (
                'Login to Request'
              )}
            </Button>
          </div>
        </div>

        {/* Hover overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg"></div>
      </CardContent>
    </Card>
  );
}