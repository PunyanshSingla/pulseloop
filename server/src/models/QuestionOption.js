"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var questionOptionSchema = new mongoose_1.Schema({
    questionId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Question",
        required: true,
    },
    text: {
        type: String,
        required: true,
        trim: true,
    },
    order: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
var QuestionOption = mongoose_1.default.models.QuestionOption || mongoose_1.default.model("QuestionOption", questionOptionSchema);
exports.default = QuestionOption;
