import axios from "../api/axios"
import { useState} from "react"
import {useNavigate ,Link} from "react-router-dom"
 

const Login = () => {

  const [Email, setEmail] = useState("")
  const [Password, setPassword] = useState("")
  const navigate = useNavigate()



  const loginHandler = async (e) => {
    e.preventDefault()

    try {

      const res = await axios.post("http://localhost:3000/api/login",
        {
          userEmail: Email,
          userPassword: Password
        },
        { withCredentials: true })

        console.log(res)

        navigate("/")

    } catch (err) {
      console.log(err)
    }
  }



  return (

    <div>
      <div className="Auth">
        <div></div>
        <div className="">

          <form onSubmit={loginHandler}>
            <div className="auth-form">

              <label>
                Email
                <input
                  className="input"
                  type="email"
                  required
                  value={Email}
                  onChange={(e) => setEmail(e.target.value)}
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
                <button type="submit">Login</button>
              </div>

              <div className="auth-footer">
                <div>Dont't have an account? <Link to="/page/register">Sign up</Link></div>
              </div>

            </div>
          </form>

        </div>
      </div>
    </div>
  )
}

export default Login