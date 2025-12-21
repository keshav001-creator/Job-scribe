import {useNavigate} from "react-router-dom"
import {useState} from "react"
import axios from "../api/axios"

function JobRow({Job,onDelete,onUpdate}) {

    const{company, JobDescription, role, status, appliedDate }=Job
    const [open,setopen]=useState(false)
    const navigate=useNavigate()

    const deleteHandler=async()=>{

      try{
        const res=await axios.delete(`http://localhost:3000/api/job/${Job._id}`,{withCredentials:true})
        console.log(res)
        onDelete(Job._id)

      }catch(err){
        console.log(err)
      }

    }

  return (
    <div>
        <p>{company}</p>
        <p>{role}</p>
        <p>{status}</p>
        <p>{appliedDate}</p>

        <div>
            <button onClick={(e)=>{
                e.stopPropagation()
                setopen(!open)
            }}>⋮</button>
        </div>

        {open && (
             <div>
                <button onClick={(e)=>navigate(`/page/optimizeResume/${Job._id}`)}>Optmize Resume</button>
                <button onClick={(e)=>navigate(`/page/jobDetails/${Job._id}`)}>View Job</button>
                <button onClick={deleteHandler}>Delete Job</button>
                <button onClick={(e)=>navigate(`/page/jobUpdate/${Job._id}`)}>Update Job</button>
             </div>
        )}
    </div>
  )
}

export default JobRow