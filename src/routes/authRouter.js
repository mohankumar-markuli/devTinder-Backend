const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const {validateSignUpData} = require("../utils/validation");
const bcrypt = require("bcrypt");


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

        await user.save();
        console.log("Data saved to DB");
        res.send("User added sussessfully");

    } catch (err) {
        res.status(400).send("Validation Error " + err.message);
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
            res.cookie("token", token);
            res.send("password valid : Login Successful")
        }
        else {
            throw new Error("Invalid credentials");
        }

    } catch (err) {
        res.status(400).send("Error Occured with Login : " + err.message);
    }
});


module.exports = authRouter;