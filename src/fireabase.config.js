// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCUQh40CIhcWjJ8XE4T0KBg1x5pthyenbw",
  authDomain: "idkman2-6afeb.firebaseapp.com",
  projectId: "idkman2-6afeb",
  storageBucket: "idkman2-6afeb.appspot.com",
  messagingSenderId: "422246359678",
  appId: "1:422246359678:web:a296ff4002798e36b72e2f",
  measurementId: "G-69JSX6F0BC",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
