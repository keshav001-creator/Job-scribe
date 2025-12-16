const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const userModel = require("../models/user.model")

async function registerUser(req, res) {

    const { userEmail, userPassword, fullName: { firstName, lastName } } = req.body

    const isUserExist = await userModel.findOne({
        email: userEmail
    })

    if (isUserExist) {
        return res.status(200).json({
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
        maxAge: 20 * 60 * 60 * 1000
    })

    res.status(200).json({
        message: "User registered successfully",
        User
    })


}


async function loginUser(req, res) {

    const { userEmail, userPassword } = req.body

    const User = await userModel.findOne({
        email: userEmail
    }).select("+password")


    if (!User) {
        return res.status(400).json({
            message: "user is not registered"
        })
    }

    const isMatch =await bcrypt.compare(userPassword, User.password)

    if (!isMatch) {
        return res.status(400).json({ message: "Password is invalid" })
    }

    const token = jwt.sign({
        id: User._id,
        email: User.email,
    }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" })


    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000
    })

    return res.status(200).json({ message: "login successfully", User })

}

module.exports = { registerUser,loginUser }

