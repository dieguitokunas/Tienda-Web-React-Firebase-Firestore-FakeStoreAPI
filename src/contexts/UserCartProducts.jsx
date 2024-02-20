import { createContext, useContext, useEffect, useState } from "react";
import { FirebaseContext } from "./FireBaseConfig";
import {
  addDoc,
  collection,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { googleAuthContext } from "./GoogleAuth";
export const UserCartProductsContext = createContext();
export function UserCartProducts({ children }) {
  //We call the Firestore initialization
  const [db] = useContext(FirebaseContext);
  //The state to save the products array of the user
  const [userProducts, setUserPoducts] = useState([null]);
  //The user data to await for the user to be logged-in before calling the other's functions.
  const [user] = useContext(googleAuthContext);
  //This state save's the user Document UID so it can be refered later.
  const [userUID, setUserUID] = useState(null);
  const getProducts = async () => {
    if (user) {

      try {
        //Gets a Snapshot of the 'users' collection of the Firestore DB where the email field be equal to the user email. 
        const userSnapshot = await getDocs(
          query(collection(db, `users`), where("email", "==", user.email))
        );
        if (!userSnapshot.empty) {
          //Obtenemos los documentos de la Snapshot, en este caso [0] porque solo se espera un 
          const docref = userSnapshot.docs[0].ref;
          setUserUID(docref.id);

          const carrito = await getDocs(collection(docref, "carrito"));
          if (carrito.empty) {
            setUserPoducts(null);
          } else {
            setUserPoducts(carrito.docs[0].data());
            console.log(carrito.docs[0].data());
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const addProductsToCart = async (productId) => {
    if (!user || !userUID) return;
  
    try {
      const carritoCollection = collection(db, `users/${userUID}/carrito`);
      const querySnapshot = await getDocs(
        query(carritoCollection, where("id", "==", productId))
      );
  
      if (querySnapshot.empty) {
        await addDoc(carritoCollection, { id: productId, quantity: 1 });
      } else {
        const docSnapshot = querySnapshot.docs[0];
        const quantity = docSnapshot.data().quantity + 1;
        const productId=docSnapshot.data().id
        await setDoc(docSnapshot.ref, { id:productId,quantity:quantity });
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  useEffect(() => {
    if (user) {
      getProducts();
    }
  }, [db, user]);

  return (
    <UserCartProductsContext.Provider value={[userProducts, addProductsToCart]}>
      {children}
    </UserCartProductsContext.Provider>
  );
}
