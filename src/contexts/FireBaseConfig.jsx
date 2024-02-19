// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { createContext } from "react";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCNs-R3MpR1qVgFuP5hnJwVsfMMohCQaxE",
  authDomain: "nuevo-carrito.firebaseapp.com",
  projectId: "nuevo-carrito",
  storageBucket: "nuevo-carrito.appspot.com",
  messagingSenderId: "772286523858",
  appId: "1:772286523858:web:cdb9c445a163a22436c00b",
};
export const FirebaseContext = createContext();

export function FirebaseConfig({children}) {
    const app=initializeApp(firebaseConfig)
    const db=getFirestore(app)
    const auth=getAuth(app)
  return (
    <FirebaseContext.Provider value={[db,auth]}>
        {children}
    </FirebaseContext.Provider>
  );
}
