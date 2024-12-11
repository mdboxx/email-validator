import { useState, useCallback } from 'react';
import { validateEmail } from '../services/api';
import { useEmailStore } from '../stores/emailStore';
import { parseEmailFile } from '../utils/fileParser';
import toast from 'react-hot-toast';

export function useBulkValidation() {
  const [isValidating, setIsValidating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    processed: 0,
    valid: 0,
    invalid: 0,
    estimatedTimeRemaining: null
  });

  const { addEmails, updateEmail } = useEmailStore();

  const startValidation = async (file) => {
    try {
      setIsValidating(true);
      setProgress(0);
      setStats({
        total: 0,
        processed: 0,
        valid: 0,
        invalid: 0,
        estimatedTimeRemaining: null
      });

      const emails = await parseEmailFile(file);
      if (!emails.length) {
        throw new Error('No valid emails found in file');
      }

      // Add emails to store initially as pending
      addEmails(emails);

      // Process emails one by one
      let processed = 0;
      let valid = 0;
      let invalid = 0;

      for (const email of emails) {
        if (isPaused) {
          await new Promise(resolve => {
            const checkPause = () => {
              if (!isPaused) {
                resolve();
              } else {
                setTimeout(checkPause, 100);
              }
            };
            checkPause();
          });
        }

        const result = await validateEmail(email);
        processed++;
        
        // Update individual email status
        updateEmail(email, {
          status: 'completed',
          isValid: result.isValid,
          errorType: result.isValid ? null : result.errors[0],
          details: result.details
        });

        // Update stats
        if (result.isValid) {
          valid++;
        } else {
          invalid++;
        }

        const newProgress = (processed / emails.length) * 100;
        setProgress(newProgress);
        setStats({
          total: emails.length,
          processed,
          valid,
          invalid,
          estimatedTimeRemaining: calculateEstimatedTime(processed, emails.length)
        });
      }

      toast.success('Validation completed successfully');
      return { total: emails.length, processed, valid, invalid };
    } catch (error) {
      toast.error(error.message || 'Validation failed');
      throw error;
    } finally {
      setIsValidating(false);
      setIsPaused(false);
    }
  };

  const calculateEstimatedTime = (processed, total) => {
    if (processed === 0) return null;
    const averageTimePerEmail = Date.now() / processed;
    return averageTimePerEmail * (total - processed);
  };

  const stopValidation = useCallback(() => {
    setIsValidating(false);
    setIsPaused(false);
    setProgress(0);
    setStats({
      total: 0,
      processed: 0,
      valid: 0,
      invalid: 0,
      estimatedTimeRemaining: null
    });
    toast.success('Validation stopped');
  }, []);

  const pauseValidation = useCallback(() => {
    setIsPaused(true);
    toast.success('Validation paused');
  }, []);

  const resumeValidation = useCallback(() => {
    setIsPaused(false);
    toast.success('Validation resumed');
  }, []);

  return {
    startValidation,
    stopValidation,
    pauseValidation,
    resumeValidation,
    isValidating,
    isPaused,
    progress,
    stats
  };
}