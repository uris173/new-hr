import { Types, Schema, model } from "mongoose";

const departmentSchema = new Schema({
  name: String,
  type: {
    type: Number,
    enum: [0, 1] // 0 - Department | 1 - Group
  },
  workTime: [{
    day: Number,
    startTime: Date,
    endTime: Date
  }],
  parent: {
    type: Types.ObjectId,
    ref: "department",
    default: null
  },
  chief: {
    type: Types.ObjectId,
    ref: "user",
    default: null
  },
  status: {
    type: String,
    enum: ["active", "inactive", "deleted"],
    default: "active"
  }
}, { timestamps: true });


export const DepartmentModel = model('department', departmentSchema);