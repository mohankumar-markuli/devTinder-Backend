const validator = require("validator");

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("Name is not valid");
    }
    else if (!validator.isEmail(emailId)) {
        throw new Error("Email not valid");
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter strong password");
    }
}

const validateEditProfileData = (req) => {
    const allowedEditFields = [
        "firstName",
        "lastName",
        "photoUrl",
        "gender",
        "age",
        "about",
        "skills"
    ];

    const isEditAllowed = Object.keys(req.body).every((field) =>
        allowedEditFields.includes(field)
    );
    return isEditAllowed;
}

const validateChangePassword = async (password, newPassword) => {

    const isOldPasswordValid = await req.user.validatePassword(password);
    if (!isOldPasswordValid) {
        throw new Error("Enter your old password again");
    }

    const isNewPasswordSame = await req.user.validatePassword(newPassword);
    if (isNewPasswordSame) {
        throw new Error("your new password cant be same as old password");
    }

    return !isNewPasswordSame;
}

module.exports = {
    validateSignUpData,
    validateEditProfileData,
    validateChangePassword
};