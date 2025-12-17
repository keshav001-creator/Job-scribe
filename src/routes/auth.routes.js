const express=require("express")
const validator=require("../middlewares/validator.middleware")
const controller=require("../controller/auth.controller")


const router=express.Router()

//auth routes

router.post("/register",validator.registerUserValidator,controller.registerUser)
router.post("/login",validator.loginUserValidator,controller.loginUser)


module.exports=router


