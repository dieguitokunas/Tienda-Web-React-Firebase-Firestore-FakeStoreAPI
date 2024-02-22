import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { FirebaseContext } from "./FireBaseConfig";
import { Alert, AlertTitle, Fade, LinearProgress } from "@mui/material";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
export const googleAuthContext = createContext();

export function GoogleAuth({ children }) {
  //We call the two parameters of the FirebaseContext, under the same alias the FirebaseConfig Component exports it to the FirebaseContext Provider. 'db' is used to connect the operations with the project's Firestore Database, and the 'auth' does the same but with the Authentication service provided by Firebase. We're goin to use it for the Google SignIn functionality.
  const [db, auth] = useContext(FirebaseContext);
  //In this state we would save the data received from the Google SignIn (displayName, email, timestamp, etc.).
  const [user, setUser] = useState(null);
  const [showSignInAlert, setSignInAlert] = useState(false);
  const [showSignOutAlert, setSignOutAlert] = useState(false);
  const [showNoAccountAlert, setShowNoAccountAlert] = useState(false);
  const [load, setLoad] = useState(false);

  const googleSignIn = async () => {
    try {
      //Await for the signInWithPopup promise. It would create a popup window to access with our/s Google Account/s
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      //in 'user' we assign the user provided by result, i.e, the popup window used to signin
      const user = result.user;
      //Set the user state with the data of the user signup
      setUser(user);
      setSignInAlert(true);
      await new Promise((resolve)=>{
        setTimeout(async() => {
          setSignInAlert(true)
          window.location.reload();
          resolve()
        }, 2000);
      })
    } catch (error) {
      console.log("Google Sign-In failed", error);
    }
  };
  const googleSignOut = async () => {
    if (user) {
      //When this function it's called, it signOut the user (only if its registered) directly.
      //We update the user state to be null to avoid possible errors.
      await signOut(auth);
      setUser(null);
      setSignOutAlert(true);
      await new Promise((resolve) => {
        setTimeout(async () => {
          setSignOutAlert(false);
          window.location.reload();
          resolve();
        }, 2000)
      });
    } else {
      setShowNoAccountAlert(true);
      setTimeout(() => {
        setShowNoAccountAlert(false);
      }, 5000);
    }
  };

  const addUserToDB = async () => {
    try {
      //Await to getDocs of the 'users' Firestore collection, using the 'query' and 'where' properties of Firestore to only retrieved the documents what are coincidents with the user email.
      const getUser = await getDocs(
        query(collection(db, "users"), where("email", "==", user.email))
      );
      //If the awaited getDocs returns null/undefined or 0 values
      if (getUser.empty) {
        const userData = {
          name: user.displayName,
          email: user.email,
        };
        //We add a new Document with the user information
        await addDoc(collection(db, "users"), userData);
      }
    } catch (error) {
      console.error("Error al guardar user a la db," + error);
    }
  };

  useLayoutEffect(() => {
    //onAuthStateChanged verifies the status of the user logg-in. If it's true, it would set the user state with the 'user' data
    onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setUser(user);
        } else {
          //If its null it set the user state to be null.
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoad(true);
      }
    });
  }, [user]);
  useEffect(() => {
    //When the user state its true, i.e when we signin with the popup window, or when the onAuthStateChanged saves the user data, we save it to the 'users' collection using the addUserToDB function.
    if (user) {
      addUserToDB();
    }
  }, [user]);
  if (load) {
    return (
      // In the return, we export the Context Provider with the values of the user state, the function to SignIn and the function to SignOut.
      <googleAuthContext.Provider value={[user, googleSignIn, googleSignOut]}>
        {children}
        {user && showSignInAlert&& (
          <Fade in={showSignInAlert} easing={{ exit: "ease-in-out" }}>
            <Alert
              className=" fixed top-2 right-1/2 bg-[--golden-yellow] translate-x-1/2 min-w-[20rem] w-2/4 h-20"
              sx={{border:'solid var(--golden-yellow) 1px',background:"var(--darker-dark-gray)",color:"var(--golden-yellow)",justifyContent:"center",textAlign:"center"}}
              icon=" "
            >
              <AlertTitle sx={{color:"var(--white-bone)",fontWeight:900}}>Successful registration</AlertTitle>
              <p className="font-medium">Welcome, {user.displayName}. Reloading...</p>
            </Alert>
          </Fade>
        )}
        {!user&&showSignOutAlert&& (
          <Fade in={showSignOutAlert} easing={{ exit: "ease-in-out" }}>
            <Alert
              className=" fixed top-2 right-1/2 bg-[--golden-yellow] translate-x-1/2 min-w-[20rem] w-2/4 h-20"
              sx={{border:'solid var(--golden-yellow) 1px',background:"var(--darker-dark-gray)",color:"var(--golden-yellow)",justifyContent:"center",textAlign:"center"}}
              icon=" "
            >
              <AlertTitle sx={{color:"var(--white-bone)",fontWeight:900}}>You logged out of your account.</AlertTitle>
              <p className="font-medium">Session successfully closed. Reloading...</p>
            </Alert>
          </Fade>
        )}
        {!user && showNoAccountAlert && (
          <Fade in={showNoAccountAlert} easing={{ exit: "ease-in-out" }}>
            <Alert
             className=" fixed top-2 right-1/2 bg-[--golden-yellow] translate-x-1/2 min-w-[20rem] w-2/4 h-20"
             sx={{border:'solid var(--golden-yellow) 1px',background:"var(--darker-dark-gray)",color:"var(--golden-yellow)",justifyContent:"center",textAlign:"center"}}
             icon=" "
            >
              <AlertTitle sx={{color:"var(--white-bone)",fontWeight:900}}>No account logged in</AlertTitle>
              <p className="font-bold">
                You have to be logged in to close your account.
              </p>
            </Alert>
          </Fade>
        )}
      </googleAuthContext.Provider>
    );
  } else {
    return (
      <>
        <div className="w-screen h-screen bg-[--golden-yellow] flex flex-col justify-center opacity-100">
          <LinearProgress variant="query" color="inherit" />
        </div>
      </>
    ); // O cualquier otra acción que desees realizar si load es falso
  }
}
