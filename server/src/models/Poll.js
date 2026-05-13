"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var pollSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        default: "",
    },
    visibility: {
        type: String,
        enum: ["public", "private"],
        default: "public",
    },
    status: {
        type: String,
        enum: ["draft", "active", "closed"],
        default: "draft",
    },
    allowAnonymous: {
        type: Boolean,
        default: false,
    },
    resultsPublished: {
        type: Boolean,
        default: false,
    },
    allowMultipleSubmissions: {
        type: Boolean,
        default: false,
    },
    viewCount: {
        type: Number,
        default: 0,
    },
    expiresAt: {
        type: Date,
        default: null,
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
});
var Poll = mongoose_1.default.models.Poll || mongoose_1.default.model("Poll", pollSchema);
exports.default = Poll;
