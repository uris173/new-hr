import { Schema, Types, model } from "mongoose";

const routeLogsSchema = new Schema({
  user: {
    type: Types.ObjectId,
    ref: "user",
    default: null,
  },
  ip: String,
  method: String,
  url: String,
  timestamp: {
    type: Date,
    default: Date.now
  },
  params: {
    type: Object,
    default: {}
  },
  query: {
    type: Object,
    default: {}
  },
  body: {
    type: Object,
    default: {}
  },
  suspicious : {
    type: Boolean,
    default: false
  }
});

routeLogsSchema.index({ user: 1 });
routeLogsSchema.index({ ip: 1 });
routeLogsSchema.index({ method: 1 });
routeLogsSchema.index({ url: 1 });

export const RouteLogsModel = model("route_logs", routeLogsSchema);