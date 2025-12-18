const express=require("express")
const multer= require("multer")
const controller=require("../controller/resume.controller")
const {authUser}=require("../middlewares/auth.middleware")


const router=express.Router()


const upload = multer({ storage: multer.memoryStorage() })



router.post("/upload",authUser,upload.single("resume"),controller.uploadResume)
router.get("/resume",authUser,controller.getResume)
router.post("/resume/optimize/:id",authUser,controller.optimizeResume)





module.exports=router


