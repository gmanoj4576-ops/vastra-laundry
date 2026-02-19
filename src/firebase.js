import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCcqZVGWaMWFdSvHleJ4U8OrDr1HH6tJUI",
    authDomain: "vastra-ea011.firebaseapp.com",
    projectId: "vastra-ea011",
    storageBucket: "vastra-ea011.firebasestorage.app",
    messagingSenderId: "999386467332",
    appId: "1:999386467332:web:2299e4bf96b1a470b2f951",
    measurementId: "G-XXY63ZW6FD"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
