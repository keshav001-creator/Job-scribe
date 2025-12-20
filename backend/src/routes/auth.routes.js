const express=require("express")
const validator=require("../middlewares/validator.middleware")
const controller=require("../controller/auth.controller")
const {authUser}=require("../middlewares/auth.middleware")


const router=express.Router()

router.post("/register",validator.registerUserValidator,controller.registerUser)
router.post("/login",validator.loginUserValidator,controller.loginUser)
router.get("/me",controller.getMe)
router.post("/logout",controller.logoutUser)
router.get("/user",authUser,controller.getUser)

module.exports=router


