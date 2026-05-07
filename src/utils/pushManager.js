import { secureFetch } from "../app/utils/auth";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const registerPushManager = async () => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Push notifications are not supported by this browser.');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker registered with scope:', registration.scope);

    // Request permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('Notification permission denied.');
      return;
    }

    // Always sync subscription with backend to ensure the server has the latest mapping for THIS user
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      console.log('No existing push subscription found. Subscribing now...');
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });
    }

    console.log('Syncing push subscription with backend...');
    const response = await secureFetch('/v1/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription,
        deviceType: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
        userAgent: navigator.userAgent
      })
    });

    if (response.ok) {
      console.log('Push subscription synced successfully with backend.');
    } else {
      const errData = await response.json();
      console.error('Failed to sync push subscription:', errData);
    }

    return subscription;
  } catch (error) {
    console.error('Push registration failed:', error);
  }
};
