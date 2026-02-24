import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCcqZVGWaMWFdSvHleJ4U8OrDr1HH6tJUI",
    authDomain: "vastra-ea011.firebaseapp.com",
    projectId: "vastra-ea011",
    storageBucket: "vastra-ea011.firebasestorage.app",
    messagingSenderId: "999386467332",
    appId: "1:999386467332:web:2299e4bf96b1a470b2f951",
    measurementId: "G-XXY63ZW6FD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup };
