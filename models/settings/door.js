import { Schema, model } from "mongoose";

const doorSchema = new Schema({
  title: String,
  ip: String,
  status: {
    type: String,
    enum: ["active", "inactive", "deleted"],
    default: "active"
  }
}, { timestamps: true });


export const DoorModel = model('door', doorSchema);