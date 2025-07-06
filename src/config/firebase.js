// import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDX3hmV-7nWSZAvtbVHYLKEKC89uZwvWE8",
  authDomain: "fir-a0166.firebaseapp.com",
  projectId: "fir-a0166",
  storageBucket: "fir-a0166.firebasestorage.app",
  messagingSenderId: "284007309789",
  appId: "1:284007309789:web:97260826e50f7273d49634",
  measurementId: "G-F0KF4NL5N9",
};

// const analytics = getAnalytics(app);
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app)
