const express = require('express')
const mongoose = require('mongoose')
const moment = require('moment')
const fs = require('fs')
const stream = require('stream')
const tmp = require('tmp');

const app = express()
const port = process.env.PORT || 5000
const mongodbConnectionString = process.env.MONGODB_CONNECTION_STRING || ''
const mongodbCollection = process.env.MONGODB_COLLECTION || ''


const weeknumImageSchema = new mongoose.Schema({
  weeknum: Number,
  jpegImageAsBase64String: String
}, { collection: mongodbCollection });

const WeeknumImage = mongoose.model('WeeknumImage', weeknumImageSchema)

mongoose.connect(mongodbConnectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}, function (err) {
  if (err) {
    console.log(err)
    throw err
  }
})

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.get('/ocr', (req, res) => {
  const weeknum = moment().week()
  try {
    getImageOfWeeknum(weeknum)

    res.status(200).send('ok')
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
})

app.listen(port, () => {
  console.log(`Listening on ${port}`)
})

function getImageOfWeeknum(weeknumToRead) {
  WeeknumImage.findOne({ weeknum: weeknumToRead }, function (err, result) {
    if (err) {
      throw err
    }
    if (result != null) {
      base64StringToJpeg(result.jpegImageAsBase64String)
      return
    }
    throw new Error('No results returned, is this weeknum already in database')
  })
}

function base64StringToJpeg(base64String) {
  const tmpobj = tmp.fileSync()
  const filename = tmpobj.name
  console.log('Filename: ', filename);

  const imageBufferData = Buffer.from(String(base64String), 'base64')
  const streamObj = new stream.Readable()
  streamObj.push(imageBufferData)
  streamObj.push(null)
  streamObj.pipe(fs.createWriteStream(filename))
  return filename
}