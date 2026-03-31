const express = require("express");

// creating a express instance
const app = express();  
const port = 3000;


app.get('/users',(req,res)=>{
    console.log(req.url);
    res.send({"firstName":"Mohankumar","lastName":"Markuli"});
});


app.listen(port,() =>{
    console.log("Server is successfully up and running");
});

console.log("app.js is running");