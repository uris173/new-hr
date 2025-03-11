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
} from "../../controllers/data/user.js";

router.route('/')
.all(passport.authenticate('jwt', { session: false }), top)
.get(all)
.post(create)
.put(update);

router.get('/status/:id', passport.authenticate('jwt', { session: false }), validateObjectId('params', 'id'), top, changeStatus);

router.route('/:id')
.all(passport.authenticate('jwt', { session: false }), validateObjectId('params', 'id'), top)
.get(getOne)
.delete(remove);


export default router;


/**
 * @swagger
 * /user:
 *   get:
 *     summary: Получить всех пользователей
 *     description: Возвращает список всех пользователей с возможностью фильтрации и пагинации.
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Номер страницы для пагинации (по умолчанию 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Количество записей на странице (по умолчанию 30)
 *       - in: query
 *         name: fullName
 *         schema:
 *           type: string
 *         description: Фильтр по полному имени пользователя
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Фильтр по роли пользователя
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Фильтр по отделу пользователя
 *       - in: query
 *         name: employeeNo
 *         schema:
 *           type: string
 *         description: Фильтр по номеру сотрудника
 *     responses:
 *       200:
 *         description: Список пользователей успешно получен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Общее количество пользователей
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: ID пользователя
 *                       fullName:
 *                         type: string
 *                         description: Полное имя пользователя
 *                       role:
 *                         type: string
 *                         description: Роль пользователя
 *                       department:
 *                         type: string
 *                         description: Отдел пользователя
 *                       employeeNo:
 *                         type: string
 *                         description: Номер сотрудника
 *       400:
 *         description: Ошибка валидации запроса
 *       500:
 *         description: Внутренняя ошибка сервера
 */

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Создать нового пользователя
 *     description: Создает нового пользователя с указанными данными.
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: Полное имя пользователя
 *                 example: Иван Иванов
 *               phone:
 *                 type: string
 *                 description: Телефон пользователя в формате 998 (XX) XXX-XX-XX
 *                 example: 998 (90) 123-45-67
 *               password:
 *                 type: string
 *                 description: Пароль пользователя
 *                 example: password123
 *               role:
 *                 type: string
 *                 description: Роль пользователя
 *                 enum: [boss, chief, worker, guest]
 *                 example: worker
 *               faceUrl:
 *                 type: string
 *                 description: URL фотографии пользователя
 *                 example: http://example.com/photo.jpg
 *               department:
 *                 type: string
 *                 description: ID отдела пользователя
 *                 example: 60d0fe4f5311236168a109ca
 *               workTime:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     day:
 *                       type: integer
 *                       description: День недели (0 - воскресенье, 6 - суббота)
 *                       example: 1
 *                     startTime:
 *                       type: string
 *                       format: date-time
 *                       description: Время начала работы
 *                       example: 2023-01-01T09:00:00Z
 *                     endTime:
 *                       type: string
 *                       format: date-time
 *                       description: Время окончания работы
 *                       example: 2023-01-01T18:00:00Z
 *               sync:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     ip:
 *                       type: string
 *                       format: ipv4
 *                       description: IP адрес для синхронизации
 *                       example: 192.168.1.1
 *                     type:
 *                       type: integer
 *                       description: Тип синхронизации (0 или 1)
 *                       example: 0
 *                     status:
 *                       type: boolean
 *                       description: Статус синхронизации
 *                       example: true
 *     responses:
 *       201:
 *         description: Пользователь успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID пользователя
 *                 fullName:
 *                   type: string
 *                   description: Полное имя пользователя
 *                 phone:
 *                   type: string
 *                   description: Телефон пользователя
 *                 role:
 *                   type: string
 *                   description: Роль пользователя
 *                 faceUrl:
 *                   type: string
 *                   description: URL фотографии пользователя
 *                 department:
 *                   type: string
 *                   description: ID отдела пользователя
 *                 workTime:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       day:
 *                         type: integer
 *                         description: День недели
 *                       startTime:
 *                         type: string
 *                         format: date-time
 *                         description: Время начала работы
 *                       endTime:
 *                         type: string
 *                         format: date-time
 *                         description: Время окончания работы
 *                 sync:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       ip:
 *                         type: string
 *                         format: ipv4
 *                         description: IP адрес для синхронизации
 *                       type:
 *                         type: integer
 *                         description: Тип синхронизации
 *                       status:
 *                         type: boolean
 *                         description: Статус синхронизации
 *       400:
 *         description: Ошибка валидации запроса
 *       500:
 *         description: Внутренняя ошибка сервера
 */

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Получить пользователя по ID
 *     description: Возвращает данные пользователя по его ID.
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Данные пользователя успешно получены
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID пользователя
 *                 fullName:
 *                   type: string
 *                   description: Полное имя пользователя
 *                 phone:
 *                   type: string
 *                   description: Телефон пользователя
 *                 role:
 *                   type: string
 *                   description: Роль пользователя
 *                 faceUrl:
 *                   type: string
 *                   description: URL фотографии пользователя
 *                 department:
 *                   type: string
 *                   description: ID отдела пользователя
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Внутренняя ошибка сервера
 */

/**
 * @swagger
 * /user/status/{id}:
 *   get:
 *     summary: Изменить статус пользователя
 *     description: Переключает статус пользователя между "active" и "inactive".
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Статус пользователя успешно изменен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID пользователя
 *                 fullName:
 *                   type: string
 *                   description: Полное имя пользователя
 *                 phone:
 *                   type: string
 *                   description: Телефон пользователя
 *                 role:
 *                   type: string
 *                   description: Роль пользователя
 *                 faceUrl:
 *                   type: string
 *                   description: URL фотографии пользователя
 *                 department:
 *                   type: string
 *                   description: ID отдела пользователя
 *       400:
 *         description: Пользователь не найден или неверный запрос
 *       500:
 *         description: Внутренняя ошибка сервера
 */

/**
 * @swagger
 * /user:
 *   put:
 *     summary: Обновление пользователя
 *     description: Обновляет данные пользователя по его ID.
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *                 example: "Иван Иванов"
 *               phone:
 *                 type: string
 *                 pattern: "^998 \\((90|91|93|94|95|97|98|99|33|88|50|77)\\) \\d{3}-\\d{2}-\\d{2}$"
 *                 example: "998 (90) 123-45-67"
 *               password:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 50
 *                 example: "securePassword"
 *               role:
 *                 type: string
 *                 enum: ["boss", "chief", "worker", "guest"]
 *                 example: "worker"
 *               faceUrl:
 *                 type: string
 *                 example: "https://example.com/photo.jpg"
 *               department:
 *                 type: string
 *                 nullable: true
 *                 example: "60d5ec49bcffdd1a3c4c6b77"
 *               workTime:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     day:
 *                       type: integer
 *                       minimum: 0
 *                       maximum: 6
 *                       example: 1
 *                     startTime:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-10-01T08:00:00Z"
 *                     endTime:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-10-01T17:00:00Z"
 *               sync:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     ip:
 *                       type: string
 *                       format: ipv4
 *                       example: "192.168.1.1"
 *                     type:
 *                       type: integer
 *                       enum: [0, 1]
 *                       example: 1
 *                     status:
 *                       type: boolean
 *                       example: true
 *     responses:
 *       200:
 *         description: Успешное обновление пользователя
 *       400:
 *         description: Ошибка валидации или доступ запрещен
 *
 * /user/{id}:
 *   delete:
 *     summary: Удаление пользователя
 *     description: Помечает пользователя как удаленного.
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Успешное удаление пользователя
 *       400:
 *         description: Пользователь не найден
 */