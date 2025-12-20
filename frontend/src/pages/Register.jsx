import axios from "../api/axios"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

const Register = () => {

  const [firstName, setfirstName] = useState("")
  const [lastName, setlastName] = useState("")
  const [email, setemail] = useState("")
  const [Password, setPassword] = useState("")
  const navigate=useNavigate()

  const handleSubmit=async(e)=>{
      e.preventDefault();
    console.log("registered values.....:",{firstName,lastName,email,Password})

    try{

      const res=await axios.post("http://localhost:3000/api/register",{
        userEmail:email,
        userPassword:Password,
        fullName:{
          firstName,
          lastName
        }
      },{withCredentials:true})

      console.log(res)
      
      navigate("/")

    }catch(err){
      console.log(err)
    }

  }






  return (
    <div>
      <div className="Auth">
        <div></div>
        <div className="">

          <form onSubmit={handleSubmit}>
            <div className="auth-form">

              <label>
                First Name
                <input
                  className="input"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setfirstName(e.target.value)}
                />
              </label>

              <label>
                Last Name
                <input
                  className="input"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setlastName(e.target.value)}
                />
              </label>

              <label>
                Email
                <input
                  className="input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                />
              </label>


              <label>
                Password
                <input
                  className="input"
                  type="password"
                  required
                  value={Password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>

              <div>
                <button type="submit">Create account</button>
              </div>

              <div className="auth-footer">
                <div>Already have an account? <Link to="/page/login">Sign in</Link></div>
              </div>

            </div>
          </form>

        </div>
      </div>
    </div>
  )
}

export default Register