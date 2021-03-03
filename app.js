const express = require('express')
const { getWeekDayMealOfWeeknum } = require('./database');
const { getCurrentWeeknum, getTodayFormatted, getTodayDayNameFormatted } = require('./date-utils');
const { mapMongoWeekDayMealToArrayOfDays } = require('./model-mapper');
const { Day } = require('./models');
const path = require('path');
const { writeStatisticPoint } = require('./analytics');
const { removeOldDays } = require('./widget-full-utils');

const app = express()
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
const port = process.env.PORT || 7000
const simpleWeekDayMealCache = new Map()

app.get('/', async (req, res) => {
    writeStatisticPoint('/', req.get('user-agent'))
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

app.get('/rate', async (req, res) => {
    writeStatisticPoint('/rate', req.get('user-agent'))
    const weeknum = getCurrentWeeknum()
    const date = req.query.date
    const mealIndex = req.query.meal
    if (!simpleWeekDayMealCache.has(weeknum)) {
        try {
            await loadWeekInCache(weeknum)
        } catch (err) {
            console.log(err)
            res.render('rate', { 'date': date, 'mealIndex': mealIndex, 'mealTitle': findMealTitleInCache(weeknum, date, mealIndex)})
        }
    }
    res.render('rate', { 'date': date, 'mealIndex': mealIndex, 'mealTitle': findMealTitleInCache(weeknum, date, mealIndex)})
})

app.get('/vote', async (req, res) => {
    writeStatisticPoint('/vote', req.get('user-agent'))
    const weeknum = getCurrentWeeknum()
    const date = req.query.date
    const mealIndex = req.query.meal
    const stars = req.query.stars
    if (date !== undefined && mealIndex !== undefined && stars !== undefined) {
        //todo find meal and update stars
    }
    res.redirect('/')
})

app.get('/today', async (req, res) => {
    writeStatisticPoint('/today', req.get('user-agent'))
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

function findMealTitleInCache(weeknum, formattedDate, mealIndexToFind) {
    const dayObj = findDayObjectInCache(weeknum, formattedDate)
    if (mealIndexToFind >= 0 && mealIndexToFind < dayObj.meals.length) {
        return dayObj.meals[mealIndexToFind].title
    }
    return undefined
}

function findDayObjectInCache(weeknum, formattedDateToFind) {
    const found = simpleWeekDayMealCache.get(weeknum).find(day => day.date === formattedDateToFind)
    return found !== undefined ? found : createEmptyTodayArray()
}

function createEmptyTodayArray() {
    return new Day(getTodayDayNameFormatted(), getTodayFormatted(), [])
}

app.get('/current-week', async (req, res) => {
    writeStatisticPoint('/current-week', req.get('user-agent'))
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

app.get('/current-week-full', async (req, res) => {
    writeStatisticPoint('/current-week-full', req.get('user-agent'))
    const weeknum = getCurrentWeeknum()
    if (simpleWeekDayMealCache.has(weeknum)) {
        res.status(200).send({ status: "success", weeknum: weeknum, data: removeOldDays(simpleWeekDayMealCache.get(weeknum)) })
    } else {
        try {
            const thisWeek = await loadWeekInCache(weeknum)
            res.status(200).send({ status: "success", weeknum: weeknum, data: removeOldDays(thisWeek) })
        } catch (err) {
            console.log(err)
            res.status(500).send({ status: "error", weeknum: weeknum, data: err.message })
        }
    }
})

app.get('/week/:weeknum', async (req, res) => {
    writeStatisticPoint('/week/:weeknum', req.get('user-agent'))
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
