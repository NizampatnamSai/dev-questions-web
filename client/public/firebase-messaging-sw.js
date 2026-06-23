importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:            'AIzaSyANlzRxM4nOUA3TkUxvx4Yp1JjI_FyirGE',
  authDomain:        'ai-questions-889d2.firebaseapp.com',
  projectId:         'ai-questions-889d2',
  storageBucket:     'ai-questions-889d2.firebasestorage.app',
  messagingSenderId: '794467830267',
  appId:             '1:794467830267:web:89e39e4302e2a4ed1e235e',
});

const messaging = firebase.messaging();

// Notification type → urgency config
function getNotifOptions(type) {
  const urgent = { requireInteraction: true, renotify: true };
  const map = {
    account_approved:   { ...urgent, tag: 'account',        vibrate: [200, 100, 200] },
    account_rejected:   { ...urgent, tag: 'account',        vibrate: [400, 100, 400] },
    workboard_join:     { ...urgent, tag: 'workboard',      vibrate: [200] },
    workboard_post:     {            tag: 'workboard-post'                  },
    js_challenge:       {            tag: 'challenge',       vibrate: [100, 50, 100] },
    workboard_reminder: { ...urgent, tag: 'workboard',      vibrate: [200, 100, 200] },
    weekly_motivation:  {            tag: 'motivation'                      },
    manual:             {            tag: 'manual',          vibrate: [200] },
    broadcast:          {            tag: 'broadcast',       vibrate: [200] },
    community_reminder: {            tag: 'community',       vibrate: [150, 100, 150] },
  };
  return map[type] || {};
}

// Play custom notification sound by posting to all open clients
async function playSound() {
  const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  for (const client of allClients) {
    client.postMessage({ type: 'PLAY_NOTIFICATION_SOUND' });
  }
}

messaging.onBackgroundMessage(async payload => {
  const { title, body } = payload.notification ?? {};
  const type = payload.data?.type || '';
  const extra = getNotifOptions(type);

  await self.registration.showNotification(title ?? 'DevQuiz', {
    body:    body ?? '',
    icon:    '/logo192.png',
    badge:   '/logo192.png',
    sound:   '/notification.mp3',  // supported on some platforms
    data:    payload.data,
    actions: payload.data?.path
      ? [{ action: 'open', title: '👉 Open' }]
      : [],
    ...extra,
  });

  await playSound();
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const path = event.notification.data?.path || '/';
  const url  = self.location.origin + path;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if (client.url.startsWith(self.location.origin) && 'focus' in client) {
          client.focus();
          client.navigate(url);
          return;
        }
      }
      return clients.openWindow(url);
    })
  );
});
