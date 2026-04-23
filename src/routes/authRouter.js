const express = require("express");
const authRouter = express.Router();

const { userSignUp, userLogin
} = require("../controller/authController");

authRouter.post('/signup', async (req, res) => {
    try {
        const { savedUser, token } = await userSignUp(req);

        // Add the token to cookie and send the response back to the user
        res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 3600000),
        });

        res.status(200).json({
            message: `User ${savedUser.firstName} added successfully`,
            data: savedUser
        });

    } catch (err) {
        console.error(
            new Date().toISOString(),
            "ERROR: ", err.message,
        );

        res.status(400).json({
            message: `Failed to signup`,
            error: "VALIDATION_ERROR",
        });
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { user, token } = await userLogin(req);

        // Add the token to cookie and send the response back to the user
        res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 3600000),
        });

        res.json({
            "message": `${user.firstName} Logged In Successfully`,
            "data": user
        });

    } catch (err) {
        console.error(
            new Date().toISOString(),
            "ERROR: ", err.message,
        );
        res.status(400).json({
            message: `Invalid credentials`,
            error: "VALIDATION_ERROR",
        });
    }
});

authRouter.post("/logout", async (req, res) => {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
        });
        res.json({
            message: `Logout Successful`,
        });;
    } catch (err) {
        console.error(
            new Date().toISOString(),
            "ERROR: ", err.message,
        );
        res.status(400).json({
            message: `Failed to logout`,
            error: "SERVER_ERROR",
        });
    }
});

authRouter.post("/forgotpassword", async (req, res) => {
    res.json({
        message: `Future Implementation`,
        data: null
    });
});

module.exports = authRouter;