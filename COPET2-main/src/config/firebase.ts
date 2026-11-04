import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "API_KEY_KAMU",
  authDomain: "copet-app.firebaseapp.com",
  projectId: "copet-app",
  storageBucket: "copet-app.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);