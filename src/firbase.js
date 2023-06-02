// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import {getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADNXDyCTRcosCDMetaTZU58B37om2TFUE",
  authDomain: "zip-zoong.firebaseapp.com",
  projectId: "zip-zoong",
  storageBucket: "zip-zoong.appspot.com",
  messagingSenderId: "355084792460",
  appId: "1:355084792460:web:41b08d923016cc76a741a9",
  measurementId: "G-T6G7T6GPCY"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const firebaseAuth  = getAuth(firebase);
const fireStore = getFirestore(firebase);
//const db = firebase.fire
export {fireStore, firebaseAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword};
// const firestore = firebase.firestore();
// export { firestore};


// const analytics = getAnalytics(app);