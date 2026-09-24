import React, { useState, useRef, useEffect } from 'react';
import { Languages, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SupportedLanguage } from '../lib/translations';

interface LanguageSelectorProps {
  variant?: 'header' | 'inline' | 'compact';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'header',
  className = '',
}) => {
  const { language, setLanguage, languages, currentLanguageInfo } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: SupportedLanguage) => {
    setLanguage(code);
    setIsOpen(false);
  };

  if (variant === 'compact') {
    return (
      <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200/80 border border-stone-200 transition-colors focus:outline-hidden"
          title="Change language"
        >
          <Languages className="w-3.5 h-3.5 text-stone-600" />
          <span>{currentLanguageInfo.nativeName}</span>
          <ChevronDown className={`w-3 h-3 text-stone-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 z-50 max-h-64 overflow-y-auto">
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Indian Languages
            </div>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-stone-50 transition-colors ${
                  language === lang.code ? 'font-bold text-sky-800 bg-sky-50/70' : 'text-stone-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{lang.flag}</span>
                  <span className="font-medium">{lang.nativeName}</span>
                  <span className="text-[11px] text-stone-400">({lang.name})</span>
                </div>
                {language === lang.code && <Check className="w-3.5 h-3.5 text-sky-700" />}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        id="language-selector-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-700 bg-stone-50 hover:bg-stone-100 border border-stone-200 transition-colors shadow-2xs hover:border-stone-300 min-h-[36px]"
      >
        <Languages className="w-3.5 h-3.5 text-sky-800" />
        <span className="flex items-center gap-1.5">
          <span>{currentLanguageInfo.flag}</span>
          <span className="font-bold text-stone-900">{currentLanguageInfo.nativeName}</span>
        </span>
        <ChevronDown className={`w-3 h-3 text-stone-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 max-h-80 overflow-y-auto">
          <div className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400 border-b border-stone-100 mb-1">
            Select Language • ಭಾರತೀಯ ಭಾಷೆಗಳು
          </div>
          {languages.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                id={`lang-opt-${lang.code}`}
                onClick={() => handleSelect(lang.code)}
                className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'font-bold text-sky-800 bg-sky-50'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{lang.flag}</span>
                  <div>
                    <div className="font-semibold text-stone-900 leading-tight">
                      {lang.nativeName}
                    </div>
                    <div className="text-[10px] text-stone-400 leading-none mt-0.5">
                      {lang.name}
                    </div>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-sky-700 font-bold" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
