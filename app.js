const express = require('express')
const { getWeekDayMealOfWeeknum } = require('./database');
const { getCurrentWeeknum, getTodayFormatted } = require('./date-utils');
const { mapMongoWeekDayMealToArrayOfDays } = require('./model-mapper');

const app = express()
const port = process.env.PORT || 7000
const simpleWeekDayMealCache = new Map()

app.get('/', (req, res) => {
    res.send('online')
})

app.get('/today', async (req, res) => {
    const weeknum = getCurrentWeeknum()
    const todayFormatted = getTodayFormatted()
    if (!simpleWeekDayMealCache.has(weeknum)) {
        try {
            await loadWeekInCache(weeknum)
        } catch (err) {
            console.log(err)
            res.status(500).send(err.message)
        }
    }
    res.status(200).send(findDayObjectInCache(weeknum, todayFormatted))
})

function findDayObjectInCache(weeknum, formattedDateToFind) {
    return simpleWeekDayMealCache.get(weeknum).find(day => day.date === formattedDateToFind);
}

app.get('/current-week', async (req, res) => {
    const weeknum = getCurrentWeeknum()
    if (simpleWeekDayMealCache.has(weeknum)) {
        res.status(200).send(simpleWeekDayMealCache.get(weeknum))
    } else {
        try {
            const thisWeek = await loadWeekInCache(weeknum)
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
            const mappedDays = await loadWeekInCache(weeknum)
            res.status(200).send(mappedDays)
        } catch (err) {
            console.log(err)
            res.status(500).send(err.message)
        }
    }
})

async function loadWeekInCache(weeknum) {
    const mongoWeekDayMeal = await getWeekDayMealOfWeeknum(weeknum)
    const mappedWeek = mapMongoWeekDayMealToArrayOfDays(mongoWeekDayMeal)
    simpleWeekDayMealCache.set(weeknum, mappedWeek)
    return mappedWeek
}

app.listen(port, () => {
    console.log(`Listening on ${port}`)
})
