const { validateEditProfileData, validateChangePassword } = require("../utils/validation");
const bcrypt = require("bcrypt");

async function viewProfile(req, res) {
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
}

async function editProfile(req, res) {
    try {
        if (!validateEditProfileData(req)) {
            throw new Error("Editing EmailId or Password not allowed")
        }
        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => {
            loggedInUser[key] = req.body[key];
        });

        await loggedInUser.save();

        res.status(200).json({
            message: `Profile Updated Successfully`,
            data: loggedInUser
        });

    } catch (err) {
        console.error(
            new Date().toISOString(),
            "ERROR:", err
        );

        res.status(400).json({
            message: `Failed to update profile`,
            error: "BAD_REQUEST",
        });
    }
}

async function changePassword(req, res) {
    try {

        await validateChangePassword(req, res);

        const loggedInUser = req.user;
        const saltRounds = parseInt(process.env.SALT_ROUNDS);
        const newPasswordHash = await bcrypt.hash(req.body.newPassword, saltRounds);

        loggedInUser['password'] = newPasswordHash;
        await loggedInUser.save();

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
}

module.exports = { viewProfile, editProfile, changePassword };