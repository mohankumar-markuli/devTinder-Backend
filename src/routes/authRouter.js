const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const authRouter = express.Router();

const { validateSignUpData } = require("../utils/validation");

authRouter.post('/signup', async (req, res) => {
    try {
        //validation of data
        validateSignUpData(req);

        //encrypt the password
        const { firstName, lastName, emailId, password } = req.body;
        const saltRound = 10;
        const passwordHash = await bcrypt.hash(password, saltRound);

        //create new instance
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });

        const savedUser = await user.save();

        const token = await savedUser.getJWT();
        // Add the token to cookie and send the response back to the user
        res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 3600000),
        });

        res.json({
            message: `User  ${firstName} added successfully`,
            data: savedUser
        });

    } catch (err) {
        console.error(err)
        res.status(400).json({ message: `Failed to signup`, error: "VALIDATION_ERROR" });
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId: emailId });

        // if user not found
        if (!user) {
            throw new Error("Invalid credentials : Please SignUp")
        }

        // compare pwd with the hash pwd in DB 
        // const isPasswordValid = await bcrypt.compare(password, user.password);
        const isPasswordValid = await user.validatePassword(password);

        if (isPasswordValid) {
            const token = await user.getJWT();

            // Add the token to cookie and send the response back to the user
            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3600000),
            });
            console.log(`User Login successful : ${emailId} `);

            res.json({
                "message": "Login Successful",
                "data": user
            });
        }
        else {
            throw new Error("Invalid credentials");
        }

    } catch (err) {
        res.status(400).json({
            "ERROR": err.message
        });
    }
});

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.send("Logout Successful");
});

authRouter.post("/forgotpassword", async (req, res) => {
    res.send("Future Implementation");
});

module.exports = authRouter;