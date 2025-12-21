import { useNavigate } from "react-router-dom"
import { useContext, useState } from "react"
import { JobsContext } from "../context/JobContext"
import JobRow from "../components/JobRow"
import axios from "../api/axios"

const Dashboard = () => {

  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [resume, setResume] = useState(null)
  const { jobs, deleteJob, updateJob, clearJobs } = useContext(JobsContext)

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleUpload = async () => {

    if (!file) return

    const formData = new FormData()
    formData.append("resume", file)

    try {

      const res = await axios.post("http://localhost:3000/api/upload", formData, { withCredentials: true })
      console.log(res)
      setResume(res.data)
      alert("Resume Uploaded Successfully")

    } catch (err) {
      console.log(err)
    }

  }

  const logOutHandler = async () => {

    const confirmed = window.confirm("Do you want to logout?");
    if (!confirmed) return;

    try {
      const res = await axios.post("http://localhost:3000/api/logout", {}, { withCredentials: true })
      navigate("/page/home")
      clearJobs()

    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div>
      <div>
        <h1>Hello,</h1>
        <div>
          <button >Logo</button>
        </div>
      </div>

      <div className="logout">
        <button onClick={logOutHandler}>Log Out</button>
      </div>



      <div className="AddJob">
        <button onClick={() => { navigate("/page/createJob") }}>+Add Job</button>
      </div>

      <div className="ResumeUpload">


        <label>
          Upload Resume
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
        </label>
        <button onClick={handleUpload}>Upload</button>
      </div>


      <div>
        {jobs.length > 0 ?

          (jobs.map(job =>
            <JobRow
              key={job._id}
              Job={job}
              onDelete={deleteJob}
              onUpdate={updateJob}
            />
          )) : ("No Jobs Are there!")}
      </div>


    </div>
  )
}

export default Dashboard