import { Types, Schema, model } from "mongoose";

const workerSchema = new Schema({
  user: {
    type: Types.ObjectId,
    ref: "user"
  },
  department: [{
    type: Types.ObjectId,
    ref: "department"
  }],
  groups: [{
    type: Types.ObjectId,
    ref: "group"
  }],
  gender: {
    type: String,
    enum: ["male", "female", "custom"]
  },
  birthDay: Date,
  address: String,
  status: {
    type: String,
    enum: ["active", "inactive", "deleted"]
  },
}, { timestamps: true });

workerSchema.index({ department: 1 });
workerSchema.index({ groups: 1 });
workerSchema.index({ status: 1 });

const workerHistorySchema = new Schema({
  worker: {
    type: Types.ObjectId,
    ref: "worker"
  },
  company: String,
  staffPosition: String,
  enterDate: Date,
  leaveDate: Date,
  comment: String,
}, { timestamps: true });

workerHistorySchema.index({ worker: 1 });


export const WorkerModel = model("worker", workerSchema);
export const WorkerHistoryModel = model("worker_history", workerHistorySchema);