const express = require("express");
// creating a express instance
const app = express();

const connectDb = require("./config/database");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middlewares/auth");

const User = require("./models/user");

const port = 3000;

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
    try {
        //validation of data
        validateSignUpData(req);

        //encrypt the password
        const { firstName, lastName, emailId, password } = req.body;
        const saltRound = 10;
        const passwordHash = await bcrypt.hash(password, saltRound);
        console.log(passwordHash)

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

app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId: emailId });

        // if user not found
        if (!user) {
            throw new Error("Invalid credentials : Please SignUp")
        }

        // compare pwd with the hash pwd in DB 
        // const isPasswordValid = await bcrypt.compare(password, user.password);

        const isPasswordValid = await validatePassword(password);

        if (isPasswordValid) {

            // create a JWT token - expires in one day
            // const token = await jwt.sign({ _id: user._id }, "DEV@Tinder123",{
            //     expiresIn: "1d",
            // });

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

app.get("/profile", userAuth,  async (req, res) => {
    try {
        res.send(req.user);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

connectDb()
    .then(() => {
        console.log("Database connection established...");
        app.listen(port, () => {
            console.log("Server is successfully up and running");
        });
    })
    .catch(err => {
        console.log("database connection failed check network or serverIP");
    }
    );


console.log("app.js is running");