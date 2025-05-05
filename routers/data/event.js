import { Router } from "express";
import passport from "../../middleware/auth.js";
import { manage } from "../../middleware/role.js";
const router = Router();

import { all, eventSync } from "../../controllers/data/event.js";

router.get("/", passport.authenticate("jwt", { session: false }), manage, all);
router.get("/sync", eventSync); //  passport.authenticate("jwt", { session: false }), manage, 


export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Уникальный идентификатор события
 *         type:
 *           type: string
 *           description: Тип события
 *         time:
 *           type: string
 *           format: date-time
 *           description: Время события
 *         user:
 *           $ref: '#/components/schemas/User'
 *           description: Данные пользователя
 *         door:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               description: ID двери
 *             title:
 *               type: string
 *               description: Название двери
 *           description: Данные двери
 *       required:
 *         - _id
 *         - type
 *         - time
 *         - user
 *         - door
 * 
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID пользователя
 *         fullName:
 *           type: string
 *           description: Полное имя пользователя
 *         role:
 *           type: string
 *           description: Роль пользователя
 *         department:
 *           $ref: '#/components/schemas/Department'
 *           description: Данные департамента
 *       required:
 *         - _id
 *         - fullName
 *         - role
 *         - department
 * 
 *     Department:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID департамента
 *         name:
 *           type: string
 *           description: Название департамента
 *         type:
 *           type: string
 *           description: Тип департамента
 *       required:
 *         - _id
 *         - name
 *         - type
 * 
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /event:
 *   get:
 *     summary: Получить список событий
 *     description: Возвращает список событий с возможностью фильтрации по типу, пользователю, двери или департаменту, с поддержкой пагинации. События включают данные о пользователе (с департаментом) и двери.
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Количество событий на странице (по умолчанию 30)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Номер страницы (по умолчанию 1)
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Тип события (например, face, card)
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *         description: ID пользователя, связанного с событием
 *       - in: query
 *         name: door
 *         schema:
 *           type: string
 *         description: ID двери, связанной с событием
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: ID департамента для фильтрации событий по пользователям из этого департамента
 *     responses:
 *       200:
 *         description: Успешный ответ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Общее количество событий
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 *                   description: Список событий
 *               example:
 *                 count: 100
 *                 data:
 *                   - _id: "event_id_1"
 *                     type: "face"
 *                     time: "2025-04-25T10:00:00Z"
 *                     user:
 *                       _id: "user_id_1"
 *                       fullName: "Иван Иванов"
 *                       role: "employee"
 *                       department:
 *                         _id: "dept_id_1"
 *                         name: "IT отдел"
 *                         type: "technical"
 *                     door:
 *                       _id: "door_id_1"
 *                       title: "Главный вход"
 *       400:
 *         description: Неверные параметры запроса
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 */
/**
 * @swagger
 * /event/sync:
 *   post:
 *     summary: Запустить синхронизацию событий
 *     description: Запускает процесс синхронизации событий между устройствами и базой данных. Синхронизация инициируется через WebSocket.
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               start:
 *                 type: string
 *                 format: date-time
 *                 description: Дата и время начала синхронизации
 *               end:
 *                 type: string
 *                 format: date-time
 *                 description: Дата и время окончания синхронизации
 *     responses:
 *       200:
 *         description: Успешный ответ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Сообщение о статусе синхронизации
 *               example:
 *                 message: "Синхронизация событий начата!"
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