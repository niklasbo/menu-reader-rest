const mongoose = require('mongoose')

const mongodbConnectionString = process.env.MONGODB_CONNECTION_STRING || ''
const mongodbWeeknumImageCollection = process.env.MONGODB_WEEKNUM_IMAGE_COLLECTION || ''
const mongodbWeekDayMealCollection = process.env.MONGODB_WEEKDAYMEAL_COLLECTION || ''

if (mongodbConnectionString.length == 0) {
    throw new Error('Set Environment Variable MONGODB_CONNECTION_STRING')
}
if (mongodbWeeknumImageCollection.length == 0) {
    throw new Error('Set Environment Variable MONGODB_WEEKNUM_IMAGE_COLLECTION')
}
if (mongodbWeekDayMealCollection.length == 0) {
    throw new Error('Set Environment Variable MONGODB_WEEKDAYMEAL_COLLECTION')
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

const Day = mongoose.model('Day', DaySchema)
const Meal = mongoose.model('Meal', MealSchema)
const WeekDayMeal = mongoose.model('WeekDayMeal', WeekDayMealSchema)

mongoose.connect(mongodbConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, function (err) {
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
    throw new Error('No results returned, is this WeekDayMeal as object in database?')
}

exports.getWeekDayMealOfWeeknum = getWeekDayMealOfWeeknum
exports.WeekDayMeal = WeekDayMeal
exports.Day = Day
exports.Meal = Meal
