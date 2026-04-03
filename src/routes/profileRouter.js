const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/userAuth")
const { validateEditProfileData, validateChangePassword } = require("../utils/validation");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        res.send(req.user);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {

        if (!validateEditProfileData(req)) {
            throw new Error("Edit not Allowed")
        }

        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => {
            loggedInUser[key] = req.body[key];
        });

        await loggedInUser.save();

        res.send(`${loggedInUser.firstName}, your profile updated successfully`);

    } catch (err) {
        res.status(400).send(err.message);
    }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {

    try {

        if (!validateChangePassword(req)) {
            throw new Error("Password Change not Allowed")
        }

        const loggedInUser = req.user;
        const newPasswordHash = await bcrypt.hash(req.body.newPassword, 10);

        loggedInUser['password'] = newPasswordHash;
        await loggedInUser.save();

        res.cookie("token", null, {
            expires: new Date(Date.now()),
        });

        res.send("Password Changed Succcessful");
        
    } catch (err) {
        res.status(400).send(err.message);
    }
});

module.exports = profileRouter;