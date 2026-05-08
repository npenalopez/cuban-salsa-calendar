import React from 'react';
import { Globe } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { useLanguage } from '../contexts/LanguageContext';
import { SUPPORTED_LANGUAGES } from '../utils/i18n';
import type { SupportedLanguage } from '../utils/i18n';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  
  // Safe access to current language with fallback
  const currentLanguage = SUPPORTED_LANGUAGES[language] || SUPPORTED_LANGUAGES.en;

  const handleLanguageChange = (newLanguage: string) => {
    try {
      setLanguage(newLanguage as SupportedLanguage);
    } catch (error) {
      console.warn('Failed to change language:', error);
    }
  };

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 border-gray-300 bg-white hover:bg-gray-50 language-selector-trigger"
            >
              <Globe className="h-3.5 w-3.5 text-gray-600" />
              <span className="sr-only">Change language</span>
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Language: {currentLanguage?.nativeName || 'English'}</p>
        </TooltipContent>
      </Tooltip>
      
      <DropdownMenuContent 
        align="end" 
        side="bottom"
        alignOffset={-8}
        sideOffset={4}
        className="w-56 max-w-[calc(100vw-2rem)] min-w-0 bg-white border border-gray-200 shadow-lg z-50 sm:w-56 sm:max-w-none language-selector-content"
        avoidCollisions={true}
        collisionPadding={8}
      >
        {Object.entries(SUPPORTED_LANGUAGES).map(([code, config]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleLanguageChange(code)}
            className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 cursor-pointer hover:bg-gray-50 min-w-0 ${
              language === code ? 'bg-gray-50 font-medium' : ''
            }`}
          >
            <span className="text-sm font-mono text-gray-500 w-5 sm:w-6 text-center flex-shrink-0">
              {code.toUpperCase()}
            </span>
            <div className="flex-1 min-w-0 overflow-hidden">
              <div className="font-medium text-gray-900 truncate">
                {config.nativeName}
              </div>
              <div className="text-sm text-gray-500 truncate">
                {config.name}
              </div>
            </div>
            <div className="text-xs text-gray-400 font-mono flex-shrink-0 hidden sm:block language-currency-info">
              {config.currency.symbol} {config.currency.code}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};