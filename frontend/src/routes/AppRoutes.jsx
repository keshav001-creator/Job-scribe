import {Routes, Route} from "react-router-dom"
import Dashboard from "../pages/Dashboard"
import Home from "../pages/Home"
import Register from "../pages/Register"
import Login from "../pages/Login"
import CreateJob from "../pages/CreateJob"
import  OptmizedResume  from "../pages/OptmizedResume"
import JobDetails from "../pages/JobDetails"
import UpdateJob from "../pages/UpdateJob"


const AppRoutes = () => {
  return (
     <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/page/login" element={<Login/>}></Route>
        <Route path="/page/register" element={<Register/>}></Route>
        <Route path="/page/dashboard" element={<Dashboard/>}></Route>
        <Route path="/page/createJob" element={<CreateJob/>}></Route>
        <Route path="/page/optimizeResume/:id" element={<OptmizedResume/>}></Route>
        <Route path="/page/jobDetails/:id" element={<JobDetails/>}></Route>
        <Route path="/page/jobUpdate/:id" element={<UpdateJob/>}></Route>
    </Routes>
  )
}

export default AppRoutes