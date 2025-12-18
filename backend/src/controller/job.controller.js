const formModel = require("../models/form.model")
const mongoose=require("mongoose")

async function createJob(req, res) {

    try {
        const { company, JobDescription, role, status, appliedDate } = req.body

        const isApplied = await formModel.findOne({
            userId: req.user.id,
            company
        })

        if (isApplied) {
            return res.status(409).json({
                message: "already created the job with this company"
            })
        }


        const Job = await formModel.create({
            userId: req.user.id,
            company,
            JobDescription,
            role,
            status,
            appliedDate
        })

        res.status(200).json({
            message: "job created successfully",
            Job
        })

    } catch (err) {
        return res.status(500).json({
            message: "Error while creating job",
            error: err.message
        })
    }


}

async function getJob(req, res) {

    try {
        const jobs = await formModel.find({
            userId: req.user.id
        })


        return res.status(200).json({
            message: "Job fetched successfully",
            jobs
        })
    } catch (err) {
        return res.status(500).json({
            message: "Error while loading jobs",
            error: err.message
        })

    }
}

async function getJobById(req, res) {

    try {
        const jobId = req.params.id

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(404).json({ message: "Job not found" });
        }


        const Job = await formModel.findOne({
            _id: jobId,
            userId: req.user.id
        })

        if (!Job) {
            return res.status(404).json({
                message: "no job found"
            })
        }

        return res.status(200).json({
            message: "Job fetched successfull",
            Job
        })


    } catch (err) {
        return res.status(500).json({
            message: "Error while fetching job",
            error: err.message
        })
    }



}

async function updateJob(req, res) {

    try {
        const jobId = req.params.id

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(404).json({ message: "Job not found" });
        }


        const updateJob = await formModel.findOneAndUpdate({
            _id: jobId,
            userId: req.user.id
        }, req.body, { new: true })

        if (!updateJob) {
            return res.status(404).json({
                message: "Job not found"
            })
        }

        return res.status(200).json({
            message: "job update successfull",
            updateJob
        })

    } catch (err) {
        return res.status(500).json({
            message: "Error while creating job"
        })
    }


}

async function deleteJob(req, res) {

    try {
        const jobId = req.params.id


        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(404).json({ message: "Job not found" });
        }



        const job = await formModel.findOneAndDelete({
            _id: jobId,
            userId: req.user.id
        })

        if (!job) {
            return res.status(404).json({
                message: "job not found"
            })
        }

        return res.status(200).json({ message: "job deleted successfully" })

    } catch (err) {
        return res.status(500).json({
            message: "error while deleting job",
            error: err.message
        })
    }

}

module.exports = { createJob, getJob, getJobById, updateJob, deleteJob }