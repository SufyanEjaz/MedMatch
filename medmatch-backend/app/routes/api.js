const router = require("express").Router();
const userController = require("../controllers/userController");
const {notFound} = require("../controllers/404Controller");

/***
 * API routes
 */

/**
 * Auth routes
 */
router.post("/login", loginRequest, userController.login);  // Login api

router.post("/users/verify", verifyUserRequest, userController.verifyUser);  // Verify user is first time login

/**
 * User Password routes
 */
router.post("/users/password/forget", userController.forgetPassword);    // when we forget password email goes
router.post("/users/password/update", userController.updatePassword);    // when we create new password for user or change password by otp
router.post("/users/password/change", userController.changePassword);    // when user change his password by self


/**
 * User routes
 */
router.post("/users", createUserRequest, userController.create);  // create new user
router.get("/users", userController.getAll); // get all users
router.get("/users/:id(\\d+)", userController.getByID);   // get user by id
router.put("/users/:id(\\d+)", userController.updateByID); // update user by id
router.delete("/users/:id(\\d+)", userController.removeByID);  // delete user by

/**
 * default routes
 */
router.get("/", notFound);
router.use(notFound);

/**
 * Export module
 */
module.exports = router;
