const express = require("express");
// creating a express instance
const app = express();

const connectDb = require("./config/database");
const User = require("./models/user");

const port = 3000;

app.use(express.json());

app.post("/signup", async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        console.log("Data saved to DB");
        res.send("User added sussessfully");
    } catch (err) {
        res.status(400).send("Error saving the user " + err.message);
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
            "photoUrl", "about","gender","age","skills"
        ];

        const isUpdateAllowed = Object.keys(data).every((k) =>
            ALLOWED_UPDATES.includes(k)
        );

        if(!isUpdateAllowed){
            throw new Error("Update not allowed");
        }

        if(data?.skills.length>10){
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