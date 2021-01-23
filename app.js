const express = require('express')
const { getWeekDayMealOfWeeknum } = require('./database');
const { getCurrentWeeknum } = require('./date-utils');
const { mapMongoWeekDayMealToArrayOfDays } = require('./model-mapper');

const app = express()
const port = process.env.PORT || 7000
const simpleWeekDayMealCache = new Map()

app.get('/', (req, res) => {
    res.send('online')
})

app.get('/current-week', async (req, res) => {
    const weeknum = getCurrentWeeknum()
    if (simpleWeekDayMealCache.has(weeknum)) {
        res.status(200).send(simpleWeekDayMealCache.get(weeknum))
    } else {
        try {
            const mongoWeekDayMeal = await getWeekDayMealOfWeeknum(weeknum)
            const thisWeek = mapMongoWeekDayMealToArrayOfDays(mongoWeekDayMeal)
            simpleWeekDayMealCache.set(weeknum, thisWeek)
            res.status(200).send(thisWeek)
        } catch (err) {
            console.log(err)
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
            const mappedDays = mapMongoWeekDayMealToArrayOfDays(weekDayMeal)
            simpleWeekDayMealCache.set(weeknum, mappedDays)
            res.status(200).send(mappedDays)
        } catch (err) {
            console.log(err)
            res.status(500).send(err.message)
        }
    }
})

app.listen(port, () => {
    console.log(`Listening on ${port}`)
})
