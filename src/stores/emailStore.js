import { create } from 'zustand';
import { validateEmail } from '../utils/validation/emailValidator';

export const useEmailStore = create((set) => ({
  emails: [],
  validating: false,
  progress: 0,
  
  addEmails: (newEmails) =>
    set((state) => ({
      emails: [
        ...state.emails,
        ...newEmails
          .filter(email => typeof email === 'string' && validateEmail(email))
          .map(email => ({
            email,
            status: 'pending',
            isValid: null,
            errorType: null,
            domain: email.split('@')[1]
          }))
      ]
    })),
    
  updateEmail: (email, updates) =>
    set((state) => ({
      emails: state.emails.map((e) =>
        e.email === email ? { ...e, ...updates } : e
      )
    })),
    
  setValidating: (validating) => set({ validating }),
  setProgress: (progress) => set({ progress }),
  
  clearEmails: () => set({ emails: [], progress: 0, validating: false })
}));