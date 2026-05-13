import mongoose, { Document, Schema } from "mongoose";

export interface IQuestionOption extends Document {
  questionId: mongoose.Types.ObjectId;
  text: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const questionOptionSchema = new Schema<IQuestionOption>(
  {
    questionId: {
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
  }
);

const QuestionOption = mongoose.models.QuestionOption || mongoose.model<IQuestionOption>(
  "QuestionOption",
  questionOptionSchema
);
export default QuestionOption;
