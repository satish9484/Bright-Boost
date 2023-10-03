// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Import the functions you need from the SDKs you need

import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyAq2HVX9ynBrM_f8RsrF5lDa0x5A_lXtEc",
	authDomain: "margarita-test-5ddfd.firebaseapp.com",
	projectId: "margarita-test-5ddfd",
	storageBucket: "margarita-test-5ddfd.appspot.com",
	messagingSenderId: "879891894589",
	appId: "1:879891894589:web:ecf6de0bb94539a6f03554",
	measurementId: "G-3Y3TC43FPM",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
export const database = getDatabase();
const analytics = getAnalytics();
