const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        first_name: {
            type: String,
            required: true,
        },
        last_name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            max: 50,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            min: 6,
        },
        user_type: {
            type: String,
            enum: ["USER", "GUEST_AUTHOR", "AUTHOR"],
            required: true,
        },
    },
    { timestamps: true }
);

const userModel = mongoose.model("User", UserSchema);

module.exports = userModel