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

// Background notification handler
messaging.onBackgroundMessage(payload => {
  const { title, body } = payload.notification ?? {};
  self.registration.showNotification(title ?? 'DevQuiz', {
    body:  body ?? '',
    icon:  '/logo192.png',
    badge: '/logo192.png',
    data:  payload.data,
  });
});

// Notification click → focus or open the app
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      if (list.length > 0) return list[0].focus();
      return clients.openWindow('/');
    })
  );
});
