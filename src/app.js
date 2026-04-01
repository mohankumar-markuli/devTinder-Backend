const express = require("express");
// creating a express instance
const app = express();
const connectDb = require("./config/database");
const User = require("./models/user");

const port = 3000;


app.post("/signup", async (req, res) => {
    const user = new User({
        firstName: "abc",
        lastName: "xyz",
        email: "abcxyz@gmail.com",
        password: "abcxyz@123"
    });
    try {
        await user.save();
        res.send("User added sussessfully");
    } catch(err){
        res.status(400).send("Error saving the user" + err.message);
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
        console.log("Cannot establish database connection");
    }
    );


console.log("app.js is running");