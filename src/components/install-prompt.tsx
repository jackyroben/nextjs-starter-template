"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Download,
  Share2,
  Plus,
  Smartphone,
  Zap,
  Wifi,
  Monitor,
  Bell,
} from "lucide-react";

export default function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showManualInstall, setShowManualInstall] = useState(true);

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream,
    );

    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowManualInstall(false); // Hide manual instructions when native prompt is available
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  if (isStandalone) {
    return null; // Don't show install button if already installed
  }

  return (
    <Card className="mb-6 border-pink-200 bg-gradient-to-r from-pink-50 to-purple-50 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-pink-500" />
          Install Dating App
        </CardTitle>
        <CardDescription>
          Get the full mobile experience with our Progressive Web App
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Native Install Button (when available) */}
          {deferredPrompt && (
            <Button
              onClick={handleInstallClick}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3"
              size="lg"
            >
              <Download className="h-5 w-5 mr-2" />
              Install App Now
            </Button>
          )}

          {/* Manual Install Instructions */}
          {showManualInstall && (
            <div className="space-y-4">
              {isIOS ? (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="font-semibold text-blue-900 mb-3">
                    iOS Installation:
                  </p>
                  <div className="space-y-2 text-blue-800">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">1.</span>
                      <Share2 className="h-4 w-4" />
                      <span>Tap the share button at the bottom</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">2.</span>
                      <span>Scroll down and tap</span>
                      <Plus className="h-4 w-4 ml-1" />
                      <span>&quot;Add to Home Screen&quot;</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">3.</span>
                      <span>Tap &quot;Add&quot; to install</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="font-semibold text-green-900 mb-3">
                    Desktop/Android Installation:
                  </p>
                  <div className="space-y-2 text-green-800">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      <span>Look for the install icon</span>
                      <Download className="h-4 w-4 ml-1" />
                      <span>in your browser's address bar</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>
                        Or click the menu button (⋮) and select &quot;Install
                        app&quot;
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Benefits Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <div className="text-center p-3 bg-white rounded-lg border border-pink-100">
              <Zap className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
              <p className="text-xs font-medium">Lightning Fast</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-pink-100">
              <Wifi className="h-6 w-6 text-blue-500 mx-auto mb-1" />
              <p className="text-xs font-medium">Works Offline</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-pink-100">
              <Monitor className="h-6 w-6 text-green-500 mx-auto mb-1" />
              <p className="text-xs font-medium">Full Screen</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-pink-100">
              <Bell className="h-6 w-6 text-purple-500 mx-auto mb-1" />
              <p className="text-xs font-medium">Push Alerts</p>
            </div>
          </div>

          {/* Test Install Button (for development) */}
          <div className="mt-4 pt-4 border-t border-pink-200">
            <p className="text-xs text-gray-500 mb-2">
              Can't see install options? Try this:
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                alert(
                  "PWA features are active! Look for install options in your browser menu or address bar.",
                )
              }
              className="text-xs"
            >
              Check PWA Status
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
