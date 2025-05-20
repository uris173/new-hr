import { Schema, model } from "mongoose";

const reasonSchema = new Schema({
  title: String,
  shortName: String,
  status: {
    type: String,
    enum: ["active", "inactive", "deleted"],
    default: "active",
  }
}, { timestamps: true });

reasonSchema.index({ title: 1 });


export const ReasonModel = model('reason', reasonSchema);