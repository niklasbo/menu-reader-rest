const { locale } = require('moment')
const moment = require('moment')

module.exports = {

    getMondayPlusXDateOfWeeknum: function getMondayPlusXDateOfWeeknum(weeknum, plusX) {
        const d = moment().locale('de').week(weeknum).weekday(plusX)
        return { day: d.format('dddd'), date: d.format('DD.MM.YYYY') }
    }
}