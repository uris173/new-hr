import { Router } from "express";
import passport from "../../middleware/auth.js"
import { all } from "../../middleware/role.js";
import { getDoors } from "../../controllers/api/door.js";
const router = Router();

router.get("/", passport.authenticate("jwt", { session: false }), all, getDoors);


export default router;


/**
 * @swagger
 * /api/door:
 *   get:
 *     summary: Получить список дверей
 *     description: Возвращает список дверей
 *     tags:
 *       - API Doors
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список дверей
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Уникальный идентификатор двери
 *                 ip:
 *                   type: string
 *                   description: IP-адрес двери
 *                 login:
 *                   type: string
 *                   description: Логин для доступа к двери
 *                 password:
 *                   type: string
 *                   description: Пароль для доступа к двери
 *       400:
 *         description: Неверные параметры запроса
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 */

/**
 * @swagger
 * securitySchemes:
 *   bearerAuth:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT
 */