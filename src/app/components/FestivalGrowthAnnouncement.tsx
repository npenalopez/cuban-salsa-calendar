import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { TrendingUp, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { CountryFlagIcon } from './CountryFlagIcon';

interface FestivalGrowthAnnouncementProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FestivalGrowthAnnouncement({ isOpen, onClose }: FestivalGrowthAnnouncementProps) {
  const { t } = useLanguage();

  const handleClose = () => {
    // Mark as dismissed in localStorage so it doesn't show again
    localStorage.setItem('festival-growth-announcement-dismissed', Date.now().toString());
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            <span>{t.growthAnnouncementTitle || 'Festival Collection Growing'}</span>
          </DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-4 pt-4">
              <div className="text-center">
                <div className="mb-4">
                  <span className="text-4xl font-bold text-foreground">39 → 70+</span>
                </div>
                <div className="text-base text-foreground mb-3">
                  {t.growthAnnouncementMessage || 
                    'We\'ve nearly doubled our festival collection! Discover more salsa festivals from around the world.'}
                </div>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <CountryFlagIcon country="Mexico" size={24} />
                  <CountryFlagIcon country="Costa Rica" size={24} />
                  <CountryFlagIcon country="United States" size={24} />
                  <CountryFlagIcon country="Israel" size={24} />
                  <CountryFlagIcon country="Norway" size={24} />
                </div>
                <div className="text-sm text-muted-foreground">
                  {t.growthAnnouncementSubtext || 
                    'Keep exploring to find your next dance adventure.'}
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center gap-3 pt-2">
          <Button
            onClick={handleClose}
            className="w-full"
          >
            {t.continue || 'Continue'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Hook to check if announcement should be shown
export function useFestivalGrowthAnnouncement() {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('festival-growth-announcement-dismissed');
    
    if (!dismissed) {
      // Show announcement after a short delay for better UX
      const timer = setTimeout(() => {
        setShouldShow(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setShouldShow(false);
  };

  return { shouldShow, handleClose };
}
