import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Header } from "@/components/Header";
import { X, Plus, User, Upload, Camera, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import avatarPlaceholder from "@/assets/avatar-placeholder.png";
import { userService } from "@/lib/userService";

export default function ProfilePage({ user, onUpdateUser, onLogout }) {
  const [formData, setFormData] = useState({
    name: user.name,
    location: user.location || "",
    availability: user.availability ? user.availability.join(', ') : "",
    isPublic: user.publicProfile || false
  });
  
  const [skillsOffered, setSkillsOffered] = useState(user.skillsOffered || []);
  const [skillsWanted, setSkillsWanted] = useState(user.skillsWanted || []);
  const [newSkillOffered, setNewSkillOffered] = useState("");
  const [newSkillWanted, setNewSkillWanted] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleAddSkillOffered = () => {
    if (newSkillOffered.trim() && !skillsOffered.includes(newSkillOffered.trim())) {
      setSkillsOffered([...skillsOffered, newSkillOffered.trim()]);
      setNewSkillOffered("");
      setHasChanges(true);
    }
  };

  const handleRemoveSkillOffered = (skill) => {
    setSkillsOffered(skillsOffered.filter(s => s !== skill));
    setHasChanges(true);
  };

  const handleAddSkillWanted = () => {
    if (newSkillWanted.trim() && !skillsWanted.includes(newSkillWanted.trim())) {
      setSkillsWanted([...skillsWanted, newSkillWanted.trim()]);
      setNewSkillWanted("");
      setHasChanges(true);
    }
  };

  const handleRemoveSkillWanted = (skill) => {
    setSkillsWanted(skillsWanted.filter(s => s !== skill));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const userData = {
        name: formData.name,
        location: formData.location,
        availability: formData.availability.split(',').map(item => item.trim()).filter(item => item),
        skillsOffered,
        skillsWanted,
        publicProfile: formData.isPublic,
        about: user.about || ""
      };

      const updatedUser = await userService.updateUser(user.id, userData);
      
      onUpdateUser(updatedUser);
      setHasChanges(false);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setFormData({
      name: user.name || "",
      location: user.location || "",
      availability: user.availability ? user.availability.join(', ') : "",
      isPublic: user.publicProfile || false
    });
    setSkillsOffered(user.skillsOffered || []);
    setSkillsWanted(user.skillsWanted || []);
    setHasChanges(false);
  };

  const handleUploadPhoto = () => {
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const updatedUser = {
            ...user,
            avatar: e.target.result
          };
          onUpdateUser(updatedUser);
          toast({
            title: "Profile Picture Updated",
            description: "Your profile picture has been updated successfully.",
          });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={onLogout} />
      
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Profile Photo */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="w-20 h-20 cursor-pointer group" onClick={handleUploadPhoto}>
                  <AvatarImage src={user.avatar || avatarPlaceholder} />
                  <AvatarFallback>
                    <User className="w-10 h-10" />
                  </AvatarFallback>
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </Avatar>
              </div>
              <div>
                <Button variant="outline" onClick={handleUploadPhoto}>
                  <Upload className="w-4 h-4 mr-2" />
                  Change Photo
                </Button>
                <p className="text-sm text-muted-foreground mt-1">
                  Click avatar or button to update
                </p>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="City, State"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                />
              </div>
            </div>

            {/* Skills Offered */}
            <div>
              <Label>Skills Offered</Label>
              <div className="flex flex-wrap gap-2 mt-2 mb-3">
                {skillsOffered.map((skill) => (
                  <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-destructive" 
                      onClick={() => handleRemoveSkillOffered(skill)}
                    />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill you can teach"
                  value={newSkillOffered}
                  onChange={(e) => setNewSkillOffered(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSkillOffered()}
                />
                <Button onClick={handleAddSkillOffered} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Skills Wanted */}
            <div>
              <Label>Skills Wanted</Label>
              <div className="flex flex-wrap gap-2 mt-2 mb-3">
                {skillsWanted.map((skill) => (
                  <Badge key={skill} variant="outline" className="flex items-center gap-1">
                    {skill}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-destructive" 
                      onClick={() => handleRemoveSkillWanted(skill)}
                    />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill you want to learn"
                  value={newSkillWanted}
                  onChange={(e) => setNewSkillWanted(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSkillWanted()}
                />
                <Button onClick={handleAddSkillWanted} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Availability */}
            <div>
              <Label htmlFor="availability">Availability</Label>
              <Textarea
                id="availability"
                placeholder="When are you available for skill swaps? (e.g., weekends, evenings after 6pm)"
                value={formData.availability}
                onChange={(e) => handleInputChange("availability", e.target.value)}
                rows={3}
              />
            </div>

            {/* Profile Visibility */}
            <div className="flex items-center justify-between">
              <div>
                <Label>Profile Visibility</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Make your profile visible to other users
                </p>
              </div>
              <Switch
                checked={formData.isPublic}
                onCheckedChange={(checked) => handleInputChange("isPublic", checked)}
              />
            </div>

            {/* Action Buttons */}
            {hasChanges && (
              <div className="flex space-x-3 pt-4 border-t">
                <Button 
                  onClick={handleSave} 
                  className="flex-1"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleDiscard}
                  className="flex-1"
                  disabled={saving}
                >
                  Discard
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}