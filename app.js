const express = require('express')
const moment = require('moment')
const fs = require('fs')
const stream = require('stream')
const tmp = require('tmp');
const ocr = require('./ocr')
const { ocrResultsToWeekDayMeal } = require('./ocr-converter');
const { getImageOfWeeknum, saveWeekDayMeal } = require('./database');

const app = express()
const port = process.env.PORT || 5000

app.get('/', (req, res) => {
    res.send('online')
})

app.get('/ocr', (req, res) => {
    try {
        handleOcr()
        res.status(200).send('accepted')
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

app.listen(port, () => {
    console.log(`Listening on ${port}`)
})

async function handleOcr() {
    const weeknum = moment().locale('de').week()
    console.log(weeknum)
    try {
        const jpegImageAsBase64String = await getImageOfWeeknum(weeknum)
        console.log(jpegImageAsBase64String.length)

        const filepathOfImage = await base64StringToJpeg(jpegImageAsBase64String)
        console.log(filepathOfImage)

        const values = await ocr.imageToText(filepathOfImage)
        console.log(values.length)

        const weekDayMealObject = ocrResultsToWeekDayMeal(weeknum, values)
        console.log(weekDayMealObject)

        await saveWeekDayMeal(weekDayMealObject)
    } catch (err) {
        console.log(err)
    }
}

async function base64StringToJpeg(base64String) {
    return new Promise((resolve, reject) => {
        const tmpobj = tmp.fileSync()
        const filename = tmpobj.name

        const imageBufferData = Buffer.from(String(base64String), 'base64')
        const streamObj = new stream.Readable()
        streamObj.push(imageBufferData)
        streamObj.push(null)
        streamObj.pipe(fs.createWriteStream(filename))

        streamObj.on('end', () => {
            resolve(filename)
        })
        streamObj.on('error', (err) => reject(err))
    })
}
