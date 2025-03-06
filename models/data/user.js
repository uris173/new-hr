import { Types, Schema, model } from "mongoose";

const userSchema = new Schema({
  fullName: String,
  phone: String,
  password: String,
  role: {
    type: String,
    enum: ["admin", "boss", "chief", "worker", "guest"],
  },
  faceUrl: String,
  department: {
    type  : Types.ObjectId,
    ref: 'department',
    default: null
  },
  workTime: [{
    day: Number,
    startTime: Date,
    endTime: Date
  }],
  employeeNo: String,
  sync: [{
    ip: String,
    type: {
      type: Number,
      enum: [0, 1] //  0 - exit | 1 - enter
    },
    status: {
      type: Boolean,
      default: true
    }
  }],
  status: {
    type: String,
    enum: ["active", "inactive", "deleted"],
    default: "active"
  }
}, { timestamps: true })


export const UserModel = model('user', userSchema)