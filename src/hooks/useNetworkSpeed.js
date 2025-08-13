// src/hooks/useNetworkSpeed.js
import { useEffect } from 'react';
import { showNetworkSlowToast } from '../components/NetworkToast';

export const useNetworkSpeed = () => {
  useEffect(() => {
    // Network Information API
    if (navigator.connection) {
      const connection = navigator.connection;
      // effectiveType can be 'slow-2g', '2g', '3g', '4g'
      if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
        showNetworkSlowToast();
      }
    }

    // Fallback: show toast if page takes more than 5 seconds to load
    const timeout = setTimeout(() => {
      showNetworkSlowToast();
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);
};
