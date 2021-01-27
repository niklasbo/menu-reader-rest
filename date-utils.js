const moment = require('moment')

module.exports = {
    getCurrentWeeknum: function getCurrentWeeknum() {
        return moment().locale('de').week()
    },

    getTodayFormatted: function getToday() {
        return moment().locale('de').format('DD.MM.YYYY')
    },

    getTodayDayNameFormatted: function getTodayDayNameFormatted() {
        return moment().locale('de').format('dddd')
    }
}