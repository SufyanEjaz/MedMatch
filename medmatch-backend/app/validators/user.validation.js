const {body} = require("express-validator");

module.exports = {

    createUserRequest: [

        body("first_name")
            .exists()
            .withMessage("First name is required"),

        body("last_name")
            .exists()
            .withMessage("Last name is required"),

        body("email")
            .exists()
            .withMessage("Email address is required")
            .isEmail()
            .withMessage("Please Enter Valid Email address"),

        body("password")
            .exists()
            .withMessage("Password is required")
            .isString()
            .withMessage("Password should be string")
            .isLength({min: 5})
            .withMessage("Password should be at least 5 characters"),
    ],

    loginRequest: [

        body("email")
            .exists()
            .withMessage("Email address is required")
            .isEmail()
            .withMessage("Please Enter Valid Email address"),

        body("password")
            .exists()
            .withMessage("Password is required"),
    ],

    refreshTokenRequest: [

        body("refresh_token")
            .exists()
            .withMessage("Refresh Token is required"),
    ],

    verifyUserRequest: [

        body("email")
            .exists()
            .withMessage("Email address is required")
            .isEmail()
            .withMessage("Please Enter Valid Email address"),
    ],

    createPasswordRequest: [

        body("email")
            .exists()
            .withMessage("Email address is required")
            .isEmail()
            .withMessage("Please Enter Valid Email address"),

        body("code")
            .exists()
            .withMessage("OTP is required"),

        body("password")
            .exists()
            .withMessage("Password is required"),

        body("confirm_password")
            .exists()
            .withMessage("Confirm Password is required"),
    ],

    BoothUserRequest: [

        body("first_name")
            .exists()
            .withMessage("First name is required"),

        body("email")
            .exists()
            .withMessage("Email address is required")
            .isEmail()
            .withMessage("Please Enter Valid Email address"),
    ],
};