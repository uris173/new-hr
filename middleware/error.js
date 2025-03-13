import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getMessage = (value, language = "ru") => {
  const filePath = join(__dirname, "../messages", `${language}.json`);
  const jsonFile = JSON.parse(readFileSync(filePath, "utf-8"));

  return jsonFile[value];
};

export const ErrorMiddleware = (err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    res.status(400).json({
      message: `Entity parse failed! Expected double-quoted property name in JSON`,
    });
    return;
  }

  let language = req.user?.language || 'ru';
  let errorMessage = getMessage(err.code || err.message || "serverError", language);

  res.status(err.status || 500).json({ message: errorMessage });
};