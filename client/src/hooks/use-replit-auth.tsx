
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface ReplitUser {
  id: string;
  name: string;
  profileImage: string;
  bio: string;
  url: string;
  roles: string[];
  teams: string[];
}

export function useReplitAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery<ReplitUser | null>({
    queryKey: ['/api/user'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/user', {
          credentials: 'include'
        });
        if (response.status === 401) {
          return null;
        }
        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }
        return await response.json();
      } catch (error) {
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const downloadPdfMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/download-pdf');
      return await response.json();
    },
    onError: (error: any) => {
      console.error('PDF download failed:', error);
    }
  });

  const shareResultsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/share-results');
      return await response.json();
    },
    onError: (error: any) => {
      console.error('Share results failed:', error);
    }
  });

  const loginWithReplit = () => {
    const h = 500;
    const w = 350;
    const left = screen.width / 2 - w / 2;
    const top = screen.height / 2 - h / 2;

    const authWindow = window.open(
      `https://replit.com/auth_with_repl_site?domain=${location.host}`,
      '_blank',
      `modal=yes, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${top}, left=${left}`
    );

    const handleAuthComplete = (e: MessageEvent) => {
      if (e.data !== 'auth_complete') {
        return;
      }

      window.removeEventListener('message', handleAuthComplete);
      authWindow?.close();
      
      // Refresh user data
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    };

    window.addEventListener('message', handleAuthComplete);
  };

  const logout = () => {
    // Replit Auth doesn't have a logout endpoint, but we can clear our cache
    queryClient.setQueryData(['/api/user'], null);
    window.location.reload();
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    loginWithReplit,
    logout,
    downloadPdf: downloadPdfMutation.mutate,
    shareResults: shareResultsMutation.mutate,
    isDownloadingPdf: downloadPdfMutation.isPending,
    isSharingResults: shareResultsMutation.isPending,
    downloadPdfData: downloadPdfMutation.data,
    shareResultsData: shareResultsMutation.data,
  };
}
