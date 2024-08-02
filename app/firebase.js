import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDB4mdiYRojZ1052hAfxF1jpap91tNhSN4",
  authDomain: "grocerlist-fa442.firebaseapp.com",
  projectId: "grocerlist-fa442",
  storageBucket: "grocerlist-fa442.appspot.com",
  messagingSenderId: "69053931962",
  appId: "1:69053931962:web:f2869faa0a91332afafd83",
  measurementId: "G-SG8THWJ055"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

console.log("Api Key: ", firebaseConfig.apiKey );
console.log("Is database connected: ", db);

// Initialize Analytics only on the client-side
let analytics;
if (typeof window !== "undefined") {
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(error => {
    console.error("Error initializing Firebase Analytics:", error);
  });
}

export { db, analytics };
