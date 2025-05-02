import { Router } from "express";
import passport from "../../middleware/auth.js"
import { all } from "../../middleware/role.js";

const router = Router();
import { uploadPhoto, uploadSinglePhoto, uploadScript, uploadScriptPhoto } from "../../controllers/data/upload.js";

router.post('/photo/:path', passport.authenticate('jwt', { session: false }), all, uploadPhoto.single('file'), uploadSinglePhoto);
router.post('/script-photo/:path', uploadScript.single('file'), uploadScriptPhoto);


export default router;


/**
 * @swagger
 * /upload/photo/{path}:
 *   post:
 *     summary: Загрузка одного фото
 *     description: Загружает одно изображение в указанную директорию.
 *     tags:
 *       - Upload
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Путь, куда загружается фото.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Файл изображения для загрузки.
 *     responses:
 *       200:
 *         description: Файл успешно загружен.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Файл успешно загружен"
 *       400:
 *         description: Ошибка запроса (например, отсутствует файл).
 *       401:
 *         description: Неавторизованный доступ.
 *       500:
 *         description: Внутренняя ошибка сервера.
 */