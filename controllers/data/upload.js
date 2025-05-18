import { Upload } from "../../models/logger/upload.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dir = `files/${req.params.path}`;

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: async (req, file, cb) => {
    try {
      const ext = path.extname(file.originalname);
      const newName = `${Date.now()}${ext}`;

      const filePath = `files/${req.params.path}/${newName}`;
      await Upload.create({ filename: filePath, user: req.user._id });

      cb(null, newName, filePath);
    } catch (err) {
      cb(err);
    }
  },
});

export const uploadPhoto = multer({
  storage,
  limits: { fileSize: 200 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file) return cb(new Error("fileNotFound"), false);

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.mimetype)) return cb(new Error("invalidFileType"), false);
    
    cb(null, true);
  },
});

export const uploadSinglePhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      throw { status: 400, message: "fileNotFound" };
    }
    res.status(200).json(`${req.file.destination}/${req.file.filename}`);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const scriptStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      let dir = `files/${req.params.path}`;

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    } catch (error) {
      console.error('Destination error:', error);
      cb(error);
    }
  },
  filename: async (req, file, cb) => {
    try {
      const ext = path.extname(file.originalname);
      const newName = `${Date.now()}${ext}`;

      const filePath = `files/${req.params.path}/${newName}`;

      cb(null, newName, filePath);
    } catch (error) {
      console.error('Filename error:', error);
      cb(error);
    }
  },
});

export const uploadScript = multer({
  storage: scriptStorage,
  limits: { fileSize: 200 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("invalidFileType"), false);
    }
    cb(null, true);
  },
});

export const uploadScriptPhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      throw { status: 400, message: "fileNotFound" };
    }

    res.status(200).json(`${req.file.destination}/${req.file.filename}`);
  } catch (error) {
    console.error(error);
    next(error);
  }
};