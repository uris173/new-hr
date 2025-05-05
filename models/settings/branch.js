import { Schema, model } from "mongoose";

const branchSchema = new Schema({
  title: String,
  description: String,
  location: {
    address: String,
    type: {
      type: String,
      enum: ["Point"],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true,
    }
  },
  status: {
    type: String,
    enum: ["active", "inactive", "deleted"],
    default: "active",
  }
}, { timestamps: true });


export const BranchModel = model("branch", branchSchema);