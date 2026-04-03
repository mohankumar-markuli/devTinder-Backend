const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    "firstName": {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is not valid");
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Enter a Strong Password");
            }
        }
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Gender data is not valid");
            }
        }
    },
    phoroUrl: {
        type: String,
        default: "https://imgs.search.brave.com/9NHdH-oVtf1aR7DtrO_L3frUwQuxfPK3PA8-8BWKi3U/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMzkv/ODQ0Lzk5Ni9zbWFs/bC9wcm9maWxlLXBo/b3RvLWlsbHVzdHJh/dGlvbi1pc29sYXRl/ZC1vbi13aGl0ZS1i/YWNrZ3JvdW5kLW1h/bGUtcGVyc29uLWRl/ZmF1bHQtcHJvZmls/ZS1ncmF5LXBob3Rv/LXBpY3R1cmUtYXZh/dGFyLW1hbi1zaWxo/b3VldHRlLXBsYWNl/aG9sZGVyLXVzZXIt/c3ltYm9sLWZyZWUt/dmVjdG9yLmpwZw",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Photo URL is not valid");
            }
        }
    },
    about: {
        type: String,
        default: "This is a default about a user"
    },
    skills: {
        type: [String],
        max: 5
    }
},
    {
        timestamps: true
    }
);

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "DEV@Tinder123", {
        expiresIn: "7d",
    });
    return token;
};

userSchema.methods.validatePassword = async function(passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(
        passwordInputByUser, 
        passwordHash
    );
    return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);