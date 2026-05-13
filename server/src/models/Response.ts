import mongoose, { Document, Schema } from "mongoose";

export interface IResponse extends Document {
  pollId: mongoose.Types.ObjectId;
  questionId: mongoose.Types.ObjectId;
  selectedOptionId: mongoose.Types.ObjectId;
  respondentId: mongoose.Types.ObjectId | null;
  isAnonymous: boolean;
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const responseSchema = new Schema<IResponse>(
  {
    pollId: {
      type: Schema.Types.ObjectId,
      ref: "Poll",
      required: true,
    },

    questionId: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },

    selectedOptionId: {
      type: Schema.Types.ObjectId,
      ref: "QuestionOption",
      required: true,
    },

    respondentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    isAnonymous: {
      type: Boolean,
      default: false,
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
responseSchema.index({ pollId: 1, createdAt: -1 });
responseSchema.index({ respondentId: 1 });

const Response =
  mongoose.models.Response ||
  mongoose.model<IResponse>("Response", responseSchema);

export default Response;