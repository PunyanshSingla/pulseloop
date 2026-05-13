import mongoose, { Document, Schema } from "mongoose";

export interface IPollView extends Document {
  pollId: mongoose.Types.ObjectId;
  viewerId: string; // voterId or userId
  fingerprint: string | null;
  ipAddress: string | null;
  createdAt: Date;
}

const pollViewSchema = new Schema<IPollView>(
  {
    pollId: {
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Compound index for unique views per poll
pollViewSchema.index({ pollId: 1, viewerId: 1 }, { unique: true });

const PollView = mongoose.models.PollView || mongoose.model<IPollView>("PollView", pollViewSchema);
export default PollView;
