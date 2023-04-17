const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }, 
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
            max: 500,
        },
        status: {
            type: String,
            enum: ["DRAFT", "PUBLISHED"],
            required: true,
            default: "DRAFT",
        },
    },
    { timestamps: true }
);

const noteModel = mongoose.model("Note", NoteSchema);

module.exports = noteModel