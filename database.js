const mongoose = require('mongoose')

const mongodbConnectionString = process.env.MONGODB_CONNECTION_STRING || ''
const mongodbWeekDayMealCollection = process.env.MONGODB_WEEKDAYMEAL_COLLECTION || ''
const mongodbMealRatingsCollection = process.env.MONGODB_MEAL_RATINGS_COLLECTION || ''

if (mongodbConnectionString.length == 0) {
    throw new Error('Set Environment Variable MONGODB_CONNECTION_STRING')
}
if (mongodbWeekDayMealCollection.length == 0) {
    throw new Error('Set Environment Variable MONGODB_WEEKDAYMEAL_COLLECTION')
}
if (mongodbMealRatingsCollection.length == 0) {
    throw new Error('Set Environment Variable MONGODB_MEAL_RATINGS_COLLECTION')
}

const MealSchema = new mongoose.Schema({
    title: String,
    price: String,
    furtherInformation: [String],
    types: [String]
}, { collection: undefined });

const DaySchema = new mongoose.Schema({
    day: String,
    date: String,
    meals: [MealSchema]
}, { collection: undefined });

const WeekDayMealSchema = new mongoose.Schema({
    weeknum: Number,
    days: [DaySchema],
}, { collection: mongodbWeekDayMealCollection });

const MealRatingSchema = new mongoose.Schema({
    mealTitle: String,
    rating: Number,
    rates: Number,
}, { collection: mongodbMealRatingsCollection })

const Day = mongoose.model('Day', DaySchema)
const Meal = mongoose.model('Meal', MealSchema)
const WeekDayMeal = mongoose.model('WeekDayMeal', WeekDayMealSchema)
const MealRating = mongoose.model('MealRating', MealRatingSchema)

mongoose.connect(mongodbConnectionString, function (err) {
    if (err) {
        console.log(err)
        throw err
    }
})

async function getWeekDayMealOfWeeknum(weeknumToRead) {
    const result = await WeekDayMeal.findOne({ weeknum: weeknumToRead }).exec()
    if (result != null) {
        return result
    }
    throw new Error(`No results returned, is this WeekDayMeal (weeknum = ${weeknumToRead}) as object in database?`)
}

async function getMealRating(mealTitleToFind) {
    const normalizedTitle = normalizeTitle(mealTitleToFind)
    const result = await MealRating.findOne({ mealTitle: normalizedTitle }).exec()
    if (result != null) {
        return { 'rating': result.rating, 'rates': result.rates }
    }
    return { 'rating': 0, 'rates': 0 }
}

async function addMealRating(mealTitleToRate, stars) {
    const normalizedTitle = normalizeTitle(mealTitleToRate)
    const result = await MealRating.findOne({ mealTitle: normalizedTitle }).exec()
    var updatedRating = stars
    var updatedRates = 1
    if (result != null) {
        updatedRating = ((result.rating * result.rates) + stars) / (result.rates + 1)
        updatedRates = result.rates + 1
    }
    await MealRating.findOneAndUpdate({ mealTitle: normalizedTitle }, { mealTitle: normalizedTitle, rating: updatedRating, rates: updatedRates }, { upsert: true })
}

function normalizeTitle(title) {
    const lower = title.toLowerCase()
    return lower.replace(/[^a-zA-ZäüöÄÜÖß]+/g, '');
}

exports.getWeekDayMealOfWeeknum = getWeekDayMealOfWeeknum
exports.getMealRating = getMealRating
exports.addMealRating = addMealRating
exports.WeekDayMeal = WeekDayMeal
exports.Day = Day
exports.Meal = Meal
