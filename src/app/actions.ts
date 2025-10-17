"use server";

import webpush from "web-push";

// In production, these should be stored in environment variables
webpush.setVapidDetails(
  "mailto:contact@datingapp.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

// In a real app, this would be stored in a database
let subscriptions: any[] = [];

export async function subscribeUser(sub: any) {
  subscriptions.push(sub);
  // In production, store in database:
  // await db.subscriptions.create({ data: sub })
  return { success: true };
}

export async function unsubscribeUser(subscription: any) {
  subscriptions = subscriptions.filter(
    (sub) => sub.endpoint !== subscription.endpoint,
  );
  // In production, remove from database:
  // await db.subscriptions.delete({ where: { endpoint: subscription.endpoint } })
  return { success: true };
}

export async function sendNotification(message: string, subscription?: any) {
  try {
    const targetSubscription = subscription || subscriptions[0];

    if (!targetSubscription) {
      throw new Error("No subscription available");
    }

    await webpush.sendNotification(
      targetSubscription,
      JSON.stringify({
        title: "Dating App",
        body: message,
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-72x72.png",
        tag: "dating-app-notification",
        renotify: true,
        requireInteraction: false,
        actions: [
          {
            action: "explore",
            title: "Explore Matches",
            icon: "/icons/icon-96x96.png",
          },
          {
            action: "messages",
            title: "View Messages",
            icon: "/icons/icon-96x96.png",
          },
        ],
      }),
    );
    return { success: true };
  } catch (error) {
    console.error("Error sending push notification:", error);
    return { success: false, error: "Failed to send notification" };
  }
}

export async function sendMatchNotification(matchedUser: string) {
  return sendNotification(`You have a new match with ${matchedUser}! 💕`);
}

export async function sendMessageNotification(
  sender: string,
  messagePreview: string,
) {
  return sendNotification(
    `New message from ${sender}: "${messagePreview.substring(0, 50)}..."`,
  );
}

export async function sendProfileViewNotification(viewer: string) {
  return sendNotification(`${viewer} viewed your profile! 👀`);
}
