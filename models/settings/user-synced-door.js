import { Schema, Types, model } from "mongoose";

const userSyncedDoorScheme = new Schema({
  door: {
    type: Types.ObjectId,
    ref: "door",
  },
  user: {
    type: Types.ObjectId,
    ref: "user",
  },
  status: {
    type: String,
    emum: ["pending", "success", "error"],
    default: "pending"
  }
}, { timestamps: true });

userSyncedDoorScheme.index({ door: 1, user: 1 }, { unique: true });
userSyncedDoorScheme.index({ door: 1 });
userSyncedDoorScheme.index({ user: 1 });
userSyncedDoorScheme.index({ status: 1 });

export const UserSyncedDoorModel = model("user_synced_door", userSyncedDoorScheme);