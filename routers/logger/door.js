import { Router } from "express";
import passport from "../../middleware/auth.js";
import { top } from "../../middleware/role.js";
const router = Router();

import { all } from "../../controllers/logger/door.js";

router.get("/", passport.authenticate("jwt", { session: false }), top, all);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     DoorLogger:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Уникальный идентификатор записи лога двери
 *         avg:
 *           type: number
 *           nullable: true
 *           description: Среднее время отклика или другое среднее значение (если используется)
 *         door:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *           description: Данные двери
 *         status:
 *           type: string
 *           enum: [online, offline]
 *           description: Статус двери
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Дата и время создания записи
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Дата и время обновления записи
 */

/**
 * @swagger
 * /logger/door:
 *   get:
 *     summary: Получить логи статусов дверей
 *     tags: [Door logger]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: door
 *         schema:
 *           type: string
 *         description: ID двери для фильтрации
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [online, offline]
 *         description: Статус двери для фильтрации
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Количество записей на страницу
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Номер страницы
 *     responses:
 *       200:
 *         description: Успешный ответ со списком логов дверей
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
 *                     $ref: '#/components/schemas/DoorLogger'
 *       401:
 *         description: Неавторизованный доступ
 *       500:
 *         description: Внутренняя ошибка сервера
 */