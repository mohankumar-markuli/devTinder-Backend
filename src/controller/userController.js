const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

async function userRequestReceived(req, res) {
    try {
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", "firstName lastName photoUrl age skills about gender");
        // }).populate("fromUserId", ["firstName", "lastName"]);

        res.json({
            message: "Data fetched successfully",
            data: connectionRequest,
        })

    }
    catch (err) {
        console.error(
            new Date().toISOString(),
            "ERROR:", err.message,
        );

        res.status(400).json({
            message: `Failed to fetch data`,
            error: "BAD_REQUEST",
        });
    }
}

async function userConnections(req, res) {
    try {

        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser, status: "accepted" },
                { fromUserId: loggedInUser, status: "accepted" }
            ],
        })
            .populate("fromUserId", "firstName lastName photoUrl age skills gender about")
            .populate("toUserId", "firstName lastName photoUrl age skills gender about");

        const data = connectionRequest.map((row) => {

            if (row.fromUserId.toString() == loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;

        });

        res.json({
            message: "Data fetched successfully",
            data: data,
        })

    } catch (err) {
        console.error(
            new Date().toISOString(),
            "ERROR:", err.message,
        );

        res.status(400).json({
            message: `Failed to fetch data`,
            error: "BAD_REQUEST",
        });
    }
}

async function userFeed(req, res) {
    try {

        // user must see all cards expect
        // 1. his own card
        // 2. his connections
        // 3. ignored people
        // 4. already sent the connection request

        const loggedInUser = req.user;


        // pagination
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        // find all the connection request (send + received)
        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId");

        // get the user list to hide from feed
        const hideUsersFromFeed = new Set();
        connectionRequest.forEach(req => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        //  fetch the users from db with filter
        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) }, },
                { _id: { $ne: loggedInUser._id }, },
            ]
        }).select("firstName lastName skills about photoUrl")
            .skip(skip)
            .limit(limit);

        res.json({
            message: "Data fetched successfully",
            data: users,
        });


    } catch (err) {
        console.error(
            new Date().toISOString(),
            "ERROR:", err.message,
        );

        res.status(400).json({
            message: `Failed to fetch data`,
            error: "BAD_REQUEST",
        });
    }
}
module.exports = { userRequestReceived, userConnections, userFeed }