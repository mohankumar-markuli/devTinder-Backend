const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");

async function userSignUp(req, res) {
    try {
        //validation of data
        validateSignUpData(req);

        //encrypt the password
        const { firstName, lastName, emailId, password } = req.body;
        const saltRounds = parseInt(process.env.SALT_ROUNDS);
        const passwordHash = await bcrypt.hash(password, saltRounds);

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

        res.status(200).json({
            message: `User ${savedUser.firstName} added successfully`,
            data: savedUser
        });
    }
    catch (err) {
        console.error(
            new Date().toISOString(),
            "ERROR: ", err.message,
        );

        res.status(400).json({
            message: `Failed to signup`,
            error: "VALIDATION_ERROR",
        });
    }
}

async function userLogin(req, res) {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });

        // if user not found
        if (!user) {
            throw new Error("New User : Please SignUp")
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

            res.json({
                "message": `${user.firstName} Logged In Successfully`,
                "data": user
            });
        }
        else {
            throw new Error("Invalid credentials");
        }

    } catch (err) {
        console.error(
            new Date().toISOString(),
            "ERROR: ", err.message,
        );
        res.status(400).json({
            message: err.message,
            error: "VALIDATION_ERROR",
        });
    }
}

async function userLogout(req, res) {
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
}

async function forgotPassword(req, res) {
    res.json({
        message: `Future Implementation`,
        data: null
    });
}
module.exports = {
    userSignUp, userLogin, userLogout, forgotPassword
}