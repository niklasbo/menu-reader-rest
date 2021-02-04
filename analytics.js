const { InfluxDB, Point } = require('@influxdata/influxdb-client')

const influxDbUrl = process.env.INFLUXDB_URL || ''
const influxDbToken = process.env.INFLUXDB_TOKEN || ''
const influxDbOrganization = process.env.INFLUXDB_ORGANIZATION || ''
const influxDbBucket = process.env.INFLUXDB_BUCKET || ''

if (influxDbUrl.length == 0) {
    throw new Error('Set Environment Variable INFLUXDB_URL')
}
if (influxDbToken.length == 0) {
    throw new Error('Set Environment Variable INFLUXDB_TOKEN')
}
if (influxDbOrganization.length == 0) {
    throw new Error('Set Environment Variable INFLUXDB_ORGANIZATION')
}
if (influxDbBucket.length == 0) {
    throw new Error('Set Environment Variable INFLUXDB_BUCKET')
}
const client = new InfluxDB({ url: influxDbUrl, token: influxDbToken })

module.exports = {
    writeStatisticPoint: async function writeStatisticPoint(clickedPath, userAgent) {
        const writeApi = client.getWriteApi(influxDbOrganization, influxDbBucket)
        writeApi.useDefaultTags({ service: 'rest' })

        const point = new Point('clicks')
            .tag('path', clickedPath)
            .tag('userAgent', userAgent === undefined || userAgent.trim().length === '' ? 'none' : userAgent)
            .intField('click', 1)
        writeApi.writePoint(point)
        writeApi
            .close()
            .catch(e => {
                console.log('ERROR in Influx closing!')
                console.error(e)
            })
    }
}
