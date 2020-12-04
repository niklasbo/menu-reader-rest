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

if (mongodbConnectionString.length == 0) {
  throw new Error('Set Environment Variable MONGODB_CONNECTION_STRING')
}
if (mongodbCollection.length == 0) {
  throw new Error('Set Environment Variable MONGODB_COLLECTION')
}

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
  const weeknum = moment().week()
  console.log(weeknum)
  try {
    const jpegImageAsBase64String = await getImageOfWeeknum(weeknum)
    console.log(jpegImageAsBase64String.length)

    const filepathOfImage = await base64StringToJpeg(jpegImageAsBase64String)
    console.log(filepathOfImage)

  } catch (err) {
    console.log(err)
  }
}

async function getImageOfWeeknum(weeknumToRead) {
  const result = await WeeknumImage.findOne({ weeknum: weeknumToRead }).exec()
  if (result != null) {
    return result.jpegImageAsBase64String
  }
  throw new Error('No results returned, is this weeknum already in database?')
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

    streamObj.on('end', () => resolve(filename))
    streamObj.on('error', (err) => reject(err))
  })
}