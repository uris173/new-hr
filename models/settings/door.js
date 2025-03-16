import { Schema, model } from "mongoose";

const doorSchema = new Schema({
  title: String,
  ip: String,
  type: {
    type: String,
    enum: ["enter", "exit"]
  },
  status: {
    type: String,
    enum: ["active", "inactive", "deleted"],
    default: "active"
  }
}, { timestamps: true });


export const DoorModel = model('door', doorSchema);