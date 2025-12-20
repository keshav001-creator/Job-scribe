import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "../api/axios"
import JobRow from "../components/JobRow"


const Dashboard = () => {


  const navigate = useNavigate()
  const [jobs,setjobs]=useState([])

  const profile = () => { }

  
  const handleDeleteJob=(jobId)=>{
    setjobs(prev=>
    prev.filter(job=> jobId !== job._id)
    )
  }

 const renderJobs=jobs.map((jobObj)=>(
  <JobRow key={jobObj._id} Job={jobObj} onDelete={handleDeleteJob} />
 ))

  useEffect(() => {

    const GetJobs = async () => {

      try {
        const res = await axios.get("http://localhost:3000/api/job", { withCredentials: true })
        console.log(res.data.jobs)
         setjobs(res.data.jobs)

      } catch (err) {
        console.log("error:",err)
      }
    }

    GetJobs()
  }, [])


  return (
    <div>
      <div>
        <h1>Hello,</h1>
        <div>
          <button onClick={profile}>Logo</button>
        </div>
      </div>



      <div className="AddJob">
        <button onClick={() => { navigate("/page/createJob") }}>+Add Job</button>
      </div>
      {/* <div className="uploadResume">
        <button onClick={()=>{navigate("/page/createJob")}}>+Upload Resume</button>
      </div> */}
      <div>
        {jobs.length>0 ? renderJobs : "No Jobs Are there!"}
      </div>


    </div>
  )
}

export default Dashboard