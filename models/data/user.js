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
  birthDay: Date,
  address: String,
  // doors: [{
  //   type: Types.ObjectId,
  //   ref: 'door'
  // }],
  status: {
    type: String,
    enum: ["active", "inactive", "deleted"],
    default: "active"
  }
}, { timestamps: true })

userSchema.index({ role: 1 });
userSchema.index({ department: 1 });
userSchema.index({ status: 1 });


export const UserModel = model('user', userSchema)