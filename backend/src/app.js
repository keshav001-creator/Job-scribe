const express=require("express")
const authRoutes=require("./routes/auth.routes")
const jobRoutes=require("./routes/job.routes")
const resumeRoutes=require("./routes/resume.routes")
const cookieParser=require("cookie-parser")

const app=express()


app.use(express.json())
app.use(cookieParser())

app.use("/api",authRoutes)
app.use("/api",jobRoutes)
app.use("/api",resumeRoutes)


module.exports=app