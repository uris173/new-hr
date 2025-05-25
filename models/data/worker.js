import { Types, Schema, model } from "mongoose";

const workerHistorySchema = new Schema({
  user: {
    type: Types.ObjectId,
    ref: "user"
  },
  company: String,
  staffPosition: String,
  enterDate: Date,
  leaveDate: Date,
  comment: String,
}, { timestamps: true });

workerHistorySchema.index({ worker: 1 });


export const WorkerHistoryModel = model("worker_history", workerHistorySchema);