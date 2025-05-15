import { Router } from "express";
import passport from "../../middleware/auth.js";
import { top } from "../../middleware/role.js";
const router = Router();

import { eventsCount, getDoorEvents, getLastEvents} from "../../controllers/statistic/home.js";

router.get("/events-count", passport.authenticate("jwt", { session: false }), top, eventsCount);
router.get("/last-events", passport.authenticate("jwt", { session: false }), top, getLastEvents);
router.get("/door-events", passport.authenticate("jwt", { session: false }), top, getDoorEvents);

export default router;

/**
 * @swagger
 * /statistic/home/events-count:
 *   get:
 *     summary: Получение статистики событий
 *     description: Возвращает количество событий за сегодня, за неделю, за месяц и всего
 *     tags:
 *       - Home page statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успешное получение статистики
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 today:
 *                   type: integer
 *                   description: Количество событий за сегодня
 *                 week:
 *                   type: integer
 *                   description: Количество событий за последние 7 дней
 *                 month:
 *                   type: integer
 *                   description: Количество событий за текущий месяц
 *                 total:
 *                   type: integer
 *                   description: Общее количество событий за все время
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Недостаточно прав
 *       500:
 *         description: Внутренняя ошибка сервера
 *
 * /statistic/home/last-events:
 *   get:
 *     summary: Получение последних событий и статистики посещений
 *     description: Возвращает статистику по пришедшим и не пришедшим сотрудникам, а также последние события входа и выхода
 *     tags:
 *       - Home page statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успешное получение статистики
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Общее количество активных пользователей (кроме администраторов)
 *                 came:
 *                   type: integer
 *                   description: Количество пользователей, пришедших сегодня
 *                 notCame:
 *                   type: integer
 *                   description: Количество пользователей, не пришедших сегодня
 *                 lastEnter:
 *                   type: object
 *                   description: Последнее событие входа
 *                   properties:
 *                     _id:
 *                       type: string
 *                     type:
 *                       type: string
 *                     time:
 *                       type: string
 *                       format: date-time
 *                     pictureURL:
 *                       type: string
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         fullName:
 *                           type: string
 *                         department:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                     door:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         title:
 *                           type: string
 *                         type:
 *                           type: string
 *                         branch:
 *                           type: object
 *                           properties:
 *                             title:
 *                               type: string
 *                 lastExit:
 *                   type: object
 *                   description: Последнее событие выхода
 *                   properties:
 *                     _id:
 *                       type: string
 *                     type:
 *                       type: string
 *                     time:
 *                       type: string
 *                       format: date-time
 *                     pictureURL:
 *                       type: string
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         fullName:
 *                           type: string
 *                         department:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                     door:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         title:
 *                           type: string
 *                         type:
 *                           type: string
 *                         branch:
 *                           type: object
 *                           properties:
 *                             title:
 *                 lastEvents:
 *                   type: array
 *                   description: Последние 10 событий (кроме последнего входа и выхода)
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       type:
 *                         type: string
 *                       time:
 *                         type: string
 *                         format: date-time
 *                       pictureURL:
 *                         type: string
 *                       user:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           fullName:
 *                             type: string
 *                           department:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                       door:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           title:
 *                             type: string
 *                           type:
 *                             type: string
 *                           branch:
 *                             type: object
 *                             properties:
 *                               title:
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Недостаточно прав
 *       500:
 *         description: Внутренняя ошибка сервера
 *
 * /statistic/home/door-events:
 *   get:
 *     summary: Получение событий по дверям
 *     description: Возвращает список дверей с последними 10 событиями для каждой
 *     tags:
 *       - Home page statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успешное получение данных
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID двери
 *                   events:
 *                     type: array
 *                     description: Последние 10 событий по данной двери
 *                     items:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         type:
 *                           type: string
 *                         time:
 *                           type: string
 *                           format: date-time
 *                         pictureURL:
 *                           type: string
 *                         branch:
 *                           type: object
 *                           properties:
 *                             title:
 *                         user:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                             fullName:
 *                               type: string
 *                             department:
 *                               type: object
 *                               properties:
 *                                 name:
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Недостаточно прав
 *       500:
 *         description: Внутренняя ошибка сервера
 */

