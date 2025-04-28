import { Types, Schema, model } from "mongoose";

const userSchema = new Schema({
  fullName: String,
  phone: String,
  password: String,
  role: {
    type: String,
    enum: ["admin", "boss", "chief", "worker", "security", "guest"],
  },
  faceUrl: String,
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  department: {
    type: Types.ObjectId,
    ref: 'department',
    default: null
  },
  employeeNo: String,
  doors: [{
    type: Types.ObjectId,
    ref: 'door'
  }],
  sync: [{
    ip: String,
    port: String,
    type: {
      type: String,
      enum: ["enter", "exit"]
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