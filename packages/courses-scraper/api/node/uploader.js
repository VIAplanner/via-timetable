require('dotenv').config()
const axios = require("axios")
const fs = require('fs');
const cliProgress = require('cli-progress'); // magic progress bar

const outputPath = "./output/"
const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
let numFiles = 0

// figure out how many files there are
fs.readdirSync(outputPath).forEach((fileName) => {
    numFiles++
})

progressBar.start(numFiles, 0, {speed: "N/A"});

fs.readdirSync(outputPath).forEach(async (fileName, index, arr) => {
    let rawCourseData = fs.readFileSync(outputPath + fileName);
    let courseData = JSON.parse(rawCourseData);
    try {
        await axios.post(`${process.env.API_BASE_URL}/courses?api_key=${process.env.API_KEY}`, courseData)
    } catch (e) {
        console.log(e.message)
    }

    progressBar.increment()

    // if it's the last element, stop the progress bar
    if (index === arr.length - 1) {
        progressBar.stop();

    }

});