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
 *                   date:
 *                     type: string
 *                     format: date-time
 *                     description: Дата
 *                   dayOfWeek:
 *                     type: integer
 *                     description: День недели (0 - воскресенье, 1 - понедельник и т.д.)
 *                   day:
 *                     type: integer
 *                     description: День месяца
 *                   month:
 *                     type: integer
 *                     description: Месяц (0-11)
 *                   year:
 *                     type: integer
 *                     description: Год
 *                   isWorkingDay:
 *                     type: boolean
 *                     description: Является ли день рабочим
 *                   shift:
 *                     type: string
 *                     enum: [morning, afternoon, night, full_day, off]
 *                     description: Тип смены
 *                   status:
 *                     type: string
 *                     description: Статус дня в календаре
 *                   notes:
 *                     type: string
 *                     description: Заметки к дню (если есть)
 *                   workDay:
 *                     type: string
 *                     description: Название рабочего дня (если это особый рабочий день)
 *                   holiday:
 *                     type: string
 *                     description: Название праздника (если это праздник)
 *                   absence:
 *                     type: object
 *                     description: Информация об отсутствии (если пользователь отсутствовал)
 *                     properties:
 *                       reason:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           title:
 *                             type: string
 *                           shortName:
 *                             type: string
 *                       type:
 *                         type: string
 *                       status:
 *                         type: string
 *                   events:
 *                     type: array
 *                     description: События посещений за день
 *                     items:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
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