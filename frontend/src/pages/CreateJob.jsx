import axios from "../api/axios"
import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { JobsContext } from "../context/JobContext"

const CreateJob = () => {

  const { addJob } = useContext(JobsContext)
  const [company, setcompany] = useState("")
  const [JobDescription, setJobDescription] = useState("")
  const [role, setrole] = useState("")
  const [status, setstatus] = useState("Applied")
  const [appliedDate, setappliedDate] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const res = await axios.post("http://localhost:3000/api/job", {
        company,
        role,
        JobDescription,
        status,
        appliedDate

      }, { withCredentials: true })

      const job = {
        ...res.data.Job,
        appliedDate: new Date(res.data.Job.appliedDate)
          .toISOString()
          .split("T")[0]
      }

      addJob(job)
      navigate("/page/dashboard")

    } catch (err) {
      console.log(err)
    }

  }

  return (
    <div className="Job Form">

      <form onSubmit={handleSubmit}>
        <div className="auth-form">

          <label>
            Company Name
            <input
              className="input"
              type="text"
              required
              value={company}
              onChange={(e) => setcompany(e.target.value)}
            />
          </label>

          <label>
            Job Description
            <input
              className="input"
              type="text"
              required
              value={JobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </label>

          <label>
            Tech Role
            <input
              className="input"
              type="text"
              required
              value={role}
              onChange={(e) => setrole(e.target.value)}
            />
          </label>


          <label>Status</label>
          <select
            value={status}
            onChange={(e) => setstatus(e.target.value)}
          >
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Rejected">Rejected</option>
          </select>


          <label>
            Applied Date
            <input
              className="input"
              type="Date"
              required
              value={appliedDate}
              onChange={(e) => setappliedDate(e.target.value)}
            />
          </label>


          <div>
            <button type="submit">Create Job</button>
          </div>


        </div>
      </form>

    </div>
  )
}

export default CreateJob