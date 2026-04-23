const express = require("express");
const profileRouter = express.Router();

const { userAuth } = require("../middlewares/userAuth")
const { viewProfile, editProfile, changePassword } = require("../controller/profileController")

profileRouter.get("/profile/view", userAuth, viewProfile);
profileRouter.patch("/profile/edit", userAuth, editProfile);
profileRouter.patch("/profile/changepassword", userAuth, changePassword);

module.exports = profileRouter;