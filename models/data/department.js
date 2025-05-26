import { Types, Schema, model } from "mongoose";

const departmentSchema = new Schema({
  name: String,
  type: {
    type: Number,
    enum: [1, 2], // 1 - Department | 2 - Group
    default: 1
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

departmentSchema.index({ type: 1 });
departmentSchema.index({ status: 1 });


export const DepartmentModel = model('department', departmentSchema);

// {
//   "day": 1,
//   "startTime": "2025-03-11T04:00:00.000Z",
//   "endTime": "2025-03-11T13:00:00.000Z"
// },
// {
//   "day": 2,
//   "startTime": "2025-03-11T04:00:00.000Z",
//   "endTime": "2025-03-11T13:00:00.000Z"
// },
// {
//   "day": 3,
//   "startTime": "2025-03-11T04:00:00.000Z",
//   "endTime": "2025-03-11T13:00:00.000Z"
// },
// {
//   "day": 4,
//   "startTime": "2025-03-11T04:00:00.000Z",
//   "endTime": "2025-03-11T13:00:00.000Z"
// },
// {
//   "day": 5,
//   "startTime": "2025-03-11T04:00:00.000Z",
//   "endTime": "2025-03-11T13:00:00.000Z"
// }