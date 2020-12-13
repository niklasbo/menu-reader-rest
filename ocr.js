const path = require('path');
const { createWorker } = require('tesseract.js')

module.exports = {
    imageToText: async function imageToText(filepath) {
        const pathToTrainedData = path.join(__dirname, 'lang-data')
        console.log(pathToTrainedData)

        const worker = createWorker({
            langPath: pathToTrainedData, //set for faster offline converting
        });
        await worker.load()
        await worker.loadLanguage('deu')
        await worker.initialize('deu')

        const values = []
        for (let i = 0; i < rectangles.length; i++) {
            const { data: { text } } = await worker.recognize(filepath, { rectangle: rectangles[i] })
            console.log(text)
            values.push(text)
        }
        await worker.terminate()
        return values
    }
}

const heightStart = process.env.HEIGHT_START || 260
const heightEnd = process.env.HEIGTH_END || 1160

const firstStart = process.env.FIRST_START || 240
const firstEnd = process.env.FIRST_END || 525
const secondStart = process.env.SECOND_START || 570
const secondEnd = process.env.SECOND_END || 845
const thirdStart = process.env.THIRD_START || 890
const thirdEnd = process.env.THIRD_END || 1170
const fourthStart = process.env.FOURTH_START || 1210
const fourthEnd = process.env.FOURTH_END || 1490
const fifthStart = process.env.FIFTH_START || 1535
const fifthEnd = process.env.FIFTH_END || 1785

const rectangleHeight = heightEnd - heightStart;
const rectangles = [
    {
        left: firstStart,
        top: heightStart,
        width: firstEnd - firstStart,
        height: rectangleHeight,
    },
    {
        left: secondStart,
        top: heightStart,
        width: secondEnd - secondStart,
        height: rectangleHeight,
    },
    {
        left: thirdStart,
        top: heightStart,
        width: thirdEnd - thirdStart,
        height: rectangleHeight,
    },
    {
        left: fourthStart,
        top: heightStart,
        width: fourthEnd - fourthStart,
        height: rectangleHeight,
    },
    {
        left: fifthStart,
        top: heightStart,
        width: fifthEnd - fifthStart,
        height: rectangleHeight,
    }
];
