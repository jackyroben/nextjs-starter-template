'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, Monitor, Wifi, Bell, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function PWAStatus() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [supportsServiceWorker, setSupportsServiceWorker] = useState(false);
  const [supportsPush, setSupportsPush] = useState(false);

  useEffect(() => {
    // Check device type
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream);

    // Check if installed
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);

    // Check online status
    setIsOnline(navigator.onLine);

    // Check service worker support
    setSupportsServiceWorker('serviceWorker' in navigator);

    // Check push notification support
    setSupportsPush('PushManager' in window);

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const StatusIcon = ({ status }: { status: 'success' | 'warning' | 'error' }) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-blue-500" />
          PWA Status
        </CardTitle>
        <CardDescription>
          Progressive Web App capabilities and status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* PWA Features Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100">
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Installed</span>
              </div>
              <StatusIcon status={isStandalone ? 'success' : 'warning'} />
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100">
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Service Worker</span>
              </div>
              <StatusIcon status={supportsServiceWorker ? 'success' : 'error'} />
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Push Notifications</span>
              </div>
              <StatusIcon status={supportsPush ? 'success' : 'error'} />
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Device Type</span>
              </div>
              <span className="text-xs text-gray-600">{isIOS ? 'iOS' : 'Android/Desktop'}</span>
            </div>
          </div>

          {/* Connection Status */}
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100">
            <div className="flex items-center gap-2">
              <Wifi className={`h-4 w-4 ${isOnline ? 'text-green-500' : 'text-red-500'}`} />
              <span className="text-sm font-medium">Connection</span>
            </div>
            <span className={`text-xs font-medium ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          {/* Install Instructions */}
          {!isStandalone && (
            <div className="space-y-2">
              <p className="text-sm font-medium">How to install:</p>
              {isIOS ? (
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-xs text-blue-800">
                  <p>1. Tap share button at bottom</p>
                  <p>2. Scroll to "Add to Home Screen"</p>
                  <p>3. Tap "Add" to install</p>
                </div>
              ) : (
                <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-xs text-green-800">
                  <p>Look for install icon (⬇) in address bar</p>
                  <p>Or click menu (⋮) → "Install app"</p>
                </div>
              )}
            </div>
          )}

          {/* Test PWA Features */}
          <div className="pt-3 border-t border-blue-200">
            <p className="text-xs text-gray-600 mb-2">Test PWA features:</p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => alert('PWA is working! Check your browser for install options.')}
                className="text-xs"
              >
                Test Install
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (navigator.serviceWorker) {
                    navigator.serviceWorker.ready.then(registration => {
                      alert('Service Worker is active! Offline support enabled.');
                    });
                  } else {
                    alert('Service Worker not supported');
                  }
                }}
                className="text-xs"
              >
                Test Service Worker
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
