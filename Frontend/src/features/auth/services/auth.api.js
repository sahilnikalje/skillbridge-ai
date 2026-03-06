import axios from 'axios'

//todo to avoid the repetative code we use this
const API=axios.create({
    baseURL:import.meta.env.VITE_API_URL,
    //! axios does not have access to cookies, so we use this
    // withCredentials:true
})
//!for deployement
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

export async function register({name, email, password}){
    try{
        const response=await API.post('/api/auth/register', {
            name, email, password
        })
        //!deployement
        localStorage.setItem('token', response.data.token)
        return response.data
    }
    catch(err){
        console.log("registerErr: ", err.message)
        throw new Error(err.response?.data?.message)
    }
}

export async function login({email, password}){
    try{
        const response=await API.post("/api/auth/login", {
            email, password
        })
        localStorage.setItem('token', response.data.token)
        return response.data
    }
    catch(err){
        console.log("loginErr: ", err.message)
        throw new Error(err.response?.data?.message)
    }
}

export async function logout(){
    try{
       const response=await API.get("/api/auth/logout")
       localStorage.removeItem('token')
       return response.data
    }
    catch(err){
        console.log("logoutErr: ", err.message)
        throw new Error(err.response?.data?.message)
    }
}

export async function getMe(){
    try{
        const response=await API.get("/api/auth/get-me")

        return response.data
    }
    catch(err){
        console.log("getMeErr: ", err.message)
        throw new Error(err.response?.data?.message)
    }
}