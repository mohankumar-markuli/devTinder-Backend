const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

async function sendRequest(req, res) {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const toUser = await User.findById(toUserId);
        if (!toUser) throw new Error("User not exsist");
        if (fromUserId == toUserId) throw new Error("Self request not allowed");

        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) throw new Error("Invalid status type");

        // check is there is exisisting connection request
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId: fromUserId, toUserId: toUserId },
                // any pending request
                { fromUserId: toUserId, toUserId: fromUserId },
            ]
        });

        if (existingConnectionRequest) throw new Error("Connecting request already present");

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });

        const data = await connectionRequest.save();

        res.json({
            message: `${req.user.firstName} marked ${status} to ${toUser.firstName}`,
            data: data
        });

    } catch (err) {
        console.error(
            new Date().toISOString(),
            "ERROR:", err.message,
        );

        res.status(400).json({
            message: `Failed to send request`,
            error: "BAD_REQUEST",
        });
    }
}

async function reviewRequest(req, res) {
    try {
        const requestId = req.params.requestId;
        const status = req.params.status;
        const loggedInUser = req.user;

        // corner cases
        // validate status data
        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) throw new Error("Invalid status type");

        // validated toUser 
        // request should be intrest
        // loggedInUser == toUserId
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        });

        if (!connectionRequest) throw new Error("Connection request not found");

        connectionRequest.status = status;
        const data = await connectionRequest.save();

        res.json({
            message: `${req.user.firstName} ${status} connection request`,
            data: data
        });
    }
    catch (err) {
        console.error(
            new Date().toISOString(),
            "ERROR:", err.message,
        );

        res.status(400).json({
            message: `review request failed `,
            error: "BAD_REQUEST",
        });
    }
}

module.exports = { sendRequest, reviewRequest };
