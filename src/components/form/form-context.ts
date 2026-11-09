import { createContext } from 'react';

export interface FormErrorContext {
  errors: Record<string, string | undefined>;
  errorId(name: string): string;
}

export const FormContext = createContext<FormErrorContext | null>(null);
