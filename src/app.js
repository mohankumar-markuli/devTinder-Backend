const express = require("express");

// creating a express instance
const app = express();  
const port = 3000;

app.use((req,res)=>{
    res.send("Hello from the server");
});

app.use('/test',(req,res)=>{
    res.send("Hello from the server test");
});

app.listen(port,() =>{
    console.log("Server is successfully up and running");
});

console.log("app.js is running");