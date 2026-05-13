"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var pollViewSchema = new mongoose_1.Schema({
    pollId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Poll",
        required: true,
        index: true,
    },
    viewerId: {
        type: String,
        required: true,
        index: true,
    },
    fingerprint: {
        type: String,
        default: null,
    },
    ipAddress: {
        type: String,
        default: null,
    },
}, {
    timestamps: { createdAt: true, updatedAt: false },
});
// Compound index for unique views per poll
pollViewSchema.index({ pollId: 1, viewerId: 1 }, { unique: true });
var PollView = mongoose_1.default.models.PollView || mongoose_1.default.model("PollView", pollViewSchema);
exports.default = PollView;
