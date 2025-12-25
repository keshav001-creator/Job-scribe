import { createContext, useState, useEffect } from "react"
import axios from "../api/axios"


export const JobsContext = createContext()

export const JobsProvider = ({ children }) => {

    const [jobs, setJobs] = useState([])
    const [User, setUser] = useState([])
    const [jobsLoading, setJobsLoading] = useState(true);



    const fetchJobs = async () => {

        try {
            setJobsLoading(true)
            const res = await axios.get("http://localhost:3000/api/job", { withCredentials: true })
            const jobsWithFormattedDate = (res.data.jobs || []).map(job => ({
                ...job,
                appliedDate: new Date(job.appliedDate).toISOString().split("T")[0]
            }))
            setJobs(jobsWithFormattedDate)

        } catch (err) {
            console.log(err)
        } finally {
            setJobsLoading(false);
        }

    }


    const fetchUser = async () => {

        try {

            const res = await axios.get("http://localhost:3000/api/user", { withCredentials: true })
            //    console.log(res.data.User.fullName.firstName)
            setUser(res.data.User.fullName.firstName)

        } catch (err) {
            console.log(err)
        }

    }

    useEffect(() => {
    fetchJobs()
  }, [])


    const clearJobs = () => setJobs([])


    const deleteJob = (id) => setJobs(prev => prev.filter(job => job._id !== id))

    const updateJob = (updatedJob) => {
        setJobs(prev =>
            prev.map(job =>
                job._id === updatedJob._id ? updatedJob : job
            )
        )
    }

    const addJob = (newJob) => setJobs(prev => [...prev, newJob])

    return (

        <JobsContext.Provider value={{ jobs, deleteJob, addJob, updateJob, clearJobs, fetchJobs, User, fetchUser,jobsLoading }}>
            {children}
        </JobsContext.Provider>
    )

}
