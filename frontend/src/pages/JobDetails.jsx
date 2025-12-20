import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "../api/axios"


function JobDetails() {

    const { id } = useParams()
    const [job, setjob] = useState(null)
    const navigate = useNavigate()


    useEffect(() => {

        const fetchJob = async () => {

            try {
                const res = await axios.get(`http://localhost:3000/api/job/${id}`, { withCredentials: true })
                setjob(res.data.Job)
            } catch (err) {
                console.log(err)
            }
        }

        fetchJob()
    }, [id])

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
                <button onClick={(e) => navigate("/page/optimizeResume")}>Optimize Resume</button>
            </div>
        </div>
    )
}

export default JobDetails