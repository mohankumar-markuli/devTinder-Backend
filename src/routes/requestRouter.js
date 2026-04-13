const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middlewares/userAuth");
const ConnectionRequest = require("../models/connectionRequest");

const User = require("../models/user");

requestRouter.post(
    "/request/send/:status/:toUserId",
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

            const allowedStatus = ["ignored", "intrested"];
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

module.exports = requestRouter;