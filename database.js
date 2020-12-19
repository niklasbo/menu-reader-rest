const mongoose = require('mongoose')

const mongodbConnectionString = process.env.MONGODB_CONNECTION_STRING || ''
const mongodbCollection = process.env.MONGODB_COLLECTION || ''

if (mongodbConnectionString.length == 0) {
    throw new Error('Set Environment Variable MONGODB_CONNECTION_STRING')
}
if (mongodbCollection.length == 0) {
    throw new Error('Set Environment Variable MONGODB_COLLECTION')
}

const WeeknumImageSchema = new mongoose.Schema({
    weeknum: Number,
    jpegImageAsBase64String: String
}, { collection: mongodbCollection });

const MealSchema = new mongoose.Schema({
    title: String,
    price: String,
    furtherInformation: [String],
    types: [String]
}, { collection: mongodbCollection });

const DaySchema = new mongoose.Schema({
    day: String,
    date: Date,
    meals: [MealSchema]
}, { collection: mongodbCollection });

const WeekDayMealSchema = new mongoose.Schema({
    weeknum: Number,
    days: [DaySchema],
}, { collection: mongodbCollection });

const WeeknumImage = mongoose.model('WeeknumImage', WeeknumImageSchema)


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

async function getImageOfWeeknum(weeknumToRead) {
    const result = await WeeknumImage.findOne({ weeknum: weeknumToRead }).exec()
    if (result != null) {
        return result.jpegImageAsBase64String
    }
    throw new Error('No results returned, is this weeknum already in database?')
}

exports.getImageOfWeeknum = getImageOfWeeknum