const express = require("express");
const authRouter = express.Router();

const { userSignUp, userLogin, userLogout, forgotPassword
} = require("../controller/authController");

authRouter.post('/signup', userSignUp);
authRouter.post("/login", userLogin);
authRouter.post("/logout", userLogout);
authRouter.post("/forgotpassword", forgotPassword);

module.exports = authRouter;