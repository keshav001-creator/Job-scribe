import axios from "../api/axios"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"


const Home = () => {

  const [ErrorMsg, setErrorMsg] = useState("")

  const navigate = useNavigate()

  useEffect(() => {

    const checkAuth = async () => {

      try {

        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/me`, { withCredentials: true })

        if (res.data.authenticated) {
          navigate("/page/dashboard")
        }

      } catch (err) {
        if(err.response?.data?.message){
          setErrorMsg(err.response.data.message)
        }else{
          setErrorMsg("Error Occured while loading. Try again later")
        }
      }
    }

    checkAuth()
  }, [])

  return (
    <div className=" min-h-full p-4 flex flex-col bg-gradient-to-b from-white to-red-50 lg:px-16 py-10">

      {/* nav bar */}
      <nav className="text-xl text-red-500 font-bold lg:text-3xl">JobScribe</nav>
      <hr className="my-2"></hr>


      {/* HeroSection */}
      
      {ErrorMsg && (
        <p className="text-red-500 mt-5 text-center"></p>
      )}
      <div className="flex flex-1 flex-col justify-center text-center lg:flex-row items-center ">

        <div className="w-full  text-center lg:text-left ">
          <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 leading-tight ">
            Track Your Job
            <br />
            Applications Smarter
          </h1>

          <h2 className="mt-2 text-lg font-medium text-gray-700 lg:text-4xl">
            Save jobs. Optimize your resume.
            <br />
            Powered by AI.
          </h2>

          <p className="mt-4 text-gray-600 text-sm lg:mt-1">
            Keep all your job applications in one place, get AI-driven resume suggestions, and never miss a deadline.
          </p>

          <div className="flex flex-row justify-center space-x-5 mt-3 lg:justify-start">

            <button 
            className="bg-red-500 font-semibold text-white py-2 px-4 text-sm rounded-full lg:px-6 hover:bg-red-600 hover:shadow-lg active:bg-red-700 transition-all duration-150 " onClick={() => { navigate("/page/register") }}>
              
              Get Started
              
            </button>

            <button 
            className="border-2 border-red-500 font-semibold text-red-500 py-2 px-4 text-sm rounded-full hover:bg-red-500 hover:text-white hover:shadow-lg active:bg-red-600 transition-all duration-150 lg:px-7 " onClick={() => { navigate("/page/login") }}>
              
            SignIn
            
            </button>
          </div>

        </div>


        <div className="hidden lg:flex lg:w-1/2 justify-center">
          <img
            src="/hero-dashboard.svg"
            alt="JobScribe Dashboard"
            className="w-full max-w-md "
          />
        </div>

      </div>


    </div>
  )
}

export default Home