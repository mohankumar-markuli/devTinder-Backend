const express = require("express");
// creating a express instance
const app = express();
const connectDb = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

const port = 3000;
const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profileRouter");
const requestRouter = require("./routes/requestRouter");
const userRouter = require("./routes/userRouter");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDb()
    .then(() => {
        console.log("Database connection established...");
        app.listen(port, () => {
            console.log("Server is up and running...");
        });
    })
    .catch(err => {
        console.log("database connection failed check network or serverIP");
    }
    );

console.log("Starting my Server dependencies...");