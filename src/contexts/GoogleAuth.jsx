import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut} from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { FirebaseContext } from './FireBaseConfig';
import { Alert, AlertTitle, Fade } from '@mui/material';
import { addDoc, collection, getDocs, query,where } from 'firebase/firestore';
export const googleAuthContext = createContext();

export function GoogleAuth({ children }) {
  //We call the two parameters of the FirebaseContext, under the same alias the FirebaseConfig Component exports it to the FirebaseContext Provider. 'db' is used to connect the operations with the project's Firestore Database, and the 'authh' does the same but with the Authentication service provided by Firebase. We're goin to use it for the Google SignIn functionality.
  const [db, auth] = useContext(FirebaseContext);
  //In this state we would save the data received from the Google SignIn (displayName, email, timestamp, etc.).
  const [user, setUser] = useState(null);
  const [showSignInAlert,setSignInAlert]=useState(false)
  const [showSignOutAlert,setSignOutAlert]=useState(false)
const [showNoAccountAlert,setShowNoAccountAlert]=useState(false)

  const googleSignIn = async () => {
    try {
      //Await for the signInWithPopup promise. It would create a popup window to access with our/s Google Account/s
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      //in 'user' we assign the user provided by result, i.e, the popup window used to signin
      const user = result.user;
      //Set the user state with the data of the user signup
      setUser(user);
      setSignInAlert(true)
      setTimeout(()=>setSignInAlert(false),5000)
    } catch (error) {
      console.log("Google Sign-In failed", error);
    }
  };
  const googleSignOut=async()=>{
    if(user){
      //When this function it's called, it signOut the user (only if its registered) directly. 
      await signOut(auth)
      setUser(null)
      setSignOutAlert(true)
      setTimeout(() => {
        setSignOutAlert(false)
      }, 5000);
    //We update the user state to be null to avoid possible errors.
    
    window.location.assign("/")
    }else{
      setShowNoAccountAlert(true)
      setTimeout(() => {
        setShowNoAccountAlert(false)
      }, 5000);
    }
  }

  const addUserToDB=async()=>{
      try {
        //Await to getDocs of the 'users' Firestore collection, using the 'query' and 'where' properties of Firestore to only retrieved the documents what are coincidents with the user email.
        const getUser=await getDocs(query(collection(db,"users"),where("email","==",user.email)))
        //If the awaited getDocs returns null/undefined or 0 values
        if (getUser.empty){
          const userData={
            name:user.displayName,
            email:user.email
          }
          //We add a new Document with the user information
          await addDoc(collection(db,"users"),userData)
        }
      } catch (error) {
        console.error("Error al guardar user a la db,"+error)
      }
  }


  useEffect(()=>{
    //onAuthStateChanged verifies the status of the user logg-in. If it's true, it would set the user state with the 'user' data
    onAuthStateChanged(auth,async(user)=>{
      if(user){
        setUser(user)
      }
      //If its null it set the user state to be null.  
      else{
        setUser(null)
      }
    })
  },[user])
  useEffect(()=>{
    //When the user state its true, i.e when we signin with the popup window, or when the onAuthStateChanged saves the user data, we save it to the 'users' collection using the addUserToDB function. 
    if(user){
      addUserToDB()
    }
  },[user])

  return (
    //In the return, we export the Context Provider with the values of the user state, the function to SignIn and the function to SignOut. 
    <googleAuthContext.Provider value={[user, googleSignIn,googleSignOut]}>
      {children}
    {user&&
        <Fade in={showSignInAlert} easing={{exit:"ease-in-out"}}>
      <Alert className='fixed top-2 right-1/2 bg-[--golden-yellow] translate-x-1/2 w-[28rem] h-20' variant='filled' severity='success'>
        <AlertTitle>
          Successful registration
        </AlertTitle>
        <p className='font-bold'>
          Welcome, {user&&user.displayName}
        </p>
      </Alert>
      </Fade>
        }
    {
      !user&&showSignOutAlert&&
      <Fade in={showSignOutAlert} easing={{exit:"ease-in-out"}}>
      <Alert className='fixed top-2 right-1/2 bg-[--golden-yellow] translate-x-1/2 w-[28rem] h-20' variant='filled' color='error' severity='success'>
              <AlertTitle>
                You logged out of your account
              </AlertTitle>
              <p className='font-bold'>
            Session successfully closed
              </p>
            </Alert>
          </Fade>
          }
          {
            !user&&showNoAccountAlert&&
            <Fade in={showNoAccountAlert} easing={{exit:"ease-in-out"}}>
            <Alert className='fixed top-2 right-1/2 bg-[--golden-yellow] translate-x-1/2 w-[28rem] h-24' variant='filled' color='warning' severity='error'>
                    <AlertTitle>
                      No account logged in
                    </AlertTitle>
                    <p className='font-bold'>
                  You have to be logged in to close your account.
                    </p>
                  </Alert>
                </Fade>
          }
      
    </googleAuthContext.Provider>
  );
}
