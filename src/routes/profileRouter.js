const express = require("express");
const profileRouter = express.Router();

const { userAuth } = require("../middlewares/userAuth")
const { editProfile, changePassword } = require("../controller/profileController")

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        res.status(200).json({
            message: `User ${req.user.firstName} fetched Successfully`,
            data: req.user
        });

    } catch (err) {
        console.error(
            new Date().toISOString(),
            "ERROR:", err.message,
        );

        res.status(400).json({
            message: `Failed to fetch user data`,
            error: "NOT_FOUND",
        });
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {

        const loggedInUser = await editProfile(req);

        res.status(200).json({
            message: `Profile Updated Successfully`,
            data: loggedInUser
        });

    } catch (err) {
        console.error(
            new Date().toISOString(),
            "ERROR:", err.message,
        );

        res.status(400).json({
            message: `Failed to update profile`,
            error: "BAD_REQUEST",
        });
    }
});

profileRouter.patch("/profile/changepassword", userAuth, async (req, res) => {
    try {

        await changePassword(req);

        res.cookie("token", null, {
            expires: new Date(Date.now()),
        });

        res.status(200).json({
            message: `Password Changed Successfully`,
        });

    } catch (err) {
        console.error(
            new Date().toISOString(),
            "ERROR:", err.message,
        );

        res.status(400).json({
            message: `Failed to change password`,
            error: "VALIDATION_ERROR",
        });
    }
});

module.exports = profileRouter;