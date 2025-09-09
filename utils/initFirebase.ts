import { initializeApp, FirebaseApp } from 'firebase/app';

let app: FirebaseApp | null = null;

export const firebaseApp = (() => {
  if (app) return app;
  const config = {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_AUTH_DOMAIN',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_STORAGE_BUCKET',
    messagingSenderId: 'YOUR_SENDER_ID',
    appId: 'YOUR_APP_ID',
  };
  app = initializeApp(config);
  return app;
})();


