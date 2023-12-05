import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAbIidH0ZKogy_cW-2VNOB5rqBvtjO305s",
  authDomain: "lectorcito.firebaseapp.com",
  projectId: "lectorcito",
  storageBucket: "lectorcito.appspot.com",
  messagingSenderId: "827826708212",
  appId: "1:827826708212:web:31976fb50ab835c512c8a1"
};

export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);