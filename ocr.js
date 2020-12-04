const path = require('path');
const { createWorker, PSM } = require('tesseract.js')



module.exports = {
    imageToText: async function imageToText(filepath) {
        const pathToTrainedData = path.join(__dirname, 'lang-data')
        console.log(pathToTrainedData)

        const worker = createWorker({
            langPath: pathToTrainedData
        });
        await worker.load()
        await worker.loadLanguage('deu')
        await worker.initialize('deu')
        await worker.setParameters({
            tessedit_pageseg_mode: PSM.SINGLE_BLOCK_VERT_TEXT,
        });

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
const firstEnd = process.env.FIRST_END || 550
const secondStart = process.env.SECOND_START || firstEnd
const secondEnd = process.env.SECOND_END || 870
const thirdStart = process.env.THIRD_START || secondEnd
const thirdEnd = process.env.THIRD_END || 1200
const fourthStart = process.env.FOURTH_START || thirdEnd
const fourthEnd = process.env.FOURTH_END || 1515
const fifthStart = process.env.FIFTH_START || fourthEnd
const fifthEnd = process.env.FIFTH_END || 1850

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
