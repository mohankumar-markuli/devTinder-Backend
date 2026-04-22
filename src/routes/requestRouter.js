const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middlewares/userAuth");
const ConnectionRequest = require("../models/connectionRequest");

const User = require("../models/user");

requestRouter.post("/request/send/:status/:toUserId",
    userAuth, async (req, res) => {
        try {
            const fromUserId = req.user._id;
            const toUserId = req.params.toUserId;
            const status = req.params.status;


            const toUser = await User.findById(toUserId);
            if (!toUser) {
                return res.status(400).json({ message: "User not exsist" });
            }

            if (fromUserId == toUserId) {
                return res.status(400).json({ message: "Self request not allowed" });
            }

            const allowedStatus = ["ignored", "interested"];
            if (!allowedStatus.includes(status)) {
                return res.status(400).json({ message: "Invalid status type" });
            }

            // check is there is exisisting connection request

            const existingConnectionRequest = await ConnectionRequest.findOne({
                $or: [
                    { fromUserId: fromUserId, toUserId: toUserId },
                    // any pending request
                    { fromUserId: toUserId, toUserId: fromUserId },
                ]
            });

            if (existingConnectionRequest) {
                return res.status(400).json({ message: "Connecting request already present" });
            }

            const connectionRequest = new ConnectionRequest({
                fromUserId,
                toUserId,
                status,
            });

            const data = await connectionRequest.save();

            res.json({
                message:
                    req.user.firstName + " is " + status + " in " + toUser.firstName,
                data,
            });


        } catch (error) {
            res.status(400).send("ERROR " + error.message);
        }

    });

requestRouter.post("/request/review/:status/:requestId",
    userAuth, async (req, res) => {
        try {
            const requestId = req.params.requestId;
            const status = req.params.status;

            const loggedInUser = req.user;

            // corner cases
            // validate status data
            const allowedStatus = ["accepted", "rejected"];
            if (!allowedStatus.includes(status)) {
                return res.status(400).json({ message: "Invalid status type" });
            }

            // validated toUser 
            // request should be intrest
            // loggedInUser == toUserId
            const connectionRequest = await ConnectionRequest.findOne({
                _id: requestId,
                toUserId: loggedInUser._id,
                status: "interested"
            });


            if (!connectionRequest) {
                return res.status(404).json({ message: "Connection request not found" });
            }

            connectionRequest.status = status;
            const data = await connectionRequest.save();

            res.json({
                message: "Connection request " + status + " accepted ",
                data
            });

        }
        catch (err) {
            res.status(400).send("ERROR in Request " + error.message);
        }
    });

module.exports = requestRouter;