import axios from "../api/axios"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

const Register = () => {

  const [firstName, setfirstName] = useState("")
  const [lastName, setlastName] = useState("")
  const [email, setemail] = useState("")
  const [Password, setPassword] = useState("")
  const [ErrorMsg, setErrorMsg] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("registered values.....:", { firstName, lastName, email, Password })

    try {

      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/register`, {
        userEmail: email,
        userPassword: Password,
        fullName: {
          firstName,
          lastName
        }
      }, { withCredentials: true })

      console.log(res)

      navigate("/")

    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setErrorMsg(err.response.data.message)
      } else {
        setErrorMsg("Register Failed. Try again later")
      }
    }

  }






  return (
    <div className="min-h-screen lg:flex items-center justify-center  lg:bg-gradient-to-b from-white to-red-50">
      <div className="Auth w-full bg-white flex flex-col lg:flex-row lg:max-w-5xl lg:rounded-2xl lg:shadow-xl lg:w-2/3">

        {/* left */}
        <div className="hidden lg:flex flex-col bg-red-500 w-1/2 text-white items-center justify-center p-6 lg:rounded-l-2xl ">
          <h2 className="text-4xl font-bold mb-4 text-center">
            Welcome to <br></br>JobScribe
          </h2>
          <p className="opacity-90">
            Track applications. Optimize resumes. Get hired faster
          </p>
        </div>

        {/* right */}
        <div className="flex flex-col items-center p-8 lg:w-1/2">

          <h1 className="page-title text-2xl font-bold mt-5 lg:text-4xl ">SignUp</h1>
          <p className="page-sub text-sm lg:hidden">Create Your Account</p>

          <form onSubmit={handleSubmit} className="mt-7  w-full">
            <div className="auth-form flex flex-col gap-5">

              <div className="grid grid-cols-1 gap-5">
                <label className="hidden">First Name</label>
                <input
                  className="input w-full p-2 text-sm bg-gray-100"
                  placeholder="First name"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setfirstName(e.target.value)}
                />


                <label className="hidden"> Last Name</label>
                <input
                  className="input w-full p-2 text-sm bg-gray-100"
                  type="text"
                  required
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setlastName(e.target.value)}
                />

              </div>



              <label className="hidden">  Email</label>
              <input
                className="input w-full p-2 text-sm bg-gray-100"
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setemail(e.target.value)}
              />




              <label className="hidden">Password</label>
              <input
                className="input w-full p-2 text-sm bg-gray-100"
                type="password"
                required
                placeholder="Password"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {ErrorMsg && (
                <p className="text-xs text-red-500">{ErrorMsg}</p>
              )}
              <div>
                <button className="bg-red-500 w-full p-2 rounded-3xl text-white hover:bg-red-600 hover:shadow-lg active:bg-red-700 transition-all duration-150"
                  type="submit">Create account</button>
              </div>
            </div>
            <div className="auth-footer text-sm mt-3 text-center">
              <div>Already have an account? <Link className="text-red-500 underline"
                to="/page/login" >Sign in</Link></div>
            </div>
          </form>

        </div>
      </div>
    </div>
  )
}

export default Register