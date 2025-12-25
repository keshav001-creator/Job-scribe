import { useNavigate } from "react-router-dom"
import { useState } from "react"
import axios from "../api/axios"

function JobRow({ Job, onDelete }) {

  const { company, role, status, appliedDate } = Job
  const [open, setopen] = useState(false)
  const navigate = useNavigate()

  const deleteHandler = async () => {

    try {
      const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/job/${Job._id}`, { withCredentials: true })
      // console.log(res)
      onDelete(Job._id)

    } catch(err){
      console.log(err)
    }

  }

  return (
    <>
      <div className="lg:hidden bg-white rounded-lg p-2  m-1 shadow-lg text-sm relative ">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-800">
              {role}
            </h3>
            <p className="text-xs text-gray-500">
              {company}
            </p>
          </div>

          {/* 3-dots */}
          <div className="absolute top-2 right-2">
            <button
              className="text-gray-500 px-2 "
              onClick={(e) => {
                e.stopPropagation()
                setopen(!open)
              }}
            >
              ⋮
            </button>
          </div>

        </div>

        <div className="flex justify-between items-center mb-3">
          
          {/* Status badge */}
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full
        ${status === "Interview"
                ? "bg-yellow-100 text-yellow-700"
                : status === "Applied"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
          >
            {status}
          </span>

          <p className="text-xs text-gray-500">
            Applied on {appliedDate}
          </p>
        </div>



       

          {open && (
            <div className="absolute right-4 bottom-full mt-2 bg-white w-30 flex flex-col p-1 border shadow-md z-10 rounded  space-y-1 ">
              <button
                className="px-1  hover:bg-gray-100 rounded"
                onClick={() => navigate(`/page/optimizeResume/${Job._id}`)}
              >
                Optimize Resume
              </button>
              <button
                className="px-2 py-1 hover:bg-gray-100 rounded"
                onClick={() => navigate(`/page/jobDetails/${Job._id}`)}
              >
                View Job
              </button>
              <button
                className="px-2 py-1 hover:bg-red-100 text-red-500 rounded"
                onClick={deleteHandler}
              >
                Delete Job
              </button>
              <button
                className="px-2 py-1 hover:bg-gray-100 rounded"
                onClick={() => navigate(`/page/jobUpdate/${Job._id}`)}
              >
                Update Job
              </button>
            </div>
          )}
        </div>


    </>
  )
}

export default JobRow