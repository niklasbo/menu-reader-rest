
class Day {
    constructor(day, date, meals) {
        this.day = day
        this.date = date
        this.meals = meals
    }
}

class Meal {
    constructor(title, price, furtherInformation, types) {
        this.title = title
        this.price = price
        this.furtherInformation = furtherInformation
        this.types = types
    }
}

class MealWithRating extends Meal {
    constructor(title, price, furtherInformation, types, rating) {
        super(title, price, furtherInformation, types)
        this.rating = rating
    }
}

exports.Day = Day
exports.Meal = Meal
exports.MealWithRating = MealWithRating
