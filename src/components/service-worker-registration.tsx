'use client';

import { useEffect, useState } from 'react';

export default function ServiceWorkerRegistration() {
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [showUpdateAvailable, setShowUpdateAvailable] = useState(false);

  useEffect(() => {
    // Check online status
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Register service worker
    if ('serviceWorker' in navigator) {
      registerServiceWorker();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const registerServiceWorker = async () => {
    try {
      console.log('Registering service worker...');

      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      });

      console.log('Service Worker registered successfully:', registration);

      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New version available
              setShowUpdateAvailable(true);
            }
          });
        }
      });

      // Listen for controlling changes
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });

      setSwRegistration(registration);

      // Check for existing subscription
      const subscription = await registration.pushManager.getSubscription();
      console.log('Existing push subscription:', subscription);

    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  };

  const handleUpdateClick = () => {
    if (swRegistration && swRegistration.waiting) {
      swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  // Don't render anything if no update is available
  if (!showUpdateAvailable) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-green-500 text-white p-4 rounded-lg shadow-lg border border-green-600">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold">Update Available</h4>
            <p className="text-sm opacity-90">A new version of the app is ready!</p>
          </div>
          <button
            onClick={handleUpdateClick}
            className="bg-white text-green-600 px-3 py-1 rounded text-sm font-medium hover:bg-green-50 transition-colors"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
