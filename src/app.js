const express = require("express");
// creating a express instance
const app = express();

const connectDb = require("./config/database");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

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
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (isPasswordValid) {

            // create a JWT token
            const token = await jwt.sign({ _id: user._id }, "DEV@Tinder123");
            console.log("Token: ", token);

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

app.get("/profile", async (req, res) => {

    try {
        const cookies = req.cookies;
        console.log(cookies);

        const { token } = cookies;
        // validate my token

        const decodedTokenMessage = await jwt.verify(token, "DEV@Tinder123");
        console.log(decodedTokenMessage)

        const {_id} = decodedTokenMessage;

        const user = await User.findById(_id);
        if(!user){
            throw new Error("User not found");
        }
        res.send(user);

    } catch (err) {
        res.status(400).send(err.message);
    }
});


app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;
    try {
        const users = await User.findOne({ emailId: userEmail });
        if (users.length === 0) {
            res.status(404).send("User not found");
        } else {
            res.send(users);
        }
    } catch (err) {
        res.status(400).send(err.message);
    }
});

app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        const users = await User.findByIdAndDelete(userId);
        res.send("user deleted successfully");
    } catch (err) {
        res.status(400).send(err.message);
    }
});

app.patch("/user/:userID", async (req, res) => {
    const userId = req.params?.userID;
    const data = req.body;

    try {
        // API level validation
        const ALLOWED_UPDATES = [
            "photoUrl", "about", "gender", "age", "skills"
        ];

        const isUpdateAllowed = Object.keys(data).every((k) =>
            ALLOWED_UPDATES.includes(k)
        );

        if (!isUpdateAllowed) {
            throw new Error("Update not allowed");
        }

        if (data?.skills.length > 10) {
            throw new Error("Skills cannot be more then 10");
        }

        const users = await User.findByIdAndUpdate({ _id: userId }, data,
            {
                returnDocument: 'after',
                runValidators: true
            }
        );
        res.send("user updated successfully");
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