module.exports = {
    Day: class Day {
        constructor(day, date, meals) {
            this.day = day
            this.date = date
            this.meals = meals
        }
    },
    Meal: class Meal {
        constructor(title, price, furtherInformation, types) {
            this.title = title
            this.price = price
            this.furtherInformation = furtherInformation
            this.types = types
        }
    }
} 