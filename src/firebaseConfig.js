import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCpWDwoN6jdHMj8OjeBzW1v_bO1w57J-4s",
    authDomain: "startup-eco.firebaseapp.com",
    projectId: "startup-eco",
    storageBucket: "startup-eco.appspot.com",
    messagingSenderId: "292575538792",
    appId: "1:292575538792:web:caf5d89124c1dd72c8d5dd",
    measurementId: "G-9HG9LN9GBQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

export { auth, provider, signInWithPopup, signOut };