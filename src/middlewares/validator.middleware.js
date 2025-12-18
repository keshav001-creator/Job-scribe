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

const formValidator = [
    body("company")
        .notEmpty().withMessage("Company name is required")
        .isString().withMessage("company name should be in string")
        .trim(),

    body("JobDescription")
        .isString().withMessage("Must be a String")
        .notEmpty().withMessage("JobDescription is required")
        .isLength({ min: 20, max: 2000 })
        .withMessage("JobDescription must be between 20 and 2000 characters")
        .trim(),

    body("role")
        .isString().withMessage("Must be a String")
        .notEmpty().withMessage("JobDescription is required")
        .trim(),


    body("status")
        .isIn(["applied", "interview", "rejected"])
        .withMessage("Status must be applied, interview, or rejected")
        .notEmpty().withMessage("status is required")
        .trim(),

    body("appliedDate").isString().withMessage("AppliedDate must be a String")
        .notEmpty().withMessage("Applied date is required")
        .trim(),

    UserValidationResponse
]

const formUpdateValidator = [
    body("company")
        .optional()
        .notEmpty().withMessage("Company name is required")
        .isString().withMessage("company name should be in string")
        .trim(),

    body("JobDescription")
        .optional()
        .isString().withMessage("Must be a String")
        .notEmpty().withMessage("JobDescription is required")
        .isLength({ min: 20, max: 2000 })
        .withMessage("JobDescription must be between 20 and 2000 characters")
        .trim(),

    body("role")
        .optional()
        .isString().withMessage("Must be a String")
        .notEmpty().withMessage("JobDescription is required")
        .trim(),


    body("status")
        .optional()
        .isIn(["applied", "interview", "rejected"])
        .withMessage("Status must be applied, interview, or rejected")
        .notEmpty().withMessage("status is required")
        .trim(),

    body("appliedDate")
        .optional()
        .isString().withMessage("AppliedDate must be a String")
        .notEmpty().withMessage("Applied date is required")
        .trim(),

    UserValidationResponse
]




module.exports = {
    registerUserValidator,
    loginUserValidator,
    formValidator,
    formUpdateValidator
}