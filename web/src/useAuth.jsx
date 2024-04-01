// this is a custom hook that tells us if an user is logged in or not

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import nhaService from "./services/nhaService";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState(null);
  const [dbUser, setDBUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      
      if (user){
        nhaService.getUser(user)
          .then(data=>{
            //console.log(user)
            //console.log(data)
            setName(`${data.firstName}`)
            setDBUser(data)
            setIsLoading(false)
          }).catch((e) => {
            console.log(e);
            setIsLoading(false);
          })
      } else {
        setIsLoading(false);
      }

      
      
    });

    return () => unsubscribe();
  }, []);

  return { user, isLoading, name, setName, dbUser };
};

export default useAuth;