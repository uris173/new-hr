import { Router } from "express";
import passport from "../../middleware/auth.js";
import { top } from "../../middleware/role.js";
import { validateObjectId } from "../../middleware/validate.js";
const router = Router();

import {
  all,
  create,
  getOne,
  changeStatus,
  update,
  remove
} from "../../controllers/settings/door.js";

router.route('/')
.all(passport.authenticate('jwt', { session: false }), top)
.get(all)
.post(create)
.put(update);

router.get('/status/:id', passport.authenticate('jwt', { session: false }), validateObjectId('params', 'id'), changeStatus);

router.route('/:id')
.all(passport.authenticate('jwt', { session: false }), validateObjectId('params', 'id'), top)
.get(getOne)
.delete(remove);


export default router;


// door.swagger.js

/**
 * @swagger
 * components:
 *   schemas:
 *     Door:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Уникальный идентификатор двери
 *         title:
 *           type: string
 *           description: Название двери
 *         ip:
 *           type: string
 *           description: IP-адрес двери
 *         port:
 *           type: string
 *           description: Порт двери
 *         status:
 *           type: string
 *           enum: [active, inactive, deleted]
 *           description: Статус двери
 *         type:
 *           type: string
 *           enum: [exit, enter]
 *           descpription: Тип двери
 *         login:
 *           type: string
 *           description: Логин для доступа к двери
 *         password:
 *           type: string
 *           description: Пароль для доступа к двери
 *         isOpen:
 *           type: boolean
 *           description: Флаг на доступ двери извне
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Время создания двери
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Время последнего обновления двери
 *       required:
 *         - _id
 *         - title
 *         - ip
 *         - status
 *         - type
 *         - login
 *         - password
 *         - isOpen
 *         - createdAt
 *         - updatedAt
 * 
 *     DoorCreateRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Название двери
 *         ip:
 *           type: string
 *           description: IP-адрес двери
 *         port:
 *           type: string
 *           description: Порт двери
 *         type:
 *           type: string
 *           description: Тип двери
 *         login:
 *           type: string
 *           description: Логин для доступа к двери
 *         password:
 *           type: string
 *           description: Пароль для доступа к двери
 *         isOpen:
 *           type: boolean
 *           description: Флаг на доступ двери извне
 *       required:
 *         - title
 *         - ip
 *         - type
 *         - login
 *         - password
 *         - isOpen
 * 
 *     DoorUpdateRequest:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Уникальный идентификатор двери
 *         title:
 *           type: string
 *           description: Название двери
 *         ip:
 *           type: string
 *           description: IP-адрес двери
 *         port:
 *           type: string
 *           description: Порт двери
 *         type:
 *           type: string
 *           description: Тип двери
 *         login:
 *           type: string
 *           description: Логин для доступа к двери
 *         password:
 *           type: string
 *           description: Пароль для доступа к двери
 *         isOpen:
 *           type: boolean
 *           description: Флаг на доступ двери извне
 *       required:
 *         - _id
 *         - title
 *         - ip
 *         - type
 *         - login
 *         - password
 *         - isOpen
 * 
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /door:
 *   get:
 *     summary: Получить список дверей
 *     description: Возвращает список дверей с возможностью фильтрации и пагинации
 *     tags:
 *       - Doors
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Фильтр по названию двери (частичное совпадение)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Номер страницы
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           enum: [30, 50, 100]
 *         description: Количество элементов на странице
 *     responses:
 *       200:
 *         description: Список дверей
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Общее количество дверей
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Door'
 *       400:
 *         description: Неверные параметры запроса
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 * 
 *   post:
 *     summary: Создать новую дверь
 *     description: Создает новую дверь с указанными параметрами
 *     tags:
 *       - Doors
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DoorCreateRequest'
 *     responses:
 *       201:
 *         description: Дверь создана
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Door'
 *       400:
 *         description: Неверные данные запроса
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 * 
 *   put:
 *     summary: Обновить дверь
 *     description: Обновляет дверь с указанными параметрами
 *     tags:
 *       - Doors
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DoorUpdateRequest'
 *     responses:
 *       200:
 *         description: Дверь обновлена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Door'
 *       400:
 *         description: Неверные данные запроса
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 *       404:
 *         description: Дверь не найдена
 * 
 * /door/status/{id}:
 *   get:
 *     summary: Изменить статус двери
 *     description: Изменяет статус двери на противоположный
 *     tags:
 *       - Doors
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID двери
 *     responses:
 *       200:
 *         description: Статус двери изменен
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Door'
 *       400:
 *         description: Неверный ID
 *       401:
 *         description: Не авторизован
 * 
 * /door/{id}:
 *   get:
 *     summary: Получить одну дверь
 *     description: Возвращает дверь по ее ID
 *     tags:
 *       - Doors
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID двери
 *     responses:
 *       200:
 *         description: Дверь найдена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Door'
 *       400:
 *         description: Неверный ID
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 *       404:
 *         description: Дверь не найдена
 * 
 *   delete:
 *     summary: Удалить дверь
 *     description: Удаляет дверь по ее ID
 *     tags:
 *       - Doors
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID двери
 *     responses:
 *       200:
 *         description: Дверь удалена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: deleted
 *       400:
 *         description: Неверный ID
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 *       404:
 *         description: Дверь не найдена
 */

/**
 * @swagger
 * securitySchemes:
 *   bearerAuth:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT
 */