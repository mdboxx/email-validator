import { useState } from 'react';
import { validateEmail } from '../services/api';
import toast from 'react-hot-toast';

export function useEmailValidation() {
  const [isValidating, setIsValidating] = useState(false);
  const [result, setResult] = useState(null);

  const validate = async (email) => {
    try {
      setIsValidating(true);
      const response = await validateEmail(email);
      setResult(response);
      return response;
    } catch (error) {
      toast.error(error.message || 'Validation failed');
      throw error;
    } finally {
      setIsValidating(false);
    }
  };

  const reset = () => {
    setResult(null);
    setIsValidating(false);
  };

  return {
    validate,
    reset,
    isValidating,
    result
  };
}