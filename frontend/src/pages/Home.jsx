import axios from "../api/axios"
import { useState, useEffect } from "react"
import {useNavigate} from "react-router-dom"


const Home = () => {

  const navigate=useNavigate()

  useEffect(()=>{

    const checkAuth=async()=>{

      try{

        const res=await axios.get("http://localhost:3000/api/me",{withCredentials:true})

        if(res.data.authenticated){
          navigate("/page/dashboard")
        }

      }catch(err){
        
      }
    }

    checkAuth()
  },[])

  return (
    <div>

      <button onClick={()=>{navigate("/page/register")}}>Get Started</button>
      <button onClick={()=>{navigate("/page/login")}}>SignIn</button>
      
    </div>
  )
}

export default Home