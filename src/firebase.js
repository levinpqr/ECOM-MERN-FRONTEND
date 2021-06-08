import firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBIhsGsi3g_wFqpWth1AKdbaD7Rk7AyXDs",
    authDomain: "ecom-mern-dc610.firebaseapp.com",
    projectId: "ecom-mern-dc610",
    storageBucket: "ecom-mern-dc610.appspot.com",
    messagingSenderId: "1066611978318",
    appId: "1:1066611978318:web:0576e1e5bcf54caef0531f",
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const emailAuthProvider = firebase.auth.EmailAuthProvider;
