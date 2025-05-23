import { Router } from "express";
import passport from "../../middleware/auth.js";
import { top } from "../../middleware/role.js";
import { validateObjectId } from "../../middleware/validate.js";
const router = Router();

import { getUserCalendar } from "../../controllers/statistic/user.js";

router.get("/calendar", passport.authenticate("jwt", { session: false }), validateObjectId("query", "_id"), top, getUserCalendar);

export default router;

/**
 * @swagger
 * /statistic/user/calendar:
 *   get:
 *     summary: Получение календаря пользователя за указанный месяц
 *     description: |
 *       Возвращает подробную информацию о календаре пользователя за указанный месяц.
 *       Включает данные из личного календаря, рабочих дней департамента, отсутствий,
 *       праздников и фактических посещений.
 *     tags:
 *       - Статистика пользователей
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: _id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID пользователя
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 0
 *           maximum: 11
 *         description: Месяц (0-11, где 0 - январь), по умолчанию текущий месяц
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           minimum: 2020
 *         description: Год, по умолчанию текущий год
 *     responses:
 *       200:
 *         description: Успешное получение календаря
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   day:
 *                     type: integer
 *                     description: День месяца
 *                   reason:
 *                     type: string
 *                     description: Причина отсутствия (если есть)
 *                   dayStatus:
 *                     type: string
 *                     enum: [workday, absence, holiday, weekend]
 *                     description: Статус дня
 *                   isWorkingDay:
 *                     type: boolean
 *                     description: Является ли день рабочим
 *                   workDuration:
 *                     type: number
 *                     description: Продолжительность рабочего дня в часах
 *                   arrival:
 *                     type: string
 *                     format: date-time
 *                     description: Время прихода
 *                   departure:
 *                     type: string
 *                     format: date-time
 *                     description: Время ухода
 *                   shift:
 *                     type: string
 *                     enum: [morning, afternoon, night, full_day, off]
 *                     description: Тип смены
 *                   status:
 *                     type: string
 *                     description: Статус дня в календаре
 *                   events:
 *                     type: array
 *                     description: События посещений за день
 *                     items:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: stringS
 *                         date:
 *                           type: string
 *                           format: date-time
 *                         time:
 *                           type: string
 *                         status:
 *                           type: string
 *                   attended:
 *                     type: boolean
 *                     description: Присутствовал ли сотрудник в этот день
 *       400:
 *         description: Ошибка в параметрах запроса
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Недостаточно прав
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Внутренняя ошибка сервера
 */