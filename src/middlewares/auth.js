const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {

    try {
        // read the token from request cookies

        const cookies = req.cookies;

        // extract token from cookie
        const { token } = cookies;

        if (!token) {
            throw new Error("Token is not valid !!!!!!!!!!")
        }

        //validate the token
        const decodedObj = await jwt.verify(token, "DEV@Tinder123");
        console.log(decodedObj);

        const { _id } = decodedObj;
        const user = await User.findById(_id);

        if (!user) {
            throw new Error("User not found");
        }

        req.user = user;

        next();

    } catch (err) {
        res.status(400).send(err.message);
    }
};


module.exports = {
    userAuth
};