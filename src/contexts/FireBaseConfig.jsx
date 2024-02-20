// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { createContext } from "react";
import { getAuth } from "firebase/auth";
//The Firebase project config
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
    //In the return we use the FirebaseContext to keep two values, 'db' and 'auth'. 'db' save's the 'connection' with Firestore using the Firebase config,so with that every children component could skip initializing the Firestore constantly, and the same applies to auth, that it's purpose is to save the 'getAuth' (The initialization of the Authentication provided by Firebase to use service's like Google or similar's to signup,basically)
<FirebaseContext.Provider value={[db,auth]}>
        {children}
    </FirebaseContext.Provider>
  );
}
