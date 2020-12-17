const test = require('ava')
const { getMondayPlusXDateOfWeeknum } = require('./date-utils')

test('test-getMondayPlusXDateOfWeeknum', t => {
    t.deepEqual(getMondayPlusXDateOfWeeknum(50, 0), { day: 'Montag', date: '07.12.2020' })
    t.deepEqual(getMondayPlusXDateOfWeeknum(50, 1), { day: 'Dienstag', date: '08.12.2020' })
    t.deepEqual(getMondayPlusXDateOfWeeknum(50, 2), { day: 'Mittwoch', date: '09.12.2020' })
    t.deepEqual(getMondayPlusXDateOfWeeknum(50, 6), { day: 'Sonntag', date: '13.12.2020' })
})