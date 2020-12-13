module.exports = {
    Meal: class Meal {
        constructor(title, price, furtherInformation, types) {
            this.title = title
            this.price = price
            this.furtherInformation = furtherInformation
            this.types = types
        }
    }
}