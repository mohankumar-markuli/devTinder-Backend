const express = require("express");
const { userAuth } = require("../middlewares/userAuth");

const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();

// get the pending connection request
userRouter.get('/user/requests/received', userAuth,
    async (req, res) => {
        try {
            const loggedInUser = req.user;

            const connectionRequest = await ConnectionRequest.find({
                toUserId: loggedInUser._id,
                status: "intrested"
            }).populate("fromUserId", "firstName lastName photoUrl age skills");
            // }).populate("fromUserId", ["firstName", "lastName"]);

            res.json({
                message: "Data fetched successfully",
                data: connectionRequest,
            })

        }
        catch (err) {
            res.status(400).send("ERROR : " + err.message);
        }
    });

userRouter.get('/user/connections', userAuth,
    async (req, res) => {
        try {

            const loggedInUser = req.user;

            const connectionRequest = await ConnectionRequest.find({
                $or:[
                    {toUserId: loggedInUser, status:"accepted"},
                    {fromUserId: loggedInUser, status:"accepted"}
                ],
            }).populate("fromUserId", "firstName lastName photoUrl age skills")
            .populate("toUserId", "firstName lastName photoUrl age skills");

            const data = connectionRequest.map((row) => {

                if(row.fromUserId.toString() == loggedInUser._id.toString()){
                    return row.toUserId;
                }
                return row.fromUserId;

            });

            res.json({meaage:"Data Fetched",
                data: data
            })

        } catch (err) {
            res.status(400).send("ERROR : " + err.message);
        }
    });

module.exports = userRouter;