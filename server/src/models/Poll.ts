import mongoose, { Document, Schema } from "mongoose";

export interface IPoll extends Document {
  title: string;
  description: string;
  visibility: "public" | "private";
  status: "draft" | "active" | "closed";
  allowAnonymous: boolean;
  resultsPublished: boolean;
  expiresAt: Date | null;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const pollSchema = new Schema<IPoll>(
  {
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

    expiresAt: {
      type: Date,
      default: null,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Poll = mongoose.models.Poll || mongoose.model<IPoll>("Poll", pollSchema);
export default Poll;
