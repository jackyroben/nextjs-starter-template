'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, X, Share2, Plus } from 'lucide-react'

export default function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    )

    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setDeferredPrompt(null)
    }
  }

  if (isStandalone) {
    return null // Don't show install button if already installed
  }

  return (
    <Card className="mb-6 border-pink-200 bg-gradient-to-r from-pink-50 to-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5 text-pink-500" />
          Install Dating App
        </CardTitle>
        <CardDescription>
          Get the full mobile experience with our PWA
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {deferredPrompt && !isIOS ? (
            <Button onClick={handleInstallClick} className="w-full bg-pink-500 hover:bg-pink-600">
              <Download className="h-4 w-4 mr-2" />
              Install App
            </Button>
          ) : (
            <div className="text-sm space-y-2">
              <p className="font-medium">How to install:</p>
              {isIOS ? (
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <p className="text-blue-800">
                    1. Tap the share button <Share2 className="inline h-4 w-4 mx-1" />
                  </p>
                  <p className="text-blue-800">
                    2. Scroll down and tap "Add to Home Screen" <Plus className="inline h-4 w-4 mx-1" />
                  </p>
                  <p className="text-blue-800">
                    3. Tap "Add" to install
                  </p>
                </div>
              ) : (
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <p className="text-gray-700">
                    Look for the install icon in your browser's address bar or menu to add this app to your home screen.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="text-xs text-gray-500 space-y-1">
            <p>✨ Benefits of installing:</p>
            <ul className="ml-4 space-y-1">
              <li>• Faster loading times</li>
              <li>• Works offline</li>
              <li>• Full screen experience</li>
              <li>• Push notifications</li>
              <li>• No browser UI distractions</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
