import { Schema, Types, model } from "mongoose";

const doorLoggerSchema = new Schema({
  avg: {
    type: Number,
    default: null,
  },
  door: {
    type: Types.ObjectId,
    ref: "door"
  },
  status: {
    type: String,
    enum: ["online", "offline"],
  }
}, { timestamps: true });

doorLoggerSchema.index({ door: 1 });
doorLoggerSchema.index({ status: 1 });

export const DoorLoggerModel = model("door_logger", doorLoggerSchema);