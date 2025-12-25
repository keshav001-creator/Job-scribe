import axios from "../api/axios"
import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { JobsContext } from "../context/JobContext"

const CreateJob = () => {

  const { addJob } = useContext(JobsContext)

  const [company, setCompany] = useState("")
  const [JobDescription, setJobDescription] = useState("")
  const [role, setRole] = useState("")
  const [status, setStatus] = useState("Applied")
  const [appliedDate, setAppliedDate] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const navigate = useNavigate()



  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/job`,
        {
          company,
          role,
          JobDescription,
          status,
          appliedDate
        },
        { withCredentials: true }
      )

      const job = {
        ...res.data.Job,
        appliedDate: new Date(res.data.Job.appliedDate)
          .toISOString()
          .split("T")[0]
      }

      // Optimistic update
      addJob(job)

      navigate("/page/dashboard")
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setErrorMsg(err.response.data.message)
      } else {
        setErrorMsg("Login Failed. Try again later")
      }
    }
  }

  return (
    <div className="bg-red-50 min-h-full p-5 lg:p-10 ">
      <h1 className="text-center text-red-600 text-2xl font-bold lg:text-3xl">
        Track Your Job
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5 mt-5 lg:w-1/2 lg:mx-auto lg:bg-white lg:p-5 lg:rounded-lg lg:shadow-lg">

          {/* Company */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-600">Company Name</label>
            <input
              className="text-sm p-2 border border-red-200 rounded-md focus:outline-red-600"
              type="text"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>

          {/* Job Description */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-600">Job Details</label>
            <input
              className="text-sm p-2 border border-red-200 rounded-md focus:outline-red-600"
              type="text"
              required
              value={JobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          {/* Role */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-600">Tech Role</label>
            <input
              className="text-sm p-2 border border-red-200 rounded-md focus:outline-red-600"
              type="text"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-600">Status</label>
            <select
              className="text-sm p-2 border border-red-200 rounded-md focus:outline-red-600"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Date */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-600">Applied Date</label>
            <input
              className="text-sm p-2 border border-red-200 rounded-md focus:outline-red-600"
              type="date"
              required
              value={appliedDate}
              onChange={(e) => setAppliedDate(e.target.value)}
            />
          </div>

             {errorMsg && (
                <p className="text-red-500 text-sm">{errorMsg}</p>
              )}
              

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="p-2 rounded-lg text-white text-sm font-medium  bg-red-500 hover:bg-red-600 hover:shadow-lg active:bg-red-700 transition-all duration-150"
          >
            Create Job
          </button>

        </div>
      </form>
    </div>
  )
}

export default CreateJob
