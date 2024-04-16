import { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { onAuthStateChanged,  multiFactor } from 'firebase/auth';
import { auth } from './firebase'; 
import nhaService from "./services/nhaService"; 
import { setUser, setDbUser, setIsLoading } from './features/user/userSlice'; 

const useAuth = () => {
  let authFlag = true;
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      dispatch(setIsLoading(true));

      if (firebaseUser) {

        // extracting only required data because firebase does not like unserilizable data
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          accessToken: firebaseUser.stsTokenManager.accessToken,
          emailVerified: firebaseUser.emailVerified,
          metadata: {
            creationTime: firebaseUser.metadata.creationTime,
            lastSignInTime: firebaseUser.metadata.lastSignInTime,
          },
          
        };

        try {
        
          const dbUserDetails = await nhaService.getUser(firebaseUser);
          // setting data in redux
          dispatch(setUser(userData)); 
          dispatch(setDbUser(dbUserDetails)); 
        } catch (error) {
          dispatch(setUser(userData));
          
        }
      } else {
        // user not logged in so setting user and dbUser to null
        dispatch(setUser(null));
        dispatch(setDbUser(null));
      }

      // Complete the loading process
      dispatch(setIsLoading(false));
    });

    // Cleanup function to unsubscribe from the auth state listener
    return () => unsubscribe();
  }, [dispatch]); 

};

export default useAuth;
