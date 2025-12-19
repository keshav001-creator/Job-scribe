import {Routes, Route} from "react-router-dom"
import Dashboard from "../pages/dashboard"
import Landing from "../pages/landing"
import Register from "../pages/register"
import Login from "../pages/login"


const mainroutes = () => {
  return (
     <Routes>
        <Route path="/page/login" element={<Login/>}></Route>
        <Route path="/page/register" element={<Register/>}></Route>
        <Route path="/page/landing" element={<Landing/>}></Route>
        <Route path="/page/dashboard" element={<Dashboard/>}></Route>
        {/* <Route path="/page/job/:id" element={}></Route> */}
    </Routes>
  )
}

export default mainroutes