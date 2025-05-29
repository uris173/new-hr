import { Router } from "express";
import passport from "../../middleware/auth.js";
import { top } from "../../middleware/role.js";
const router = Router();

import { all } from "../../controllers/logger/route-logs.js";

router.get("/", passport.authenticate("jwt", { session: false }), top, all);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     RouteLog:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Уникальный идентификатор лога
 *         user:
 *           type: object
 *           nullable: true
 *           properties:
 *             _id:
 *               type: string
 *             username:
 *               type: string
 *             email:
 *               type: string
 *           description: Пользователь, совершивший запрос (может быть null)
 *         ip:
 *           type: string
 *           description: IP-адрес клиента
 *         method:
 *           type: string
 *           description: HTTP-метод запроса
 *         url:
 *           type: string
 *           description: URL запроса
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: Время запроса
 *         params:
 *           type: object
 *           description: Параметры маршрута
 *         query:
 *           type: object
 *           description: Query-параметры запроса
 *         body:
 *           type: object
 *           description: Тело запроса
 *         suspicious:
 *           type: boolean
 *           description: Признак подозрительного запроса
 */

/**
 * @swagger
 * /logger/route-logs:
 *   get:
 *     summary: Получить логи маршрутов (route logs)
 *     tags: [Route logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *         description: ID пользователя для фильтрации
 *       - in: query
 *         name: ip
 *         schema:
 *           type: string
 *         description: IP-адрес для фильтрации
 *       - in: query
 *         name: method
 *         schema:
 *           type: string
 *         description: HTTP-метод для фильтрации (GET, POST и т.д.)
 *       - in: query
 *         name: url
 *         schema:
 *           type: string
 *         description: URL для поиска (поиск по подстроке)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Количество записей на страницу
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Номер страницы
 *     responses:
 *       200:
 *         description: Успешный ответ со списком логов маршрутов
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Общее количество записей
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/RouteLog'
 *       401:
 *         description: Неавторизованный доступ
 *       500:
 *         description: Внутренняя ошибка сервера
 */