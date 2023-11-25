// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth,GoogleAuthProvider} from "firebase/auth";
import {getFirestore,doc,setDoc} from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC5G4WknvdsPv8J4xPFaWBgVtmbwEd4G6k",
  authDomain: "finencely-84b16.firebaseapp.com",
  projectId: "finencely-84b16",
  storageBucket: "finencely-84b16.appspot.com",
  messagingSenderId: "1060259956738",
  appId: "1:1060259956738:web:f7cc3d2a7ac972a8de7f1b",
  measurementId: "G-T2JSWNRQKL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db=getFirestore(app);
const auth=getAuth(app);
const provider=new GoogleAuthProvider();
export {db,auth,provider,doc,setDoc,analytics};