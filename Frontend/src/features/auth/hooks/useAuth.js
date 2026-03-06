import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import {register, login, logout, getMe} from '../services/auth.api'

export const useAuth=()=>{
    const {user, setUser, loading, setLoading}=useContext(AuthContext)

    const handleLogin=async({email, password})=>{
        //todo till the user logs in, loading willl be shown
        setLoading(true)

        try{
           //! calling login function
           //todo as we have send user data in backend login controller, so it will be stored in this data variable also 
          const data=await login({email, password})
          if(data){
            setUser(data.user) //** here we can access the loggedin user data from data  */            
            return {success:true, data}  
          }
        }
        catch(err){
            console.log("handleLoginErr: ", err.message)
            return {success:false, message:err.message}
        }
        finally{
          //todo again set loading as false
          setLoading(false)
        }
    }

    const handleRegister=async({name, email, password})=>{
        setLoading(true)

        try{
            const data=await register({name, email, password})
             if(data){
                 setUser(data.user)
                 return {success:true, data}
             }
        }
        catch(err){
            console.log('handleRegisterErr: ', err.message)
            return {success:false, message:err.message}
        }
        finally{ 
            setLoading(false)
        }
    }

    const handleLogout=async()=>{
        setLoading(true)
        
        try{
            const data=await logout()
            setUser(null)
        }
        catch(err){
            console.log('handleLogoutErr: ', err.message)
        }
        finally{
            setLoading(false)
        }
    }

 //**page refresh logout problem resolved here */
 useEffect(()=>{
     const getAndSetUser=async()=>{
        try{
            const data=await getMe()
            if(data && data.user){
                setUser(data.user)
            }
        }
        catch(err){
            console.log("getAndSetUserErr: ", err.message)
        }
        finally{
            setLoading(false)
        }
     }
     getAndSetUser()
 },[])
    return {user, loading, handleLogin, handleRegister, handleLogout}
}