const moment = require('moment')

module.exports = {
    getCurrentWeeknum: function getCurrentWeeknum() {
        return moment().locale('de').week()
    }
}