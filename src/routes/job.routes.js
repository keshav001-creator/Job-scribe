const express=require("express")
const validator=require("../middlewares/validator.middleware")
const controller=require("../controller/job.controller")
const {authUser}=require("../middlewares/auth.middleware")

const router=express.Router()

router.post("/job",authUser,validator.formValidator,controller.createJob)
router.get("/job",authUser,controller.getJob)
router.get("/job/:id",authUser,controller.getJobById)
router.patch("/job/:id",authUser,validator.formUpdateValidator,controller.updateJob)
router.delete("/job/:id",authUser,controller.deleteJob)
 

module.exports=router


