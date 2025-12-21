import {useParams} from "react-router-dom"
import {useEffect, useState} from "react"
import axios from "../api/axios"

const OptmizedResume = () => {

  const {id}=useParams()

  const [suggestions,setSuggestions]=useState("")


  useEffect(()=>{

    const fetchSuggestions=async()=>{
    try{

      const res=await axios.post(`http://localhost:3000/api/resume/optimize/${id}`,{},{withCredentials:true})
      console.log(res.data.OptimizedResume)
      setSuggestions(res.data.OptimizedResume)

    }catch(err){
      console.log(err)
    }
  }

  fetchSuggestions()
  },[id])
  
  return (
    <div>
        <h1>AI Suggestion!</h1>
        <pre>{suggestions}</pre>
    </div>
  )
}

export default OptmizedResume