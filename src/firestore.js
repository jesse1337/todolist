import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

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
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error("Error signing in with Google: ", error);
  }
};

export { db, auth, googleProvider, signInWithGoogle };
