'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Bell, BellOff, Send, CheckCircle, XCircle } from 'lucide-react'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export default function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [message, setMessage] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [isUnsubscribing, setIsUnsubscribing] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [notificationResult, setNotificationResult] = useState<{ success: boolean; message: string } | null>(null)

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      registerServiceWorker()
    }
  }, [])

  async function registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      })
      const sub = await registration.pushManager.getSubscription()
      setSubscription(sub)
    } catch (error) {
      console.error('Service worker registration failed:', error)
    }
  }

  async function subscribeToPush() {
    if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
      setNotificationResult({
        success: false,
        message: 'VAPID public key is not configured'
      })
      return
    }

    setIsSubscribing(true)
    try {
      const registration = await navigator.serviceWorker.ready
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        ),
      })
      setSubscription(sub)

      // In a real app, you'd send this to your server
      const serializedSub = JSON.parse(JSON.stringify(sub))
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscription: serializedSub }),
      })

      setNotificationResult({
        success: true,
        message: 'Successfully subscribed to push notifications!'
      })
    } catch (error) {
      console.error('Push subscription failed:', error)
      setNotificationResult({
        success: false,
        message: 'Failed to subscribe to notifications'
      })
    } finally {
      setIsSubscribing(false)
    }
  }

  async function unsubscribeFromPush() {
    setIsUnsubscribing(true)
    try {
      await subscription?.unsubscribe()
      setSubscription(null)

      // In a real app, you'd tell your server to remove this subscription
      await fetch('/api/push/unsubscribe', {
        method: 'POST',
      })

      setNotificationResult({
        success: true,
        message: 'Successfully unsubscribed from push notifications'
      })
    } catch (error) {
      console.error('Push unsubscription failed:', error)
      setNotificationResult({
        success: false,
        message: 'Failed to unsubscribe from notifications'
      })
    } finally {
      setIsUnsubscribing(false)
    }
  }

  async function sendTestNotification() {
    if (!subscription || !message.trim()) return

    setIsSending(true)
    try {
      const response = await fetch('/api/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(),
          title: 'Test Notification from Dating App',
          subscription: JSON.parse(JSON.stringify(subscription))
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setNotificationResult({
          success: true,
          message: 'Test notification sent successfully!'
        })
        setMessage('')
      } else {
        setNotificationResult({
          success: false,
          message: result.error || 'Failed to send notification'
        })
      }
    } catch (error) {
      console.error('Failed to send test notification:', error)
      setNotificationResult({
        success: false,
        message: 'Failed to send test notification'
      })
    } finally {
      setIsSending(false)
    }
  }

  if (!isSupported) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5 text-gray-500" />
            Push Notifications
          </CardTitle>
          <CardDescription>
            Push notifications are not supported in this browser.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-pink-500" />
          Push Notifications
        </CardTitle>
        <CardDescription>
          Stay updated with new matches and messages
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {subscription ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <span className="text-sm text-green-800">You are subscribed to push notifications</span>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>

              <Button
                onClick={unsubscribeFromPush}
                variant="outline"
                disabled={isUnsubscribing}
                className="w-full"
              >
                {isUnsubscribing ? (
                  <>Unsubscribing...</>
                ) : (
                  <>
                    <BellOff className="h-4 w-4 mr-2" />
                    Unsubscribe
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <span className="text-sm text-yellow-800">You are not subscribed to push notifications</span>
                <XCircle className="h-4 w-4 text-yellow-600" />
              </div>

              <Button
                onClick={subscribeToPush}
                disabled={isSubscribing}
                className="w-full bg-pink-500 hover:bg-pink-600"
              >
                {isSubscribing ? (
                  <>Subscribing...</>
                ) : (
                  <>
                    <Bell className="h-4 w-4 mr-2" />
                    Subscribe to Notifications
                  </>
                )}
              </Button>
            </div>
          )}

          {subscription && (
            <div className="space-y-3">
              <label className="text-sm font-medium">Send Test Notification</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter notification message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  onKeyPress={(e) => e.key === 'Enter' && sendTestNotification()}
                />
                <Button
                  onClick={sendTestNotification}
                  disabled={!message.trim() || isSending}
                  size="sm"
                >
                  {isSending ? (
                    <>Sending...</>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {notificationResult && (
            <div className={`p-3 rounded-lg border ${
              notificationResult.success
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <p className="text-sm">{notificationResult.message}</p>
            </div>
          )}

          <div className="text-xs text-gray-500 space-y-1">
            <p>📱 What you'll receive:</p>
            <ul className="ml-4 space-y-1">
              <li>• New match notifications</li>
              <li>• Message alerts</li>
              <li>• Profile views</li>
              <li>• Daily match suggestions</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
