const express = require("express");
const requestRouter  = express.Router();
const {userAuth} = require("../middlewares/userAuth");

requestRouter.post("", userAuth, async (req,res)=>{

    const user = req.user;
    console.log("Sending the connection request");
    res.send(user.firstName + "sent a connection request");
});

module.exports = requestRouter;