import {useNavigate} from "react-router-dom"
import {useState} from "react"
import axios from "../api/axios"

function JobRow(props) {

    const{company, JobDescription, role, status, appliedDate }=props.Job
    const [open,setopen]=useState(false)
    const navigate=useNavigate()

    const deleteHandler=async()=>{

      try{
        const res=await axios.delete(`/api/job/${props.Job._id}`,{withCredentials:true})
        console.log(res)
        props.onDelete(props.Job._id)

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
                <button onClick={(e)=>navigate("/page/optimizeResume")}>Optmize Resume</button>
                <button onClick={(e)=>navigate(`/page/jobDetails/${props.Job._id}`)}>View Job</button>
                <button onClick={deleteHandler}>Delete Job</button>
                <button onClick={(e)=>navigate("/page/jobUpdate")}>Update Job</button>
             </div>
        )}
    </div>
  )
}

export default JobRow