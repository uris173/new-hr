import dotenv from "dotenv";
dotenv.config();

import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { UserModel } from "../models/data/user.js";
let select = 'fullName phone role'

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_TOKEN_SECRET,
};

passport.use(
  new Strategy(opts, async (jwtPayload, done) => {
    try {
      const user = await UserModel.findById(jwtPayload._id, select);
      if (!user) return done(null, false);
      return done(null, user);
    } catch (error) {
      console.error(error);
      return done(error, false);
    }
  })
);


export default passport;