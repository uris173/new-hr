export { Types, Schema, model } from "mongoose";

const workerSchema = new Schema({
  user: {
    type: Types.ObjectId,
    ref: "user"
  },
  department: {
    type: Types.ObjectId,
    ref: "department"
  },
  group: {
    type: Types.ObjectId,
    ref: "group"
  },
  gender: {
    type: String,
    enum: ["male", "female", "custom"]
  },
  birthDay: Date,
  address: String,
}, { timestamps: true });


export const WorkerModel = model("worker", workerSchema);