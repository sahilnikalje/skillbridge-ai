import React from 'react'
import { useAuth } from "../hooks/useAuth";
import { Navigate } from 'react-router';

//! here we were using useNavigate but it didn't work
//! so we have used Navigate for protected route
function Protected({children}) {
    const{loading, user}=useAuth()

    if(loading){
        return (<main><h1>Loading...</h1></main>)
    }

    if(!user){
       return <Navigate to={'/login'} />
    }
  return children
}

export default Protected