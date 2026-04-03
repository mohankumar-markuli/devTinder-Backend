const express = require("express");
// creating a express instance
const app = express();
const connectDb = require("./config/database");
const cookieParser = require("cookie-parser");

const port = 3000;

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profileRouter");
const requestRouter = require("./routes/requestRouter");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);

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