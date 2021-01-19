const express = require('express')
const { getWeekDayMealOfWeeknum } = require('./database');
const { getCurrentWeeknum } = require('./date-utils');

const app = express()
const port = process.env.PORT || 5000
const simpleWeekDayMealCache = new WeakMap()

app.get('/', (req, res) => {
    res.send('online')
})

app.get('/current-week', async (req, res) => {
    const weeknum = getCurrentWeeknum()
    if (simpleWeekDayMealCache.has(weeknum)) {
        res.status(200).send(simpleWeekDayMealCache.get(weeknum))
    } else {
        try {
            const thisWeek = await getWeekDayMealOfWeeknum(weeknum)
            simpleWeekDayMealCache.set(weeknum, thisWeek)
            res.status(200).send(thisWeek)
        } catch (err) {
            res.status(500).send(err.message)
        }
    }
})

app.get('/week/:weeknum', async (req, res) => {
    const weeknum = parseInt(req.params.weeknum)
    if (isNaN(weeknum)) {
        res.status(400).send('Path parameter weeknum is not a number. Given: "' + req.params.weeknum + '" Type: ' + typeof req.params.weeknum)
    }
    if (simpleWeekDayMealCache.has(weeknum)) {
        res.status(200).send(simpleWeekDayMealCache.get(weeknum))
    } else {
        try {
            const weekDayMeal = await getWeekDayMealOfWeeknum(weeknum)
            simpleWeekDayMealCache.set(weeknum, weekDayMeal)
            res.status(200).send(weekDayMeal)
        } catch (err) {
            res.status(500).send(err.message)
        }
    }
})

app.listen(port, () => {
    console.log(`Listening on ${port}`)
})
