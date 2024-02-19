import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut} from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { FirebaseContext } from './FireBaseConfig';
import { Alert, AlertTitle, Fade } from '@mui/material';
export const googleAuthContext = createContext();

export function GoogleAuth({ children }) {
  const [, auth] = useContext(FirebaseContext);
  const [user, setUser] = useState(null);
  const [showSignInAlert,setSignInAlert]=useState(false)
  const [showSignOutAlert,setSignOutAlert]=useState(false)
const [showNoAccountAlert,setShowNoAccountAlert]=useState(false)

  const googleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = result.user;
      setUser(user);
      setSignInAlert(true)
      setTimeout(()=>setSignInAlert(false),5000)
    } catch (error) {
      console.log("Google Sign-In failed", error);
    }
  };
  const googleSignOut=async()=>{
    if(user){
    signOut(auth)
    setUser(null)
    setSignOutAlert(true)
    setTimeout(() => {
      setSignOutAlert(false)
    }, 5000);
    }else{
      setShowNoAccountAlert(true)
      setTimeout(() => {
        setShowNoAccountAlert(false)
      }, 5000);
    }
  }

  useEffect(()=>{
    onAuthStateChanged(auth,async(user)=>{
      if(user){
        setUser(user)
        console.log(user.email)
      }else{
        setUser(null)
      }
    })
  },[])

  return (
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
