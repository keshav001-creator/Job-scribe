const jwt=require("jsonwebtoken")
const userModel=require("../models/user.model")

async function authUser(req,res, next){

    const {token}=req.cookies

    if(!token){
        return res.status(401).json({
            message:"unauthorised user"
        })
    }

    try{

        const decode=jwt.verify(token,process.env.JWT_SECRET_KEY)

        const User=await userModel.findById(decode.id)

        req.user=User
        next()

    }catch(err){
        return res.status(401).json({
            message:"Invalid or expired token, plesase login again"
        })
    }
}

module.exports={authUser}