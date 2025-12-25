import axios from "../api/axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const DesktopRow = ({ Job,onDelete }) => {

  const { company, role, status, appliedDate } = Job
  const [open, setopen] = useState()
 
  const navigate = useNavigate()

  const deleteHandler = async () => {

    try {
      const res = await axios.delete(`http://localhost:3000/api/job/${Job._id}`, { withCredentials: true })
      // console.log(res)
      onDelete(Job._id)

    } catch (err) {
      console.log(err)
    }

  }



  return (
    <tr className="border-b border-red-100 hover:bg-red-50 transition">
      <td className="p-3 text-center truncate">{company}</td>
      <td className="p-3 text-center truncate">{role}</td>

      <td className={`px-3 py-1 text-center text-sm `}><span className={`px-2 py-1 rounded-full text-xs
    ${status === "Interview" ? "text-yellow-800 bg-yellow-100" :
          status === "Applied" ? "text-green-800 bg-green-100" : "text-gray-800 bg-gray-100"
        }
      `}>{status}</span></td>
      <td className="p-3 text-center">{appliedDate}</td>

      {/* Actions */}
      <td className="p-3 text-center relative">
        {/* 3-dot button */}
        <button
          className="w-8 h-8 text-lg"
          onClick={() => {
            setopen(!open)
          }}
        >
          ⋮
        </button>

        {/* Dropdown */}
        {open && (
          <div
            className="absolute right-0 bottom-10 mb-2 w-44 bg-white border rounded-lg shadow-xl z-50 overflow-hidden"
          >
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
              onClick={() => navigate(`/page/optimizeResume/${Job._id}`)}
            >
              Optimize Resume
            </button>

            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
              onClick={() => navigate(`/page/jobDetails/${Job._id}`)}
            >
              View Job
            </button>

            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
              onClick={() => navigate(`/page/jobUpdate/${Job._id}`)}
            >
              Update Job
            </button>

            <button
              className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-100"
              onClick={deleteHandler}
            >
              Delete Job
            </button>
          </div>
        )}
      </td>
    </tr>
    
    
  )

}

export default DesktopRow