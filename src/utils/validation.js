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
    const allowedFields = [
        "firstName",
        "lastName",
        "photoUrl",
        "gender",
        "age",
        "about",
        "skills"
    ];

    const restrictedFields = ["emailId", "password"];

    const keys = Object.keys(req.body);

    const invalidFields = keys.filter(
        (field) => !allowedFields.includes(field) && !restrictedFields.includes(field)
    );

    const forbiddenFields = keys.filter(
        (field) => restrictedFields.includes(field)
    );

    if (forbiddenFields.length > 0) {
        throw new Error(
            `Cannot update restricted fields: ${forbiddenFields.join(", ")}`
        );
    }

    if (invalidFields.length > 0) {
        throw new Error(
            `Invalid fields provided: ${invalidFields.join(", ")}`
        );
    }
};

const validateChangePassword = async (req, res) => {

    const { password, newPassword } = req.body;

    const isOldPasswordValid = await req.user.validatePassword(password);
    if (!isOldPasswordValid) {
        throw new Error("Enter your old password again");
    }

    const isNewPasswordSame = await req.user.validatePassword(newPassword);
    if (isNewPasswordSame) {
        throw new Error("New password cant be same as old password");
    }
}

module.exports = {
    validateSignUpData,
    validateEditProfileData,
    validateChangePassword
};