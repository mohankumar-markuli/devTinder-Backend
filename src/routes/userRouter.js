const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/userAuth");
const { userRequestReceived, userConnections, userFeed } = require("../controller/userController");

userRouter.get('/user/requests/received', userAuth, userRequestReceived);
userRouter.get('/user/connections', userAuth, userConnections);
userRouter.get('/user/feed', userAuth, userFeed);

module.exports = userRouter;