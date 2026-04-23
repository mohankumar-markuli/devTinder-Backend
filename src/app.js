require("dotenv").config();
const express = require("express");

// creating a express instance
const app = express();
const connectDb = require("./config/database");
const cookieParser = require("cookie-parser");

const cors = require("cors");

// custom DNS provider then default
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT;

const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profileRouter");
const requestRouter = require("./routes/requestRouter");
const userRouter = require("./routes/userRouter");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

app.get("/health", (req, res) => {
    try {
        res.json({
            status: "OK",
            message: "Server is running",
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error(
            new Date().toISOString(),
            "ERROR: ", err.message,
        );

        res.status(400).json({
            message: `Health Check Failed`,
            error: "INTERNAL_SERVER_ERROR",
        });
    }
})

async function startDependencies() {
    try {
        console.log("Starting my Server dependencies...");

        // connect to database
        await connectDb();
        console.log("   - DATABASE connection established...");

        // start the server
        app.listen(port, () => {
            console.log("   - SERVER is up and running...");
            console.log("All dependencies are up and running...");
        });
    }
    catch (err) {
        console.log("database connection failed check network or serverIP");
    }
}

startDependencies();