const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({

    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,

    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`
        },
    }
},
    {
        timestamps: true
    }
);

// index to prevent duplicate connection request between same users
// indexing will optimize the query performance
connectionRequestSchema.index(
    { fromUserId: 1, toUserId: 1 },
    { unique: true }
);


// connectionRequestSchema.pre("save",function(next){
//     const connectionRequest = this;

//     if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
//         throw new Error("Cannot send connection request to yourself");
//     }
//     next();
// });

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);
