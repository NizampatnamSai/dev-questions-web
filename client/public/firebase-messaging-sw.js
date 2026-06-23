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

messaging.onBackgroundMessage(payload => {
  const { title, body } = payload.notification ?? {};
  self.registration.showNotification(title ?? 'DevQuiz', {
    body:  body ?? '',
    icon:  '/logo192.png',
    badge: '/logo192.png',
    data:  payload.data,
  });
});

// Notification click → redirect to the path in data payload
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const path = event.notification.data?.path || '/';
  const url = self.location.origin + path;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      // If app is already open, focus it and navigate
      for (const client of list) {
        if (client.url.startsWith(self.location.origin) && 'focus' in client) {
          client.focus();
          client.navigate(url);
          return;
        }
      }
      // Otherwise open a new window
      return clients.openWindow(url);
    })
  );
});
