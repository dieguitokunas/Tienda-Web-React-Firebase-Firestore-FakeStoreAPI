import { createContext, useContext, useEffect, useState } from "react";
import { FirebaseContext } from "./FireBaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
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
  const [userProducts, setUserPoducts] = useState(false);
  //The user data to await for the user to be logged-in before calling the other's functions.
  const [user] = useContext(googleAuthContext);
  //This state save's the user Document UID so it can be refered later.
  const [userUID, setUserUID] = useState(false);
  const getProducts = async (updateCart=true) => {
    if (user) {
      try {
        //Gets a Snapshot of the 'users' collection of the Firestore DB where the email field be equal to the user email.
        const userSnapshot = await getDocs(
          query(collection(db, `users`), where("email", "==", user.email))
        );
        if (!userSnapshot.empty) {
          //Get the snapshot first document reference
          const docref = userSnapshot.docs[0].ref;
          //Set the userUID with the uid from the Firestore document
          setUserUID(docref.id);

          const carrito = await getDocs(collection(docref, "carrito"));
          if (carrito.empty) {
            setUserPoducts(false);
            if(updateCart){
              setUserPoducts(false)
            }
          } else {
            let productsArray = [];
            //Push every document data to the array
            carrito.forEach((doc) => {
              productsArray.push(doc.data());
            });
            setUserPoducts(productsArray);
             if(updateCart){
               setUserPoducts(productsArray)
             }
          }
        } else {
          const userData = {
            name: user.displayName,
            email: user.email,
          };
          await addDoc(collection(db, "users", { userData }));
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const addProductsToCart = async (productId) => {
    if (user && userUID) {
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
          const productId = docSnapshot.data().id;
          await setDoc(docSnapshot.ref, { id: productId, quantity: quantity });
        }
      } catch (error) {
        console.error("Error adding product to cart:", error);
      }
    }
  };

  const deleteProductsFromCart = async (productId,updateCart=false) => {
    if (user && userUID) {
      try {
        const carritoCollection = collection(db, `users/${userUID}/carrito`);
        const getProductSnapshot = await getDocs(
          query(carritoCollection, where("id", "==", productId))
        );
        if (!getProductSnapshot.empty) {
          const docRef = getProductSnapshot.docs[0].ref;
         if(updateCart){
          const quantity=getProductSnapshot.docs[0].data().quantity-1
          const productId=getProductSnapshot.docs[0].data().id
          if(quantity===0){
            await deleteDoc(docRef)
          }else{
            await setDoc(docRef,{id:productId,quantity:quantity})
          }
        }else{
          await deleteDoc(docRef);
        }
        await getProducts(true)
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (user) {
      getProducts();
    }
  }, [db, user]);


  return (
    <UserCartProductsContext.Provider
      value={[userProducts, addProductsToCart, deleteProductsFromCart,getProducts]}
    >
      {children}
    </UserCartProductsContext.Provider>
  );
}
