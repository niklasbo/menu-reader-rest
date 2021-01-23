const { Meal, Day } = require('./models');

module.exports = {
    mapMongoWeekDayMealToArrayOfDays: function mapMongoWeekDayMealToArrayOfDays(mongoWeekDayMeal) {
        const resultDays = []
        mongoWeekDayMeal.days.forEach(mongoDay => {
            const mappedMeals = []
            mongoDay.meals.forEach(mongoMeal => {
                mappedMeals.push(new Meal(mongoMeal.title, mongoMeal.price, mongoMeal.furtherInformation, mongoMeal.types))
            })
            resultDays.push(new Day(mongoDay.day, mongoDay.date, mappedMeals))
        });
        return resultDays
    }
}
