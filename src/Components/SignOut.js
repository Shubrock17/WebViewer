import React,{useEffect} from 'react';
import { logout } from "../Config";
const SignOut = () => {
  useEffect(() => {
    logout();
  }, [])
  return <h1>You have successfully logged out  </h1>
}

export default SignOut;