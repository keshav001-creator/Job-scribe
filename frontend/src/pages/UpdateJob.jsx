import { useContext, useState, useEffect } from 'react'
import { useNavigate, useParams} from 'react-router-dom'
import { JobsContext } from "../context/JobContext"
import axios from "../api/axios"

const UpdateJob = () => {

  const { id } = useParams()

  const navigate = useNavigate()
  const { jobs, updateJob } = useContext(JobsContext)

  const job = jobs.find(j => j._id === id)

  const [form, setform] = useState({
    company: "",
    JobDescription: "",
    role: "",
    status: "",
    appliedDate: ""
  })

  useEffect(() => {
    if (job) {
      setform(job)
    }
  }, [job])

  const handleChange = (e) => {
    setform(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }


  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await axios.patch(`http://localhost:3000/api/job/${id}`, form, { withCredentials: true })
      console.log(res.data.updateJob)
      updateJob(res.data.updateJob)
      navigate("/page/dashboard")
    } catch (err) {
      console.log(err)
    }

  }











  return (
    <form onSubmit={handleSubmit}>
      <input name="company" value={form.company} onChange={handleChange} />
      <input name="role" value={form.role} onChange={handleChange} />
      <textarea name="JobDescription" value={form.JobDescription} onChange={handleChange} />

      <select name="status" value={form.status} onChange={handleChange}>
        <option value="Applied">Applied</option>
        <option value="Interview">Interview</option>
        <option value="Rejected">Rejected</option>
      </select>

      <input type="date" name="appliedDate" value={form.appliedDate} onChange={handleChange} />

      <button type="submit">Update Job</button>
    </form>
  )
}

export default UpdateJob