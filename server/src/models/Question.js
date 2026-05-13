"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var questionSchema = new mongoose_1.Schema({
    pollId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Poll",
        required: true,
    },
    text: {
        type: String,
        required: true,
        trim: true,
    },
    isMandatory: {
        type: Boolean,
        default: false,
    },
    order: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
var Question = mongoose_1.default.models.Question || mongoose_1.default.model("Question", questionSchema);
exports.default = Question;
