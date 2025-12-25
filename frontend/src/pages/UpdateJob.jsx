import { useContext, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { JobsContext } from "../context/JobContext"
import axios from "../api/axios"

const UpdateJob = () => {

  const { id } = useParams()

  const navigate = useNavigate()
  const { jobs, updateJob } = useContext(JobsContext)
  const [errorMsg, setErrorMsg] = useState("")
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
      const res = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/job/${id}`, form, { withCredentials: true })
      // console.log(res.data.updateJob)
      updateJob(res.data.updateJob)
      navigate("/page/dashboard")
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setErrorMsg(err.response.data.message)
      } else {
        setErrorMsg("Updation Failed. Try again later")
      }
    }

  }











  return (
    <div className='p-7 bg-red-50 lg:bg-gradient-to-b from-red-50 via-red-100 to-red-200 '>
      <h1 className='text-center text-xl font-bold lg:text-3xl text-red-600'>Update Your Job</h1>
      <form className='mt-5 flex flex-col gap-5 lg:bg-white lg:rounded-xl lg:shadow-lg lg:p-10 lg:w-1/2 mx-auto'
        onSubmit={handleSubmit}>

        <div className='flex flex-col gap-1 lg:flex'>

          <label className='text-xs text-gray-600'>Company</label>
          <input className='p-2 rounded-md text-sm border border-red-200 focus:outline-red-600'
            name="company" value={form.company} onChange={handleChange} />
        </div>

        <div className='flex flex-col gap-1'>

          <label className='text-xs text-gray-600'>Tech Role</label>
          <input className='p-2 rounded-md text-sm border border-red-200 focus:outline-red-600'
            name="role" value={form.role} onChange={handleChange} />

        </div>

        <div className='flex flex-col gap-1'>
          <label className='text-xs text-gray-600'>Job Details</label>
          <textarea className='p-2 rounded-md text-sm border border-red-200 focus:outline-red-600'
            name="JobDescription" value={form.JobDescription} onChange={handleChange} />
        </div>

        <div className='flex flex-col gap-1'>
          <label className='text-xs text-gray-600'>Status</label>
          <select className='p-2 rounded-md text-sm border border-red-200 focus:outline-red-600'
            name="status" value={form.status} onChange={handleChange}>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className='flex flex-col gap-1'>
          <label className='text-xs text-gray-600'>Date Applied</label>
          <input className='p-2 rounded-md text-sm border border-red-200 focus:outline-red-600'
            type="date" name="appliedDate" value={form.appliedDate} onChange={handleChange} />

        </div>
        {errorMsg && (
          <p className="text-red-500 text-sm">{errorMsg}</p>
        )}

        <button className='bg-red-500 rounded-lg text-white p-2 text-sm hover:bg-red-600 hover:shadow-lg active:bg-red-700 transition-all duration-150'
          type="submit">Update Job</button>
      </form>
    </div>

  )
}

export default UpdateJob