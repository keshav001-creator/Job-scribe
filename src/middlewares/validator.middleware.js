const { body, validationResult } = require("express-validator")

const UserValidationResponse = (req, res, next) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    next()
}

const registerUserValidator = [

    body("userEmail")
        .isEmail()
        .withMessage("Enter valid Email Address"),

    body("userPassword")
        .isLength({ min: 6 })
        .withMessage("Minimum length of the password must be 6"),

    body("fullName.firstName")
        .isString()
        .withMessage("FirstName must be a string")
        .notEmpty()
        .withMessage("it is required"),


    body("fullName.lastName")
        .isString()
        .withMessage("LastName must be a string")
        .notEmpty()
        .withMessage("it is required"),

    UserValidationResponse

]


const loginUserValidator = [
  
    body("userEmail")
        .optional()
        .isString()
        .withMessage("email did not matched"),

    body("userPassword")
        .isLength({ min: 6 })
        .withMessage("Password must be of length 6"),

 
        UserValidationResponse
    
]


module.exports = {
    registerUserValidator,
    loginUserValidator,
}