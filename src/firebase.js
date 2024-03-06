
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC7REowQAC1_sG0smhHFyWm-rS9O8dfbOI",
  authDomain: "notebook-f7e1a.firebaseapp.com",
  projectId: "notebook-f7e1a",
  storageBucket: "notebook-f7e1a.appspot.com",
  messagingSenderId: "31368086530",
  appId: "1:31368086530:web:a29eb358f89343e4ee131b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const notesCollection = collection(db, "notes")