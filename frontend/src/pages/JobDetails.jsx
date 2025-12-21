import { useParams, useNavigate } from "react-router-dom"
import {useContext} from "react"
import { JobsContext } from "../context/JobContext"


function JobDetails() {

    const { id } = useParams()
    const {jobs}=useContext(JobsContext)
    const navigate = useNavigate()


    const job=jobs.find(jobObj=>jobObj._id === id)
    console.log(job)


    

    if (!job) {
        return <p>Loading...</p>
    }



    return (
        <div>
            <h1>Job Details</h1>
            <p><b>Company:</b> {job.company}</p>
            <p><b>Role:</b> {job.role}</p>
            <p><b>Status:</b> {job.status}</p>
            <p><b>Applied Date:</b> {job.appliedDate}</p>
            <p><b>Description:</b> {job.JobDescription}</p>
            <div>
                <button onClick={(e) => navigate(`/page/optimizeResume/${job._id}`)}>Optimize Resume</button>
            </div>
        </div>
    )
}

export default JobDetails