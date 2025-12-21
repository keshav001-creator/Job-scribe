// const { createWorker } = require("tesseract.js")
const pdf = require("pdf-parse");
const resumeModel = require("../models/resume.model")
const formModel = require("../models/form.model")
const generateResponse = require("../services/ai.service")

async function uploadResume(req, res) {

    try {

        if (!req.file) {
            return res.status(400).json({ message: "Resume file is required" })
        }


        if (req.file.mimetype !== "application/pdf") {
            return res.status(400).json({ message: "only pdf resumes are supported" })
        }

        const data = await pdf(req.file.buffer)

        const extractedText = data.text.trim()

        if (!extractedText) {
            return res.status(400).json({
                message: "resume content is empty"
            })
        }

        const resume = await resumeModel.findOneAndUpdate(
            {userId: req.user.id},
            {content: extractedText},
            { new: true, upsert: true }
        );

        return res.status(200).json({ message: "resume uploaded successfully", resume })

    } catch (err) {
        return res.status(500).json({ message: "Error fetching resume", error: err.message });
    }


}

async function getResume(req, res) {

    try {

        const resume = await resumeModel.findOne({
            userId: req.user.id
        })

        if (!resume) {
            return res.status(404).json({ message: "Resume not found, upload resume" })
        }

        return res.status(200).json({
            message: "Resume fetched successfully",
            resume
        })

    } catch (err) {
        return res.status(500).json({
            message: "Error while fetching resume",
            error: err.message
        })
    }


}

async function optimizeResume(req, res) {

    try {
        const jobId = req.params.id;

        const job = await formModel.findOne({
            _id: jobId,
            userId: req.user.id
        })

        if (!job) {
            return res.status(400).json({
                message: "job not found"
            })
        }

        const baseResume = await resumeModel.findOne({
            userId: req.user.id
        })

        if (!baseResume) {
            return res.status(400).json({ message: "Resume not found, upload your resume" })
        }

        const prompt = `
        You are an expert ATS-friendly resume reviewer and resume optimization specialist.

Below is a candidate's BASE RESUME:
${baseResume.content}

Below is the JOB DESCRIPTION for which the candidate is applying:
Company: ${job.company}
Role: ${job.role}
Job Description:
${job.JobDescription}

Your task is to:
- Identify mistakes, gaps, or weak areas in the base resume
- Suggest clear, practical improvements to better match the job description
- Optimize the resume for ATS keyword matching
- Improve clarity, impact, and relevance for the given role
- Do NOT add fake skills, experience, or achievements
- Do NOT rewrite the entire resume

Output rules:
- Return ONLY the suggested changes
- Present suggestions under clear headings (e.g., "Skills", "Experience", "Summary", "Projects", etc.)
- Use concise points
- Each point should describe WHAT to change and HOW to improve it
- Keep suggestions easy to understand and actionable
- Do NOT include explanations, introductions, or conclusions
`

        const OptimizedResume = await generateResponse(prompt)

        return res.status(200).json({
            message: "Resume optimization successfull",
            OptimizedResume
        })

    } catch (err) {
        return res.status(500).json({
            message:"error while optimizing resume",
            error:err.message
        })
    }




}
module.exports = { uploadResume, getResume, optimizeResume}