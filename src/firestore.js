import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA36LpChnOXP2D0EUFjpoSsepagiqOI3KI",
  authDomain: "todolist-b7be6.firebaseapp.com",
  projectId: "todolist-b7be6",
  storageBucket: "todolist-b7be6.appspot.com",
  messagingSenderId: "623489103990",
  appId: "1:623489103990:web:1f1d6e16a93c56bcbbc757",
  measurementId: "G-5CDXDKWQTM",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
