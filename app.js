const express = require('express')
const { getWeekDayMealOfWeeknum } = require('./database');
const { getCurrentWeeknum, getTodayFormatted, getTodayDayNameFormatted } = require('./date-utils');
const { mapMongoWeekDayMealToArrayOfDays } = require('./model-mapper');
const { Day } = require('./models');
const path = require('path');

const app = express()
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
const port = process.env.PORT || 7000
const simpleWeekDayMealCache = new Map()

app.get('/', async (req, res) => {
    const weeknum = getCurrentWeeknum()
    const todayFormatted = getTodayFormatted()
    if (!simpleWeekDayMealCache.has(weeknum)) {
        try {
            await loadWeekInCache(weeknum)
        } catch (err) {
            console.log(err)
            res.render('index', { 'mealsToday': createEmptyTodayArray() })
        }
    }
    res.render('index', { 'mealsToday': findDayObjectInCache(weeknum, todayFormatted) })
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
    const found = simpleWeekDayMealCache.get(weeknum).find(day => day.date === formattedDateToFind)
    return found !== undefined ? found : createEmptyTodayArray()
}

function createEmptyTodayArray() {
    return new Day(getTodayDayNameFormatted(), getTodayFormatted(), [])
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
