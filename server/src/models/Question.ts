import mongoose, { Document, Schema } from "mongoose";

export interface IQuestion extends Document {
  pollId: mongoose.Types.ObjectId;
  text: string;
  isMandatory: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema = new Schema<IQuestion>(
  {
    pollId: {
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IQuestion>("Question", questionSchema);
