import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function SwapRequestModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  targetUser, 
  currentUserSkills 
}) {
  const [skillOffered, setSkillOffered] = useState("");
  const [skillWanted, setSkillWanted] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (skillOffered && skillWanted) {
      onSubmit({
        skillOffered,
        skillWanted,
        message
      });
      // Reset form
      setSkillOffered("");
      setSkillWanted("");
      setMessage("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Request Skill Swap with {targetUser.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="skill-offered">Your skill to offer</Label>
            <Select value={skillOffered} onValueChange={setSkillOffered}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Choose a skill you offer" />
              </SelectTrigger>
              <SelectContent>
                {currentUserSkills.map((skill) => (
                  <SelectItem key={skill} value={skill}>
                    {skill}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="skill-wanted">Skill you want from them</Label>
            <Select value={skillWanted} onValueChange={setSkillWanted}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Choose a skill they offer" />
              </SelectTrigger>
              <SelectContent>
                {targetUser.skillsWanted.map((skill) => (
                  <SelectItem key={skill} value={skill}>
                    {skill}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="message">Optional message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a personal message..."
              className="mt-1 resize-none"
              rows={3}
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!skillOffered || !skillWanted}
              className="flex-1"
            >
              Submit Request
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}