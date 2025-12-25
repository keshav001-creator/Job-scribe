import { useParams, useNavigate } from "react-router-dom"
import { useContext } from "react"
import { JobsContext } from "../context/JobContext"


function JobDetails() {

    const { id } = useParams()
    const { jobs } = useContext(JobsContext)
    const navigate = useNavigate()


    const job = jobs.find(jobObj => jobObj._id === id)
    console.log(job)




    if (!job) {
        return <p>Loading...</p>
    }


   return (
  <div className="min-h-screen w-full lg:bg-gradient-to-b from-red-100 via-red-200 to-red-50 flex items-start justify-center lg:py-10">
    <div className="p-5 lg:p-8 max-w-xl lg:max-w-2xl bg-white lg:rounded-xl lg:shadow-lg space-y-6">
      
      {/* Heading */}
      <h1 className="text-2xl lg:text-3xl font-bold text-red-600 text-center">
        Job Details
      </h1>

      {/* Job Info */}
      <div className="space-y-3 text-sm lg:text-base">
        <div className="flex justify-between">
          <span className="text-gray-500 font-medium">Company</span>
          <span className="font-semibold text-gray-800">{job.company}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500 font-medium">Role</span>
          <span className="font-semibold text-gray-800">{job.role}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Status</span>
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              job.status === "Interview"
                ? "text-yellow-800 bg-yellow-100"
                : job.status === "Applied"
                ? "text-green-800 bg-green-100"
                : "text-gray-800 bg-gray-100"
            }`}
          >
            {job.status}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500 font-medium">Applied Date</span>
          <span className="font-semibold text-gray-800">{job.appliedDate}</span>
        </div>
      </div>

      {/* Job Description */}
      <div className="text-sm lg:text-base space-y-1">
        <p className="text-gray-500 font-medium">Description</p>
        <p className="text-gray-700 leading-relaxed">{job.JobDescription}</p>
      </div>

      {/* Call to Action */}
      <p className="text-center text-red-600 font-medium">
        Get Your Resume Optimized by AI
      </p>

      <button
        onClick={() => navigate(`/page/optimizeResume/${job._id}`)}
        className="w-full bg-red-500 hover:bg-red-600 active:bg-red-700 transition text-white py-2 rounded-lg text-sm lg:text-base font-medium "
      >
        Optimize Resume
      </button>

    </div>
  </div>
)


}

export default JobDetails