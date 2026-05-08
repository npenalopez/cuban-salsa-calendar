// Internationalization utilities and types
export type SupportedLanguage = 'en' | 'de' | 'es' | 'fr' | 'pl';

export interface Currency {
  code: string;
  symbol: string;
  rate: number; // Rate relative to EUR (base currency)
}

export const SUPPORTED_LANGUAGES: Record<SupportedLanguage, { 
  name: string; 
  nativeName: string; 
  currency: Currency;
}> = {
  en: { 
    name: 'English', 
    nativeName: 'English', 
    currency: { code: 'USD', symbol: '$', rate: 1.08 }
  },
  de: { 
    name: 'German', 
    nativeName: 'Deutsch', 
    currency: { code: 'EUR', symbol: '€', rate: 1.0 }
  },
  es: { 
    name: 'Spanish', 
    nativeName: 'Español', 
    currency: { code: 'EUR', symbol: '€', rate: 1.0 }
  },
  fr: { 
    name: 'French', 
    nativeName: 'Français', 
    currency: { code: 'EUR', symbol: '€', rate: 1.0 }
  },
  pl: { 
    name: 'Polish', 
    nativeName: 'Polski', 
    currency: { code: 'PLN', symbol: 'zł', rate: 4.35 }
  }
};

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

export const formatCurrency = (
  amount: number, 
  fromCurrency: string = 'EUR',
  targetLanguage: SupportedLanguage = 'en'
): string => {
  try {
    const langConfig = SUPPORTED_LANGUAGES[targetLanguage];
    const targetCurrency = langConfig.currency;
    
    // Convert from base currency (EUR) to target currency
    let convertedAmount = amount;
    if (fromCurrency === 'EUR' && targetCurrency.code !== 'EUR') {
      convertedAmount = amount * targetCurrency.rate;
    } else if (fromCurrency !== 'EUR' && targetCurrency.code === 'EUR') {
      // Convert from other currency to EUR (reverse calculation)
      const fromRate = Object.values(SUPPORTED_LANGUAGES)
        .find(lang => lang.currency.code === fromCurrency)?.currency.rate || 1;
      convertedAmount = amount / fromRate;
    }
    
    // Format according to locale
    const locale = targetLanguage === 'en' ? 'en-US' : 
                   targetLanguage === 'de' ? 'de-DE' :
                   targetLanguage === 'es' ? 'es-ES' :
                   targetLanguage === 'fr' ? 'fr-FR' :
                   'pl-PL';
    
    if (typeof Intl !== 'undefined') {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: targetCurrency.code,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(Math.round(convertedAmount));
    } else {
      // Fallback for environments without Intl
      return `${targetCurrency.symbol}${Math.round(convertedAmount)}`;
    }
  } catch (error) {
    console.warn('Currency formatting error:', error);
    return `€${amount}`;
  }
};