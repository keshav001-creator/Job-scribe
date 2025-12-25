const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const userModel = require("../models/user.model")
const redis = require("../db/redis")

async function registerUser(req, res) {

    try {

        const { userEmail, userPassword, fullName: { firstName, lastName } } = req.body

        const isUserExist = await userModel.findOne({
            email: userEmail
        })

        if (isUserExist) {
            return res.status(409).json({
                message: "User already exists"
            })
        }

        const hashedPass = await bcrypt.hash(userPassword, 10)

        const User = await userModel.create({
            email: userEmail,
            password: hashedPass,
            fullName: {
                firstName,
                lastName
            }
        })

        const token = jwt.sign({
            id: User._id,
            email: User.email
        }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" })

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite:"none",
            maxAge: 20 * 60 * 60 * 1000
        })

        res.status(200).json({
            message: "User registered successfully",
            User
        })

    } catch (err) {
        res.status(500).json({
            message: "Error while registering user",
            error: err.message
        })
    }

}


async function loginUser(req, res) {

    try {

        const { userEmail, userPassword } = req.body

        const User = await userModel.findOne({
            email: userEmail
        }).select("+password")


        if (!User) {
            return res.status(400).json({
                message: "User is not registered"
            })
        }

        const isMatch = await bcrypt.compare(userPassword, User.password)

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Password" })
        }

        const token = jwt.sign({
            id: User._id,
            email: User.email,
        }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" })


        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite:"none",
            maxAge: 24 * 60 * 60 * 1000
        })

        return res.status(200).json({ message: "login successfully", User })

    } catch (err) {
        res.status(500).json({
            message: "Error while Logging",
            error: err.message
        })
    }

}

async function getMe(req, res) {
    try {
        const token = req.cookies.token

        if (!token) {
            return res.status(400).json({
                authenticated: false
            })
        }

        const isBlackListed=await redis.get(`blacklist:${token}`)
        
        if(isBlackListed){
            return res.status(401).json(
                {
                    authenticated:false,
                    message:"Token is blacklisted"
                }
            )
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY)


        return res.status(200).json({
            authenticated: true,
            userId: decode.id
        })

    } catch (err) {
        return res.status(500).json({
            message: "Error while Verifying",
            error: err.message
        })
    }


}

async function logoutUser(req, res) {

    try {
        const token = req.cookies.token

        if (token) {
            await redis.set(`blacklist:${token}`, "true", "EX", 24 * 60 * 60)
        }

        res.clearCookie("token", {
            httpOnly: true,
            secure: true
        })

        return res.status(200).json({
            message: "User Logged Out successfully"
        })
    } catch (err) {
        return res.status(500).json({
            message: "Error while logging out",
            error: err.message
        })
    }


}

async function getUser(req, res) {

    try {
        const User = req.user
        return res.status(200).json({
            User
        })
    } catch (err) {

        return res.status(500).json({
            message: "Error while logging out",
            error: err.message
        })

    }
}
module.exports = { registerUser, loginUser, getMe, logoutUser, getUser }

