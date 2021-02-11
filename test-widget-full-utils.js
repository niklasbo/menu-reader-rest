const test = require('ava')
const moment = require('moment')
const { removeOldDays } = require('./widget-full-utils')

test('test-removeOldDays-0', t => {
    t.deepEqual(removeOldDays(
        [
            { date: '11.01.2021' },
            { date: '12.01.2021' },
            { date: '13.01.2021' },
            { date: '14.01.2021' },
            { date: '15.01.2021' },
        ],
        moment('11.01.2021', 'DD.MM.YYYY')
    ),
        [
            { date: '11.01.2021' },
            { date: '12.01.2021' },
            { date: '13.01.2021' },
            { date: '14.01.2021' },
            { date: '15.01.2021' },
        ]
    )
})
test('test-orderday-1', t => {
    t.deepEqual(removeOldDays(
        [
            { date: '11.01.2021' },
            { date: '12.01.2021' },
            { date: '13.01.2021' },
            { date: '14.01.2021' },
            { date: '15.01.2021' },
        ],
        moment('12.01.2021', 'DD.MM.YYYY')
    ),
        [
            { date: '12.01.2021' },
            { date: '13.01.2021' },
            { date: '14.01.2021' },
            { date: '15.01.2021' }
        ]
    )
})

test('test-removeOldDays-2', t => {
    t.deepEqual(removeOldDays(
        [
            { date: '11.01.2021' },
            { date: '12.01.2021' },
            { date: '13.01.2021' },
            { date: '14.01.2021' },
            { date: '15.01.2021' },
        ],
        moment('13.01.2021', 'DD.MM.YYYY')
    ),
        [
            { date: '13.01.2021' },
            { date: '14.01.2021' },
            { date: '15.01.2021' }
        ]
    )
}, true)

test('test-removeOldDays-3', t => {
    t.deepEqual(removeOldDays(
        [
            { date: '11.01.2021' },
            { date: '12.01.2021' },
            { date: '13.01.2021' },
            { date: '14.01.2021' },
            { date: '15.01.2021' },
        ],
        moment('14.01.2021', 'DD.MM.YYYY')
    ),
        [
            { date: '14.01.2021' },
            { date: '15.01.2021' }
        ]
    )
})

test('test-removeOldDays-456', t => {
    t.deepEqual(removeOldDays(
        [
            { date: '11.01.2021' },
            { date: '12.01.2021' },
            { date: '13.01.2021' },
            { date: '14.01.2021' },
            { date: '15.01.2021' },
        ],
        moment('15.01.2021', 'DD.MM.YYYY')
    ),
        [
            { date: '14.01.2021' },
            { date: '15.01.2021' }
        ]
    )

    t.deepEqual(removeOldDays(
        [
            { date: '11.01.2021' },
            { date: '12.01.2021' },
            { date: '13.01.2021' },
            { date: '14.01.2021' },
            { date: '15.01.2021' },
        ],
        moment('16.01.2021', 'DD.MM.YYYY')
    ),
        [
            { date: '14.01.2021' },
            { date: '15.01.2021' }
        ]
    )

    t.deepEqual(removeOldDays(
        [
            { date: '11.01.2021' },
            { date: '12.01.2021' },
            { date: '13.01.2021' },
            { date: '14.01.2021' },
            { date: '15.01.2021' },
        ],
        moment('20.01.2021', 'DD.MM.YYYY')
    ),
        [
            { date: '14.01.2021' },
            { date: '15.01.2021' }
        ]
    )
})

test('test-removeOldDays-holidays', t => {
    t.deepEqual(removeOldDays(
        [
            { date: '11.01.2021' },
            { date: '12.01.2021' },
            // 13th have no meals
            { date: '14.01.2021' },
            { date: '15.01.2021' },
        ],
        moment('12.01.2021', 'DD.MM.YYYY')
    ),
        [
            { date: '12.01.2021' },
            { date: '14.01.2021' },
            { date: '15.01.2021' }
        ]
    )
})
