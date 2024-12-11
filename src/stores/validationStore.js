import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const defaultSettings = {
  syntax: {
    enabled: true
  },
  mx: {
    enabled: true
  },
  smtp: {
    enabled: true
  },
  catchAll: {
    enabled: false
  },
  roleBased: {
    enabled: true
  },
  disposable: {
    enabled: true
  },
  typo: {
    enabled: true
  },
  batch: {
    size: 50,
    concurrency: 5,
    retryAttempts: 3
  },
  cache: {
    enabled: true,
    duration: 60 // minutes
  },
  timeout: 10,
  retryAttempts: 2
};

export const useValidationStore = create(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (key, value) =>
        set((state) => ({
          settings: {
            ...state.settings,
            [key]: typeof value === 'object'
              ? { ...state.settings[key], ...value }
              : value
          }
        })),
      resetSettings: () => set({ settings: defaultSettings }),
      loadPreset: (name) => set((state) => ({
        settings: state.presets?.[name] || defaultSettings
      })),
      savePreset: (name) => set((state) => ({
        presets: {
          ...state.presets,
          [name]: state.settings
        }
      }))
    }),
    {
      name: 'validation-settings',
      version: 1
    }
  )
);