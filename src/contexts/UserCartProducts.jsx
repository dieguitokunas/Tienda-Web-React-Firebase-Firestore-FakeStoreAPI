import { createContext, useContext, useEffect, useState } from "react";
import { FirebaseContext } from "./FireBaseConfig";
import {collection,query,where} from 'firebase/firestore'
export const UserCartProductsContext=createContext()
export function UserCartProducts({children}){
    const [db]=useContext(FirebaseContext)
    const [userProducts,setUserPoducts]=useState()
    const getProducts=async()=>{
        const userCollection=collection(db,"users")    }

    useEffect(()=>{
       if(db){
           getProducts()
       }
    },[db])

    return(
        <UserCartProductsContext.Provider value={userProducts}>
            {children}
        </UserCartProductsContext.Provider>
    )

}