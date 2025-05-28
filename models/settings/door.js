import { Types, Schema, model } from "mongoose";

const doorSchema = new Schema({
  branch: {
    type: Types.ObjectId,
    ref: "branch"
  },
  title: String,
  ip: String,
  port: String,
  type: {
    type: String,
    enum: ["enter", "exit"]
  },
  login: String,
  password: String,
  isOpen: {
    type: Boolean,
    default: false
  },
  doorStatus: {
    type: String,
    enum: ["online", "offline"],
    default: "online"
  },
  status: {
    type: String,
    enum: ["active", "inactive", "deleted"],
    default: "active"
  }
}, { timestamps: true });

doorSchema.index({ type: 1 });
doorSchema.index({ isOpen: 1 });
doorSchema.index({ status: 1 });


export const DoorModel = model('door', doorSchema);