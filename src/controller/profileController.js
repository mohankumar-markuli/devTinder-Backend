const { validateEditProfileData, validateChangePassword } = require("../utils/validation");
const bcrypt = require("bcrypt");

async function editProfile(req) {

    if (!validateEditProfileData(req)) {
        throw new Error("Editing EmailId or Password not allowed")
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => {
        loggedInUser[key] = req.body[key];
    });

    await loggedInUser.save();

    return loggedInUser;
}

async function changePassword(req) {

    const { password, newPassword } = req.body;

    if (!validateChangePassword(password, newPassword)) {
        throw new Error("Password Change not Allowed")
    }

    const loggedInUser = req.user;
    const saltRounds = parseInt(process.env.SALT_ROUNDS);
    const newPasswordHash = await bcrypt.hash(req.body.newPassword, saltRounds);

    loggedInUser['password'] = newPasswordHash;
    await loggedInUser.save();
}

module.exports = { editProfile, changePassword };