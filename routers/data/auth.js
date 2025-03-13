import { Router } from "express";
import passport from "../../middleware/auth.js";
const router = Router();
import {
  addAdmin,
  login,
  regenerateAccessToken,
  userVerify
} from "../../controllers/data/auth.js";

router.post('/add-admin', addAdmin);
router.post('/login', login);
router.post('/refresh-access-token', regenerateAccessToken);
router.get('/verify', passport.authenticate("jwt", { session: false }), userVerify);


export default router;


/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Методы аутентификации и управления пользователями
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /auth/add-admin:
 *   post:
 *     summary: Создание администратора
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: Пароль администратора
 *     responses:
 *       200:
 *         description: Администратор успешно создан или пароль обновлён
 *       400:
 *         description: Ошибка запроса
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Авторизация пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 description: Номер телефона пользователя
 *               password:
 *                 type: string
 *                 description: Пароль пользователя
 *     responses:
 *       200:
 *         description: Успешная авторизация
 *       400:
 *         description: Ошибка авторизации
 */

/**
 * @swagger
 * /auth/refresh-access-token:
 *   post:
 *     summary: Обновление токена доступа
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Refresh токен пользователя
 *     responses:
 *       200:
 *         description: Токен обновлён
 *       400:
 *         description: Ошибка обновления токена
 */

/**
 * @swagger
 * /auth/verify:
 *   get:
 *     summary: Проверка авторизации пользователя
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успешная проверка
 *       403:
 *         description: Ошибка аутентификации
 */
