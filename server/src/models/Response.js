"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var responseSchema = new mongoose_1.Schema({
    pollId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Poll",
        required: true,
    },
    questionId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Question",
        required: true,
    },
    selectedOptionId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "QuestionOption",
        required: true,
    },
    respondentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    isAnonymous: {
        type: Boolean,
        default: false,
    },
    fingerprint: {
        type: String,
        default: null,
    },
    voterId: {
        type: String,
        default: null,
    },
    ipAddress: {
        type: String,
        default: null,
    },
    deviceInfo: {
        browser: String,
        os: String,
        device: String,
        userAgent: String,
        screenResolution: String,
        language: String,
    },
    timeTaken: {
        type: Number,
        default: 0,
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});
// Indexes for performance
responseSchema.index({ pollId: 1, createdAt: -1 });
responseSchema.index({ respondentId: 1 });
var Response = mongoose_1.default.models.Response ||
    mongoose_1.default.model("Response", responseSchema);
exports.default = Response;
