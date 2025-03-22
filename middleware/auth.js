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
      if (!jwtPayload || !jwtPayload._id) {
        console.error("Ошибка: jwtPayload._id отсутствует", jwtPayload);
        return done(null, false);
      }

      const user = await UserModel.findById(jwtPayload._id, select).lean();
      if (!user) {
        console.error("Ошибка: Пользователь не найден", jwtPayload._id);
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      console.error("Ошибка при поиске пользователя:", error);
      return done(null, false);
    }
  })
);

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Promise Rejection:", reason);
});


export default passport;