export * from './translations/types';
import { SupportedLanguage } from './translations/types';
import { en } from './translations/en';
import { hi } from './translations/hi';
import { ta } from './translations/ta';
import { te } from './translations/te';
import { kn } from './translations/kn';
import { ml } from './translations/ml';
import { bn } from './translations/bn';
import { mr } from './translations/mr';
import { gu } from './translations/gu';

export const translations: Record<SupportedLanguage, Record<string, string>> = {
  en,
  hi,
  ta,
  te,
  kn,
  ml,
  bn,
  mr,
  gu,
};
