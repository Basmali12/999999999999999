const CONFIG = {
  FIREBASE_CONFIG: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  },
  COLLECTION_NAME: "products"
};

firebase.initializeApp(CONFIG.FIREBASE_CONFIG);
const db = firebase.firestore();
