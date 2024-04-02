import { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase'; 
import nhaService from "./services/nhaService"; 
import { setUser, setDbUser, setIsLoading } from './features/user/userSlice'; 

const useAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
   
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      dispatch(setIsLoading(true)); 

      if (firebaseUser) {

        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          accessToken: firebaseUser.stsTokenManager.accessToken,
          emailVerified: firebaseUser.emailVerified,
          // Simplifying the meta into a serilizable object because redux likes only serilizable data
          metadata: {
            creationTime: firebaseUser.metadata.creationTime,
            lastSignInTime: firebaseUser.metadata.lastSignInTime,
          },
        };

        nhaService.getUser(firebaseUser)
          .then(dbUser => {
            dispatch(setUser(userData)); 
            dispatch(setDbUser(dbUser)); 
            dispatch(setIsLoading(false)); 
          })
          .catch((error) => {
            console.error(error);
            dispatch(setIsLoading(false)); 
          });
      } else {
        
        dispatch(setUser(null));
        dispatch(setDbUser(null)); 
        dispatch(setIsLoading(false)); 
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

};

export default useAuth;
