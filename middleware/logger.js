import { RouteLogsModel } from "../models/logger/route-logs.js";
import passport from "passport";

export const auth = async (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      console.error('Auth error:', err);
      return next(err);
    }
    if (user) {
      req.user = user;
    }
    next();
  })(req, res, next);
}

export const logger = async (req, res, next) => {
  const logEntry = {
    user: req.user ? req.user._id : null,
    ip: req.headers['x-forwarded-for'] || req.ip,
    method: req.method,
    url: req.originalUrl,
    timestamp: new Date(),
  };

  if (req.method === 'GET' || req.method === 'DELETE') {
    logEntry.params = req.params;
    logEntry.query = req.query;
  } else if (req.method === 'POST' || req.method === 'PUT') {
    logEntry.body = req.body;
  }

  await RouteLogsModel.create(logEntry);

  next();
};