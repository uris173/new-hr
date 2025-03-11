import { Router } from "express";
import passport from "../../middleware/auth.js";
import { top } from "../../middleware/role.js";
import { validateObjectId } from "../../middleware/validate.js";
const router = Router();

import {
  all,
  create,
  changeStatus,
  getOne,
  update,
  remove
} from "../../controllers/data/department.js";

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
 * tags:
 *   name: Department
 *   description: Апи для работы с отделами
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /department:
 *   get:
 *     summary: Получить список отделов
 *     tags: [Department]
 *     security:
 *       - bearerAuth: []
 *     description: Возвращает список отделов с возможностью фильтрации и пагинации.
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Фильтр по названию отдела (регистронезависимый поиск).
 *       - in: query
 *         name: type
 *         schema:
 *           type: integer
 *           enum: [0, 1]
 *         description: Фильтр по типу отдела (0 - Department, 1 - Group).
 *       - in: query
 *         name: parent
 *         schema:
 *           type: string
 *         description: ID родительского отдела.
 *       - in: query
 *         name: chief
 *         schema:
 *           type: string
 *         description: ID руководителя отдела.
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, deleted]
 *         description: Фильтр по статусу отдела.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           enum: [30, 50, 100]
 *         description: Количество записей на странице (по умолчанию 30).
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Номер страницы (по умолчанию 1).
 *     responses:
 *       200:
 *         description: Успешный ответ. Возвращает список отделов.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Общее количество найденных отделов.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: ID отдела.
 *                       name:
 *                         type: string
 *                         description: Название отдела.
 *                       type:
 *                         type: integer
 *                         description: Тип отдела (0 - Department, 1 - Group).
 *                       parent:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                         description: Родительский отдел.
 *                       chief:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           fullName:
 *                             type: string
 *                         description: Руководитель отдела.
 *       400:
 *         description: Ошибка валидации запроса.
 *       500:
 *         description: Внутренняя ошибка сервера.
 * 
 *   post:
 *     tags: [Department]
 *     security:
 *       - bearerAuth: []
 *     summary: Создать новый отдел
 *     description: Добавляет новый отдел в базу данных.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *                 description: Название отдела (от 3 до 100 символов).
 *               type:
 *                 type: integer
 *                 enum: [0, 1]
 *                 description: Тип отдела (0 - Department, 1 - Group).
 *               workTime:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     day:
 *                       type: integer
 *                       description: День недели (0 - воскресенье, 6 - суббота).
 *                     startTime:
 *                       type: string
 *                       format: date-time
 *                       description: Время начала работы.
 *                     endTime:
 *                       type: string
 *                       format: date-time
 *                       description: Время окончания работы.
 *               parent:
 *                 type: string
 *                 description: ID родительского отдела (может быть null).
 *               chief:
 *                 type: string
 *                 description: ID руководителя (может быть null).
 *     responses:
 *       201:
 *         description: Отдел успешно создан.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID созданного отдела.
 *                 name:
 *                   type: string
 *                   description: Название отдела.
 *                 type:
 *                   type: integer
 *                   description: Тип отдела (0 - Department, 1 - Group).
 *                 workTime:
 *                   type: array
 *                   description: Рабочие часы отдела.
 *                 parent:
 *                   type: object
 *                   description: Родительский отдел.
 *                 chief:
 *                   type: object
 *                   description: Руководитель отдела.
 *       400:
 *         description: Ошибка валидации запроса.
 *       500:
 *         description: Внутренняя ошибка сервера.
 *   put:
 *     tags: [Department]
 *     security:
 *       - bearerAuth: []
 *     summary: Создать новый отдел
 *     description: Добавляет новый отдел в базу данных.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *             properties:
 *               _id:
 *                   type: string
 *                   description: ID отдела.
 *               name:
 *                 type: string
 *                 description: Название отдела (от 3 до 100 символов).
 *               type:
 *                 type: integer
 *                 enum: [0, 1]
 *                 description: Тип отдела (0 - Department, 1 - Group).
 *               workTime:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     day:
 *                       type: integer
 *                       description: День недели (0 - воскресенье, 6 - суббота).
 *                     startTime:
 *                       type: string
 *                       format: date-time
 *                       description: Время начала работы.
 *                     endTime:
 *                       type: string
 *                       format: date-time
 *                       description: Время окончания работы.
 *               parent:
 *                 type: string
 *                 description: ID родительского отдела (может быть null).
 *               chief:
 *                 type: string
 *                 description: ID руководителя (может быть null).
 *     responses:
 *       200:
 *         description: Отдел успешно создан.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID созданного отдела.
 *                 name:
 *                   type: string
 *                   description: Название отдела.
 *                 type:
 *                   type: integer
 *                   description: Тип отдела (0 - Department, 1 - Group).
 *                 workTime:
 *                   type: array
 *                   description: Рабочие часы отдела.
 *                 parent:
 *                   type: object
 *                   description: Родительский отдел.
 *                 chief:
 *                   type: object
 *                   description: Руководитель отдела.
 *       400:
 *         description: Ошибка валидации запроса.
 *       500:
 *         description: Внутренняя ошибка сервера.
 */

/**
 * @swagger
 * /departments/status/{id}:
 *   get:
 *     tags: [Department]
 *     security:
 *       - bearerAuth: []
 *     summary: Изменить статус отдела
 *     description: Переключает статус отдела между 'active' и 'inactive'.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID отдела, статус которого нужно изменить.
 *     responses:
 *       200:
 *         description: Успешный ответ. Возвращает обновленный отдел.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID отдела.
 *                 name:
 *                   type: string
 *                   description: Название отдела.
 *                 type:
 *                   type: integer
 *                   description: Тип отдела (0 - Department, 1 - Group).
 *                 status:
 *                   type: string
 *                   enum: [active, inactive]
 *                   description: Новый статус отдела.
 *                 parent:
 *                   type: object
 *                   description: Родительский отдел.
 *                 chief:
 *                   type: object
 *                   description: Руководитель отдела.
 *       400:
 *         description: Ошибка запроса. Например, если отдел не найден.
 *       500:
 *         description: Внутренняя ошибка сервера.
 *
 * /department/{id}:
 *   get:
 *     tags: [Department]
 *     security:
 *       - bearerAuth: []
 *     summary: Получить информацию об отделе
 *     description: Возвращает данные конкретного отдела по его ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID отдела.
 *     responses:
 *       200:
 *         description: Успешный ответ. Возвращает данные отдела.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID отдела.
 *                 name:
 *                   type: string
 *                   description: Название отдела.
 *                 type:
 *                   type: integer
 *                   description: Тип отдела (0 - Department, 1 - Group).
 *                 parent:
 *                   type: object
 *                   description: Родительский отдел.
 *                 chief:
 *                   type: object
 *                   description: Руководитель отдела.
 *       400:
 *         description: Ошибка запроса. Например, если отдел не найден.
 *       500:
 *         description: Внутренняя ошибка сервера.
 *   delete:
 *     tags: [Department]
 *     security:
 *       - bearerAuth: []
 *     summary: Удалить отдел
 *     description: Меняет статус отдела на 'deleted'.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID отдела, который нужно удалить.
 *     responses:
 *       200:
 *         description: Успешный ответ. Возвращает ID удаленного отдела.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID удаленного отдела.
 *       400:
 *         description: Ошибка запроса. Например, если отдел не найден.
 *       500:
 *         description: Внутренняя ошибка сервера.
 */
