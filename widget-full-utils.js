const moment = require('moment')
const { getTodayFormatted } = require('./date-utils');

module.exports = {
    removeOldDays: function removeOldDays(listOfDays, today = moment(getTodayFormatted(), 'DD.MM.YYYY')) {
        const orderedList = []
        const listBefore = []
        var shifts = 0
        for(i = 0; i < listOfDays.length; i++) {
            if (moment(listOfDays[i].date, 'DD.MM.YYYY').isBefore(today)) {
                listBefore.push(listOfDays[i])
            } else {
                orderedList.push(listOfDays[i])
                shifts++
            }
        }
        for(i = 2; i > shifts && listBefore.length > 0; i--) {
            orderedList.unshift(listBefore[listBefore.length -1])
            listBefore.pop()
        }
        return orderedList
    }
}