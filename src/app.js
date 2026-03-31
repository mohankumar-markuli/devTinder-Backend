const express = require("express");
const {  userAuth } = require("./middlewares/auth.js");

// creating a express instance
const app = express();
const port = 3000;

app.get('/users', userAuth, (req, res) => {
    console.log(req.url);
    res.send({ "firstName": "Mohankumar", "lastName": "Markuli" });
});

// error handling always keep at the end
app.use("/",(err, req, res, next) =>{
    if (err){
        res.status(500).send("Some Error Occured - contact support team");
    }
});

app.listen(port, () => {
    console.log("Server is successfully up and running");
});

console.log("app.js is running");