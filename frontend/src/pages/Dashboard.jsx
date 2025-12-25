import { MdOutlineWavingHand } from "react-icons/md";
import { FaRegFileLines } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";

import { useNavigate } from "react-router-dom"
import { useContext, useState, useEffect } from "react"
import { JobsContext } from "../context/JobContext"
import JobRow from "../components/JobRow"
import axios from "../api/axios"
import DesktopRow from "../components/DesktopRow"

const Dashboard = () => {

  const navigate = useNavigate()
  const [File, setFile] = useState()
  const [resume, setResume] = useState(null)
  const [LogoutError,setLogoutError]=useState("")
  const { jobs, deleteJob, updateJob, clearJobs, jobsLoading, User, fetchUser, fetchJobs } = useContext(JobsContext)



  useEffect(() => {
    fetchUser()
    fetchJobs()
    fetchResume()
  }, [])


  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleUpload = async () => {

    if (!File) return

    const formData = new FormData()
    formData.append("resume", File)

    try {

      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/upload`, formData, { withCredentials: true })
      // console.log(res.data.resume.filename)
      setResume(res.data.resume.filename)
      alert("Resume Uploaded Successfully")

    } catch (err) {
      if(err.response?.data?.message){
        setLogoutError(err.response.data.message)
      }else{
        console.log("Failed logout. Try again later ")
      }
    }

  }

  const logOutHandler = async () => {

    const confirmed = window.confirm("Do you want to logout?");
    if (!confirmed) return;

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/logout`, {}, { withCredentials: true })
      clearJobs()
      navigate("/")

    } catch (err) {
      console.log(err)
    }
  }

  const fetchResume = async () => {

    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/resume`, { withCredentials: true })
      setResume(res.data.resume.filename)

    } catch (err) {
      console.log(err)
    }
  }

  const jobsStatusCount = jobs.reduce((acc, job) => {
    acc.total += 1

    if (job.status === "Applied") acc.applied += 1
    if (job.status === "Interview") acc.interview += 1

    return acc
  }, {
    total: 0,
    applied: 0,
    interview: 0
  })

  return (
    <div className="min-h-screen bg-gray-50 p-3">

      {/* Navbar */}
      <div className=" box-border px-4 py-3 flex justify-between items-center lg:p-8 ">
        <div className="flex flex-col">
          <h1 className="text-lg font-bold flex items-center text-red-600 lg:text-3xl">JobScribe</h1>
          <h1 className="text-sm flex items-center text-red-600 lg:text-xl">Hello,{User} <span className="ml-1"></span><MdOutlineWavingHand className="text-lg" /></h1>
        </div>
        <button
          className="text-xs p-1 rounded-md border border-red-500 lg:border-2 
        text-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 transition flex items-center lg:rounded-full lg:px-3 lg:py-2 lg:text-sm lg:font-medium"
          onClick={logOutHandler}
        >
          Logout <span className="ml-1"></span><FaArrowRight className="hidden lg:block text-xs" />
        </button>
      </div>

      {LogoutError && (
        <p className="text-red-500 text-sm text-center">{LogoutError}</p>
      )}
      




      <div className="p-4 max-w-6xl mx-auto">


        {/* status and Actions */}
        <div className=" bg-white  rounded-xl shadow-md  p-3 lg:flex flex-row items-center justify-between lg:items-stretch lg:p-5  ">

          <div className="mb-4 rounded-lg p-4 lg:w-1/3 lg:h-full lg:mb-0">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Resume
            </p>

            <div className="flex items-center gap-3">
              <label className="flex-1 bg-white border border-dashed border-red-300 
      rounded-md px-3 py-2 text-xs text-gray-600 text-center cursor-pointer
      hover:bg-red-50">
                Choose PDF
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>


              <button
                onClick={handleUpload}
                disabled={!File}
                className={`px-4 py-2 rounded-md text-xs font-medium hover:bg-red-600 hover:shadow-lg active:bg-red-700 transition-all duration-150
                  ${File ? "bg-red-500 text-white" : "bg-gray-300 text-gray-500"}`}
              >
                Upload
              </button>
            </div>





            {/* File name */}
            {File ? (
              <div className="mt-2 flex items-center justify-between bg-white border border-red-200 rounded-md px-3 py-2">
                <p className="text-xs text-gray-700 truncate max-w-[70%]">
                  <FaRegFileLines /> {File.name}
                </p>
                <button
                  onClick={() => setFile(null)}
                  className="text-xs text-red-500"
                >
                  Change
                </button>
              </div>
            ) : (
              <p></p>
            )}

            {/* resume display */}

            {resume ? (
              <div className="mt-2 items-center text-red-500 text-sm lg:text-md">
                <span className="text-red-500 font-bold">Uploaded- </span>{resume}
              </div>
            ) : (
              <p className="mt-2 text-xs text-gray-400">
                No resume selected
              </p>
            )}

            <div className="hidden lg:block justify-between items-center mt-10">
              <button
                className="bg-red-500 text-white rounded-full text-sm px-4 py-2 font-medium hover:bg-red-600 hover:shadow-md active:bg-red-700 transition-all duration-150"
                onClick={() => navigate("/page/createJob")}
              >
                + Add Job
              </button>
            </div>
          </div>


          <div className="grid grid-cols-3 text-center mt-10 lg:w-1/2 lg:flex items-center lg:h-full gap-2 ">

            <div className="lg:bg-red-50 lg:flex-1 lg:rounded-lg lg:shadow-md lg:p-6 hover:shadow-lg transition">

              <p className="text-xs font-medium text-red-400 uppercase">
                Interview
              </p>
              <p className="text-lg font-bold text-red-600 mt-2">
                {jobsStatusCount.interview}
              </p>
            </div>

            <div className="lg:bg-red-100 lg:flex-1 lg:rounded-lg lg:shadow-md lg:p-6 hover:shadow-lg transition">
              <p className="text-xs font-medium text-red-600 uppercase">
                Total
              </p>
              <p className="text-lg font-bold text-red-700 mt-2">
                {jobsStatusCount.total}
              </p>
            </div>

            <div className="lg:bg-red-200 lg:flex-1 lg:rounded-lg lg:shadow-md lg:p-6 hover:shadow-lg transition">
              <p className="text-xs font-medium text-red-700 uppercase">
                Applied
              </p>
              <p className="text-lg font-bold text-red-800 mt-2">
                {jobsStatusCount.applied}
              </p>
            </div>

          </div>

          <div className="lg:hidden flex flex-row bg-white justify-between items-center mt-10">
            <button
              className="bg-red-500 text-white rounded-md text-xs px-4 py-2 font-medium"
              onClick={() => navigate("/page/createJob")}
            >
              + Add Job
            </button>
          </div>
        </div>



        {jobsLoading ?
          (<p className="text-red-400 text-center mt-20 lg:text-xl">Loading Jobs...</p>)
          :
          jobs.length > 0 ? (
            <>
              {/* Desktop Table */}

              <div className="hidden lg:block bg-white rounded-lg shadow-md mt-10 p-6 ">

                <table className="w-full table-fixed border-collapse">
                  <thead className="border-b border-red-100 text-red-600">
                    <tr>
                      <th className="font-medium p-3 w-1/4">Company</th>
                      <th className="font-medium p-3 w-1/4">Role</th>
                      <th className="font-medium p-3 w-1/6">Status</th>
                      <th className="font-medium p-3 w-1/6">Date Applied</th>
                      <th className="font-medium p-3 w-12 text-center">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {jobs.map(job => (
                      <DesktopRow
                        key={job._id}
                        Job={job}
                        onDelete={deleteJob}
                        onUpdate={updateJob}
                      />)
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden mt-10">
                {jobs.map(job => (
                  <JobRow key={job._id}
                    onDelete={deleteJob}
                    onUpdate={updateJob}
                    Job={job} />
                ))}
              </div>
            </>
          ) : (
            <p className="text-red-400 text-center mt-20 lg:text-2xl">
              No Jobs are There <br></br>
              Add Jobs to track their status.<br></br>

            </p>
          )}

      </div>
    </div>
  )

}

export default Dashboard