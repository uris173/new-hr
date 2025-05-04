import { UserModel } from "../../models/data/user.js";
import { hash, verify } from "argon2";
import jwt from "jsonwebtoken";
const { verify: JwtVerify, sign } = jwt;
import {
  LoginValidation
} from "../../validations/data/auth.js"

const generateToken = (user, generate, refresh, exp) => {
  const payload = {
    _id: user._id,
    fullName: user.fullName,
    phone: user.phone,
    department: user.department,
    faceUrl: user.faceUrl
  };

  let accessToken = null;
  let refreshToken = null;

  if (generate) {
    accessToken = sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: exp || '7d'
    });
  } if (generate) {
    refreshToken = sign({ _id: user._id }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });
  }

  return {
    ...(generate && { accessToken, expiresIn: 3600 }),
    ...(refresh && { refreshToken }),
    user: payload,
  };
}

export const addAdmin = async (req, res, next) => {
  try {
    const { password } = req.body;

    const findAdmin = await UserModel.findOne({ role: "admin" }, "_id");

    if (!findAdmin) {
      await UserModel.create({
        fullName: "Admin",
        phone: "998 (99) 000-00-00",
        password: await hash(password || "12345"),
        role: "admin",
        faceUrl: "files/admin.jpg"
      });
      return res.status(200).json({ message: "Администратор успешно создан!" });
    }

    if (password) {
      await UserModel.findByIdAndUpdate(findAdmin._id, { password: hash(password) });
      return res.status(200).json({ message: "Пароль администратора успешно изменен!" });
    }

    res.status(200).json({ message: "Администратор уже существует!" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getToken = async (req, res, next) => {
  try {
    let user = await UserModel.findOne({ role: "admin" }, "fullName phone password faceUrl department status");
    if (!user) throw { status: 400, message: "userNotFound" };

    res.status(200).json(generateToken(user, true, true, "24h"));
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export const login = async (req, res, next) => {
  try {
    let { error } = LoginValidation(req.body);
    if (error) throw { status: 400, message: error.details[0].message };

    let { phone, password } = req.body;
    let findUser = await UserModel.findOne({ phone }, 'fullName phone password faceUrl department status');

    if (!findUser) throw { status: 400, message: "userNotFound" };
    if (!(await verify(findUser.password, password))) throw { status: 400, message: "incorectPassword" };
    if (!findUser.status) throw { status: 400, message: "profileInactive"};

    res.status(200).json(generateToken(findUser, true, true));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const regenerateAccessToken = async (req, res, next) => {
  try {
    let { refreshToken } = req.body;
    if (!refreshToken) throw { status: 400, message: "tokenNotFound" };

    let decode = null;
    try {
      decode = JwtVerify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    } catch (error) {
      throw { status: 400, message: "tokenExpired" };
    }

    if (typeof decode !== "object" || !decode._id) throw { status: 400, message: "tokenInvalid" };

    let user = await UserModel.findById(decode._id, "fullName phone faceUrl department");
    if (!user) throw { status: 400, message: "userNotFound" };

    res.status(200).json(generateToken(user, true, false))
  } catch(error) {
    console.error(error);
    next(error);
  }
};

export const userVerify = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) throw { status: 403, message: "authError" };

    let findUser = await UserModel.findById(user._id, "fullName phone faceUrl department");
    if (!user) throw { status: 400, message: "userNotFound" };

    res.status(200).json(generateToken(findUser, false, false));
  } catch (error) {
    console.error(error);
    next(error);
  }
};