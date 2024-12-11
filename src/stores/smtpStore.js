import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSmtpStore = create(
  persist(
    (set) => ({
      servers: [],
      addServer: (server) =>
        set((state) => ({
          servers: [
            ...state.servers,
            {
              ...server,
              id: `${server.host}:${server.port}`,
              addedAt: new Date().toISOString()
            }
          ]
        })),
      removeServer: (serverId) =>
        set((state) => ({
          servers: state.servers.filter((server) => server.id !== serverId)
        })),
      updateServer: (serverId, updates) =>
        set((state) => ({
          servers: state.servers.map((server) =>
            server.id === serverId ? { ...server, ...updates } : server
          )
        }))
    }),
    {
      name: 'smtp-settings'
    }
  )
);