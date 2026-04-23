const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");


async function userSignUp(req) {
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

    return { savedUser, token };
}

async function userLogin(req) {
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
        return { user, token };
    }
    else {
        throw new Error("Invalid credentials");
    }
}

module.exports = {
    userSignUp, userLogin
}