// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDE-GyBprh8yA5bOdj8_w8Tp4VjncMw_fg",
    authDomain: "muemo-1916a.firebaseapp.com",
    projectId: "muemo-1916a",
    storageBucket: "muemo-1916a.firebasestorage.app",
    messagingSenderId: "292933854253",
    appId: "1:292933854253:web:9a9b05cc64a88ba98dc4a4",
    measurementId: "G-57NTQLL4WF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider, app };