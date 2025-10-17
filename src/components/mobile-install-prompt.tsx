"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  X,
  Download,
  Smartphone,
  Zap,
  Wifi,
  Monitor,
  Bell,
  CheckCircle,
} from "lucide-react";

export default function MobileInstallPrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [dismissed, setDismissed] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isServiceWorkerReady, setIsServiceWorkerReady] = useState(false);

  useEffect(() => {
    // Check PWA support
    const checkPwaSupport = () => {
      const supported =
        "serviceWorker" in navigator &&
        "PushManager" in window &&
        "beforeinstallprompt" in window;
      setIsSupported(supported);

      if (!supported) {
        console.log("PWA not fully supported on this device");
      }
    };

    // Check if already installed
    const checkInstalled = () => {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone ||
        document.referrer.includes("android-app://");
      setIsStandalone(standalone);
      return standalone;
    };

    // Check device type
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream,
    );

    // Check if previously dismissed
    const wasDismissed = localStorage.getItem("pwa-install-dismissed");
    if (wasDismissed) {
      setDismissed(true);
    }

    // Check service worker readiness
    const checkServiceWorker = async () => {
      if ("serviceWorker" in navigator) {
        try {
          const registration = await navigator.serviceWorker.ready;
          setIsServiceWorkerReady(true);
          console.log("Service worker is ready:", registration.scope);
        } catch (error) {
          console.error("Service worker not ready:", error);
        }
      }
    };

    // Show prompt after delay
    const showInstallPrompt = () => {
      if (!checkInstalled() && !wasDismissed && isSupported) {
        setIsVisible(true);
      }
    };

    // Initialize
    checkPwaSupport();
    checkInstalled();
    checkServiceWorker();

    // Show after 3 seconds
    const timer = setTimeout(showInstallPrompt, 3000);

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as any;
      setDeferredPrompt(promptEvent);
      console.log("Install prompt event received");

      if (!wasDismissed && !checkInstalled()) {
        setIsVisible(true);
      }
    };

    // Listen for app installed
    const handleAppInstalled = () => {
      console.log("App was installed");
      setIsVisible(false);
      setIsStandalone(true);
      setDeferredPrompt(null);
    };

    // Listen for service worker changes
    const handleServiceWorkerChange = () => {
      checkServiceWorker();
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    navigator.serviceWorker?.addEventListener(
      "controllerchange",
      handleServiceWorkerChange,
    );

    // Listen for online/offline changes
    const handleOnline = () => console.log("App is online");
    const handleOffline = () => console.log("App is offline");

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      clearTimeout(timer);
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
      navigator.serviceWorker?.removeEventListener(
        "controllerchange",
        handleServiceWorkerChange,
      );
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleInstall = async () => {
    console.log("Install button clicked");
    console.log("Deferred prompt available:", !!deferredPrompt);
    console.log("Service worker ready:", isServiceWorkerReady);

    if (deferredPrompt) {
      try {
        console.log("Triggering native install prompt");
        deferredPrompt.prompt();

        const { outcome } = await deferredPrompt.userChoice;
        console.log("Install outcome:", outcome);

        if (outcome === "accepted") {
          setIsVisible(false);
          console.log("User accepted install");
        } else {
          console.log("User dismissed install");
        }

        setDeferredPrompt(null);
      } catch (error) {
        console.error("Error during install prompt:", error);
        showManualInstructions();
      }
    } else {
      showManualInstructions();
    }
  };

  const showManualInstructions = () => {
    if (isIOS) {
      alert(
        '📱 To install Dating App:\n\n1. Tap the Share button at the bottom\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add" to install\n\n💡 You can also add it to your bookmarks for easy access!',
      );
    } else {
      alert(
        '📱 To install Dating App:\n\nLook for the install icon (⬇) in your browser\'s address bar, or:\n\n1. Click the menu button (⋮)\n2. Select "Install app" or "Add to Home screen"\n\n💡 Make sure you\'re using Chrome, Edge, or Firefox!',
      );
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setDismissed(true);
    localStorage.setItem("pwa-install-dismissed", "true");
    console.log("Install prompt dismissed");
  };

  const handleLearnMore = () => {
    alert(
      "🚀 Dating App PWA Features:\n\n✨ Lightning fast loading\n📱 Works offline\n🔔 Push notifications\n🎯 Native app experience\n💾 Automatic data sync\n🔒 Secure and private\n\nInstall now to get the full experience!",
    );
  };

  // Don't show if already installed or dismissed
  if (isStandalone || dismissed || !isVisible) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden" />

      {/* Mobile Install Prompt */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <Card className="rounded-t-2xl shadow-2xl border-t-4 border-pink-500">
          <CardContent className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                  <Smartphone className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    Install Dating App
                  </h3>
                  <p className="text-xs text-gray-600">
                    {isServiceWorkerReady ? "Ready to install" : "Loading..."}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isSupported && isServiceWorkerReady && (
                  <div
                    className="w-2 h-2 bg-green-500 rounded-full"
                    title="PWA Ready"
                  />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Install Status */}
            {isSupported ? (
              <div className="flex items-center gap-2 mb-3 p-2 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-xs text-green-800">
                  PWA ready for installation
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-3 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                <Monitor className="h-4 w-4 text-yellow-600" />
                <span className="text-xs text-yellow-800">
                  Limited PWA support on this device
                </span>
              </div>
            )}

            {/* Benefits Grid */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              <div className="text-center">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-1">
                  <Zap className="h-4 w-4 text-yellow-600" />
                </div>
                <p className="text-xs">Fast</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-1">
                  <Wifi className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-xs">Offline</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-1">
                  <Monitor className="h-4 w-4 text-green-600" />
                </div>
                <p className="text-xs">Full Screen</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-1">
                  <Bell className="h-4 w-4 text-purple-600" />
                </div>
                <p className="text-xs">Alerts</p>
              </div>
            </div>

            {/* Install Button */}
            <Button
              onClick={handleInstall}
              disabled={!isServiceWorkerReady}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              size="lg"
            >
              <Download className="h-5 w-5 mr-2" />
              {isServiceWorkerReady ? "Install App Now" : "Preparing..."}
            </Button>

            {/* Instructions */}
            <div className="mt-3 text-xs text-gray-600">
              {isIOS ? (
                <div className="bg-blue-50 p-2 rounded-lg">
                  <p className="font-semibold text-blue-900 mb-1">
                    iOS Instructions:
                  </p>
                  <p>Tap share → "Add to Home Screen" → "Add"</p>
                </div>
              ) : (
                <div className="bg-green-50 p-2 rounded-lg">
                  <p className="font-semibold text-green-900 mb-1">
                    Android/Desktop:
                  </p>
                  <p>Look for install icon ⬇ in address bar</p>
                </div>
              )}
            </div>

            {/* Learn More */}
            <div className="mt-3 text-center">
              <button
                onClick={handleLearnMore}
                className="text-xs text-pink-600 hover:text-pink-700 underline"
              >
                Learn more about PWA features
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Desktop Floating Button */}
      <div className="fixed bottom-6 right-6 z-40 hidden md:block">
        <Button
          onClick={handleInstall}
          disabled={!isServiceWorkerReady}
          className="bg-pink-500 hover:bg-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
          size="lg"
        >
          <Download className="h-5 w-5 mr-2" />
          {isServiceWorkerReady ? "Install App" : "Loading..."}
        </Button>
      </div>
    </>
  );
}
