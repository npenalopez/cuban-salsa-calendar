import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from "sonner";

interface PasswordProtectionProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title: string;
  description: string;
}

const REQUIRED_PASSWORD = "nestitin021*";

export function PasswordProtection({ 
  isOpen, 
  onClose, 
  onSuccess, 
  title, 
  description 
}: PasswordProtectionProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 300));

    if (password === REQUIRED_PASSWORD) {
      toast.success("🔓 Welcome! Access granted to festival management", {
        duration: 2000,
        position: "bottom-right"
      });
      setPassword("");
      setIsLoading(false);
      onClose();
      onSuccess();
    } else {
      toast.error("🔒 Incorrect password. Please check your credentials and try again.", {
        duration: 3000,
        position: "bottom-right"
      });
      setPassword("");
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPassword("");
    setShowPassword(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white border border-gray-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-gray-700" />
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="pr-10 border-gray-300 focus:border-gray-500"
              autoFocus
              disabled={isLoading}
              aria-label="Admin password input"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded hover:bg-gray-100"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!password || isLoading}
              className="px-3 py-2 text-sm bg-gray-800 hover:bg-gray-900 text-white rounded disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin h-3 w-3 border border-white border-t-transparent rounded-full mr-2 inline-block" />
                  Verifying...
                </>
              ) : (
                'Grant Access'
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}