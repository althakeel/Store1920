import { useEffect } from 'react';
import { showNetworkSlowToast } from '../components/NetworkToast';

export const useNetworkSpeed = () => {
  useEffect(() => {
    let timeout;

    // 1️⃣ Check Network Information API
    if (navigator.connection) {
      const connection = navigator.connection;
      if (connection.effectiveType !== '4g') {
        showNetworkSlowToast();
        return;
      }
    }

    // 2️⃣ Fallback: page load timeout
    const handleLoad = () => clearTimeout(timeout);
    window.addEventListener('load', handleLoad);

    timeout = setTimeout(() => {
      showNetworkSlowToast();
    }, 5000);

    // 3️⃣ Optional: real speed test after mount
    const testNetworkSpeed = async () => {
      const startTime = Date.now();
      try {
        const response = await fetch('/speed-test.png?cacheBust=' + Date.now());
        const blob = await response.blob();
        const duration = Date.now() - startTime;
        const speedKbps = (blob.size * 8) / (duration / 1000) / 1024;

        if (speedKbps < 300) {
          showNetworkSlowToast();
        }
      } catch {
        showNetworkSlowToast();
      }
    };

    testNetworkSpeed();

    // 4️⃣ Cleanup
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('load', handleLoad);
    };
  }, []);
};
