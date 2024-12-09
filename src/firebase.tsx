// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';
// import { initializeApp } from 'firebase/app';
// import { getDatabase } from 'firebase/database';
// import { getFirestore } from 'firebase/firestore';

// const firebaseConfig = {
//   apiKey: "AIzaSyAR0kqtOfhnPVWV34bgCeMkNRRpkYo-nak",
//   authDomain: "attendify-by-tushar.firebaseapp.com",
//   projectId: "attendify-by-tushar",
//   storageBucket: "attendify-by-tushar.appspot.com",
//   messagingSenderId: "880770431995",
//   appId: "1:880770431995:web:2e338f3945e16bd534695e",
// };

// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }
// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);
// const firestore = getFirestore(app);
// export {database}
// export default firebase;
// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration for your project
const firebaseConfig = {
  apiKey: "AIzaSyCRQDnaIblwZrnsGlByGZacLm6rQ94uiqQ",
  authDomain: "viit-attendify.firebaseapp.com",
  databaseURL: "https://viit-attendify-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "viit-attendify",
  storageBucket: "viit-attendify.firebasestorage.app",
  messagingSenderId: "353400889247",
  appId: "1:353400889247:web:7f8fe43f30c0cab5efe7aa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export necessary Firebase services
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };

